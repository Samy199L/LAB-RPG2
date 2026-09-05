/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Monstre` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Monstre_nom_key" ON "Monstre"("nom");
