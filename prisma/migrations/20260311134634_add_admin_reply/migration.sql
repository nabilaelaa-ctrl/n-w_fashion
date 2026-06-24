-- AlterTable
ALTER TABLE `review` ADD COLUMN `adminRepliedAt` DATETIME(3) NULL,
    ADD COLUMN `adminReply` VARCHAR(191) NULL;
