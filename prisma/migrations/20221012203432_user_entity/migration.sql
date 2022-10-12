/*
  Warnings:

  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "RoleEnumType" AS ENUM ('admin', 'super_moderator', 'moderator', 'promoter', 'user');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "role" "RoleEnumType" DEFAULT 'user';
