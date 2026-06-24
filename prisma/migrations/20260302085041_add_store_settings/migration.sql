-- CreateTable
CREATE TABLE `Store` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NULL DEFAULT 'TokoBaju',
    `logo` VARCHAR(191) NULL,
    `address` TEXT NULL,
    `whatsapp` VARCHAR(191) NULL,
    `bankAccounts` JSON NULL,
    `shippingCost` INTEGER NOT NULL DEFAULT 0,
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
