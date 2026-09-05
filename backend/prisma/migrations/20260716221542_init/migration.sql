-- CreateEnum
CREATE TYPE "Classe" AS ENUM ('GUERRIER', 'MAGE', 'VOLEUR', 'CLERC');

-- CreateEnum
CREATE TYPE "Rarete" AS ENUM ('COMMUN', 'RARE', 'EPIQUE', 'LEGENDAIRE');

-- CreateEnum
CREATE TYPE "TypeObjet" AS ENUM ('ARME', 'ARMURE', 'POTION', 'ACCESSOIRE');

-- CreateEnum
CREATE TYPE "Difficulte" AS ENUM ('FACILE', 'MOYEN', 'DIFFICILE', 'EXTREME');

-- CreateEnum
CREATE TYPE "StatutQuete" AS ENUM ('DISPONIBLE', 'EN_COURS', 'TERMINEE', 'ECHOUEE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateTable
CREATE TABLE "Joueur" (
    "id" SERIAL NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Joueur_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Personnage" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "classe" "Classe" NOT NULL,
    "niveau" INTEGER NOT NULL DEFAULT 1,
    "pv" INTEGER NOT NULL DEFAULT 15,
    "joueurId" INTEGER NOT NULL,

    CONSTRAINT "Personnage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Objet" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "rarete" "Rarete" NOT NULL,
    "type" "TypeObjet" NOT NULL,

    CONSTRAINT "Objet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventaire" (
    "id" SERIAL NOT NULL,
    "personnageId" INTEGER NOT NULL,
    "objetId" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "Inventaire_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monstre" (
    "id" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "pv" INTEGER NOT NULL,
    "attaque" INTEGER NOT NULL,

    CONSTRAINT "Monstre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Quete" (
    "id" SERIAL NOT NULL,
    "titre" TEXT NOT NULL,
    "difficulte" "Difficulte" NOT NULL,
    "statut" "StatutQuete" NOT NULL,
    "recompense" TEXT NOT NULL,
    "personnageId" INTEGER NOT NULL,

    CONSTRAINT "Quete_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Joueur_email_key" ON "Joueur"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Inventaire_personnageId_objetId_key" ON "Inventaire"("personnageId", "objetId");

-- AddForeignKey
ALTER TABLE "Personnage" ADD CONSTRAINT "Personnage_joueurId_fkey" FOREIGN KEY ("joueurId") REFERENCES "Joueur"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_personnageId_fkey" FOREIGN KEY ("personnageId") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventaire" ADD CONSTRAINT "Inventaire_objetId_fkey" FOREIGN KEY ("objetId") REFERENCES "Objet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Quete" ADD CONSTRAINT "Quete_personnageId_fkey" FOREIGN KEY ("personnageId") REFERENCES "Personnage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
