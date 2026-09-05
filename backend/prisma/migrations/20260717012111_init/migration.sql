/*
  Warnings:

  - Added the required column `password` to the `Joueur` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Joueur" ADD COLUMN     "password" TEXT NOT NULL;
