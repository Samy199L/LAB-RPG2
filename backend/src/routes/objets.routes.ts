import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const [objets, total] = await Promise.all([
    prisma.objet.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { nom: "asc" },
    }),
    prisma.objet.count(),
  ]);
  res.json({ page, limit, total, objets });
});
// GET
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const objet = await prisma.objet.findUnique({ where: { id } });
  if (!objet) return res.status(404).json({ erreur: "objet introuvable" });
  res.json(objet);
});
// POST
router.post(
  "/",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const { nom, rarete, type } = req.body;

    if (!nom) return res.status(400).json({ erreur: "nom requis" });
    const objet = await prisma.objet.create({
      data: { nom, rarete, type },
    });
    res.status(201).json(objet);
  },
);
// PATCH
router.patch(
  "/:id",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const objet = await prisma.objet.update({
        where: { id },
        data: req.body,
      });
      res.json(objet);
    } catch {
      res.status(404).json({ erreur: "objet introuvable" });
    }
  },
);
// DELETE
router.delete(
  "/:id",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      await prisma.objet.delete({ where: { id } });
      res.status(204).end();
    } catch {
      res.status(404).json({ erreur: "objet introuvable" });
    }
  },
);

export default router;
