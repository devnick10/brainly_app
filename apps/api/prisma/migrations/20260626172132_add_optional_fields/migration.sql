-- AlterTable
ALTER TABLE "Content" ADD COLUMN     "author" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3),
ADD COLUMN     "siteName" TEXT;
