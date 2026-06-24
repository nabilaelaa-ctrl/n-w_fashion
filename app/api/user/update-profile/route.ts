import { NextApiRequest } from "next"
import { useSession } from "next-auth/react"
import { writeFile, mkdir } from "fs/promises"
import path from "path"
import prisma from "@/lib/prisma"

export const config = {
  api: {
    bodyParser: false,
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

  // Check if the request is a POST request for file upload
  if (req.method === "POST") {
    try {
      const formData = await req.formData()
      const file = formData.get("image") as File
      const userId = session.user.id

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      // Create unique filename
      const bytes = await file.arrayBuffer()
      const ext = file.name.split(".").pop()
      const filename = `${userId}-${Date.now()}.${ext}`

      // Save file to public/uploads directory
      const uploadDir = path.join(process.cwd(), "public/uploads")
      await mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), bytes)

      // Update user in database
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { image: `/uploads/${filename}` },
      })

      return res.status(200).json({
        message: "Profile image updated",
        image: updatedUser.image,
      })
    } catch (error) {
        console.error("Error uploading image:", error)
        return res.status(500).json({ error: "Error uploading image" })
      }
    }

  return res.status(405).json({ error: "Method not allowed" })
}