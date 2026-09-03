/*
  Warnings:

  - You are about to drop the column `tempertaure` on the `Generation` table. All the data in the column will be lost.
  - You are about to drop the column `topk` on the `Generation` table. All the data in the column will be lost.
  - Added the required column `temperature` to the `Generation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `topK` to the `Generation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Generation" DROP COLUMN "tempertaure",
DROP COLUMN "topk",
ADD COLUMN     "temperature" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "topK" INTEGER NOT NULL;
