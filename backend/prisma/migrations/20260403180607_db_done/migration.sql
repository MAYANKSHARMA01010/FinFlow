/*
  Warnings:

  - The values [USER] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `gender` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `User` table. All the data in the column will be lost.
  - Added the required column `status` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "FinancialRecordType" AS ENUM ('INCOME', 'EXPENSE');

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('ADMIN', 'ANALYST', 'VIEWER');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
COMMIT;

-- DropIndex
DROP INDEX "User_username_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "gender",
DROP COLUMN "username",
ADD COLUMN     "status" "UserStatus" NOT NULL,
ALTER COLUMN "role" DROP DEFAULT;

-- CreateTable
CREATE TABLE "FinancialRecord" (
    "id" SERIAL NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "type" "FinancialRecordType" NOT NULL,
    "category" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FinancialRecord_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FinancialRecord" ADD CONSTRAINT "FinancialRecord_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
