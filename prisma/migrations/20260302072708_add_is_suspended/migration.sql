/*
  Warnings:

  - Added the required column `receiverName` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `paymentMethod` VARCHAR(191) NOT NULL DEFAULT 'TRANSFER_BANK',
    ADD COLUMN `receiverName` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `orderitem` ADD COLUMN `color` VARCHAR(191) NOT NULL DEFAULT '-',
    ADD COLUMN `size` VARCHAR(191) NOT NULL DEFAULT '-';

-- AlterTable
ALTER TABLE `product` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT 'pakaian',
    ADD COLUMN `colors` VARCHAR(191) NOT NULL DEFAULT 'Hitam,Putih',
    ADD COLUMN `sizeChart` TEXT NULL,
    ADD COLUMN `sizes` VARCHAR(191) NOT NULL DEFAULT 'S,M,L';

-- AlterTable
ALTER TABLE `user` ADD COLUMN `isSuspended` BOOLEAN NOT NULL DEFAULT false;
