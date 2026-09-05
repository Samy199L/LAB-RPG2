-- CreateTable
CREATE TABLE "_MonstreToQuete" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MonstreToQuete_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_MonstreToQuete_B_index" ON "_MonstreToQuete"("B");

-- AddForeignKey
ALTER TABLE "_MonstreToQuete" ADD CONSTRAINT "_MonstreToQuete_A_fkey" FOREIGN KEY ("A") REFERENCES "Monstre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MonstreToQuete" ADD CONSTRAINT "_MonstreToQuete_B_fkey" FOREIGN KEY ("B") REFERENCES "Quete"("id") ON DELETE CASCADE ON UPDATE CASCADE;
