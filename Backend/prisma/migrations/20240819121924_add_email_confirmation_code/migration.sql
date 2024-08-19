/*
  Warnings:

  - You are about to drop the column `emailConfirmationToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "emailConfirmationToken",
ADD COLUMN     "emailConfirmationCode" TEXT;
