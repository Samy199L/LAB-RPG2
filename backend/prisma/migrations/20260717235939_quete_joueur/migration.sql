/*
  Warnings:

  - You are about to drop the column `personnageId` on the `Quete` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Quete" DROP CONSTRAINT "Quete_personnageId_fkey";

-- AlterTable
ALTER TABLE "Quete" DROP COLUMN "personnageId";

-- CreateTable
CREATE TABLE "QueteJoueur" (
    "id" SERIAL NOT NULL,
    "personnageId" INTEGER NOT NULL,
    "queteId" INTEGER NOT NULL,
    "statut" "StatutQuete" NOT NULL DEFAULT 'EN_COURS',

    CONSTRAINT "QueteJoueur_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QueteJoueur_personnageId_queteId_key" ON "QueteJoueur"("personnageId", "queteId");

-- AddForeignKey
ALTER TABLE "QueteJoueur" ADD CONSTRAINT "QueteJoueur_personnageId_fkey" FOREIGN KEY ("personnageId") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QueteJoueur" ADD CONSTRAINT "QueteJoueur_queteId_fkey" FOREIGN KEY ("queteId") REFERENCES "Quete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
