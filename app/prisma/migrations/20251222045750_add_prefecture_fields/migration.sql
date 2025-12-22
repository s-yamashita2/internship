/*
  Warnings:

  - Added the required column `prefecture` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Events` ADD COLUMN `prefecture` TINYINT NOT NULL;
