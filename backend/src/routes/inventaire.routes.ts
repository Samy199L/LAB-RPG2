import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middlewares/auth.js";

const router = Router();

router.get("/", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const inventaire = await prisma.inventaire.findMany({
    where: { personnage: { joueurId } },
    include: { objet: true, personnage: true },
  });
  res.json({ inventaire });
});
// POST
router.post("/", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const { personnageId, objetId } = req.body;
  const personnage = await prisma.personnage.findFirst({
    where: { id: personnageId, joueurId },
  });

  if (!personnage) {
    return res.status(400).json({ erreur: "personnage non-disponible" });
  }
  try {
    const inventaire = await prisma.inventaire.upsert({
      where: { personnageId_objetId: { personnageId, objetId } },
      update: { quantite: { increment: 1 } },
      create: { personnageId, objetId, quantite: 1 },
    });

    res.status(201).json(inventaire);
  } catch {
    res.status(400).json({ erreur: " erreur objet " });
  }
});

// DELETE
router.delete("/:id", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const id = Number(req.params.id);
  const inventaire = await prisma.inventaire.findFirst({
    where: { id, personnage: { joueurId } },
  });

  if (!inventaire) {
    return res.status(400).json({ erreur: "objet introuvable" });
  }

  await prisma.inventaire.delete({ where: { id } });
  res.status(204).end();
});

export default router;
