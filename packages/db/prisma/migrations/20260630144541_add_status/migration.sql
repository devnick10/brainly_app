-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "status" "ContentStatus" NOT NULL DEFAULT 'PROCESSING';
