import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier } from "../middlewares/auth.js";

const router = Router();

router.get("/", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const personnages = await prisma.personnage.findMany({
    where: { joueurId },
    orderBy: { nom: "asc" },
    include: { inventaires: true, quetesJoueur: true },
  });
  res.json({ personnages });
});
// GET
router.get("/:id", authentifier, async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const joueurId = (req as any).user.sub;
  const personnage = await prisma.personnage.findFirst({
    where: { id, joueurId },
    orderBy: { id: "asc" },
  });
  if (!personnage)
    return res.status(404).json({ erreur: "personnage introuvable" });
  res.json(personnage);
});
// POST
router.post("/", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const { nom, classe } = req.body;

  if (!classe || !nom)
    return res.status(400).json({ erreur: "Classe et nom requis" });

  const personnage = await prisma.personnage.create({
    data: { nom, classe, joueurId },
  });
  res.status(201).json(personnage);
});
// PATCH
router.patch("/:id", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const id = Number(req.params.id);
  const personnage = await prisma.personnage.findFirst({
    where: {
      id,
      joueurId,
    },
  });

  if (!personnage) {
    return res.status(404).json({
      erreur: "personnage introuvable",
    });
  }

  const personnageModifie = await prisma.personnage.update({
    where: { id },
    data: req.body,
  });

  res.json(personnageModifie);
});
// DELETE
router.delete("/:id", authentifier, async (req: Request, res: Response) => {
  const joueurId = (req as any).user.sub;
  const id = Number(req.params.id);
  const personnage = await prisma.personnage.findFirst({
    where: {
      id,
      joueurId,
    },
  });

  if (!personnage) {
    return res.status(404).json({
      erreur: "personnage introuvable",
    });
  }

  await prisma.personnage.delete({
    where: { id },
  });

  res.status(204).end();
});

export default router;
