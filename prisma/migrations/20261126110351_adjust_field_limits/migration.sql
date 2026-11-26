/*
  Warnings:

  - You are about to alter the column `specialty` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(100)`.
  - You are about to alter the column `notes` on the `Appointment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "Appointment" ALTER COLUMN "specialty" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "notes" SET DATA TYPE VARCHAR(1000);
