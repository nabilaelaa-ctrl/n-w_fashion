import { NextApiRequest } from "next"
import { useSession } from "next-auth/react"
import prisma from "@/lib/prisma"
import bcrypt from "bcryptjs"

export const config = {
  api: {
    bodyParser: true,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(
    req,
    res,
    {
      secret: process.env.NEXTAUTH_SECRET,
    }
  )

  if (!session || !session.user) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  if (req.method === "PUT") {
    try {
      const { currentPassword, newPassword } = req.body

      // Get current user
      const user = await prisma.user.findUnique({
        where: { id: session.user.id },
      })

      if (!user || !user.password) {
        return res.status(400).json({ error: "User not found" })
      }

      // Verify current password
      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user.password
      )

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Invalid current password" })
      }

   
      const hashedPassword = await bcrypt.hash(newPassword, 10)

  
      await prisma.user.update({
        where: { id: session.user.id },
        data: { password: hashedPassword },
      })

      return res.status(200).json({
        message: "Password updated",
      })
    } catch (error) {
      console.error("Error changing password:", error)
      return res.status(500).json({ error: "Error changing password" })
    }
  }

  return res.status(405).json({ error: "Method not allowed" })
}