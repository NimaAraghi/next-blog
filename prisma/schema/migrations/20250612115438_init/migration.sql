-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "published" SET DEFAULT false,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;
