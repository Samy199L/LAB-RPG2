import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";

const router = Router();

router.get("/", async (req: Request, res: Response) => {
  const { difficulte, statut } = req.query;
  const quetes = await prisma.quete.findMany({
    where: {
      ...(difficulte && { difficulte: String(difficulte) as any }),
      ...(statut && { statut: String(statut) as any }),
    },
    include: { monstres: true },
    orderBy: { id: "asc" },
  });

  res.json({ quetes });
});
//GET
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const quetes = await prisma.quete.findUnique({
    where: { id },
    include: { monstres: true },
  });
  if (!quetes) {
    return res.status(404).json({ erreur: "quete introuvable" });
  }

  res.json(quetes);
});
//POST
router.post(
  "/",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const { titre, difficulte, statut, recompense, monstres } = req.body;
    if (!titre || !difficulte || !statut || !recompense) {
      return res
        .status(400)
        .json({ erreur: "titre, difficulte, statut et recompense requis" });
    }

    const quete = await prisma.quete.create({
      data: {
        titre,
        difficulte,
        statut,
        recompense,
        monstres: { connect: monstres?.map((id: number) => ({ id })) ?? [] },
      },
    });
    res.status(201).json(quete);
  },
);
//PATCH
router.patch(
  "/:id",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const quete = await prisma.quete.update({
        where: { id },
        data: req.body,
      });

      res.json(quete);
    } catch {
      res.status(404).json({ erreur: "quete introuvable" });
    }
  },
);
//DELETE
router.delete(
  "/:id",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      await prisma.quete.delete({
        where: {
          id,
        },
      });
      res.status(204).end();
    } catch {
      res.status(404).json({
        erreur: "quete introuvable",
      });
    }
  },
);

router.post(
  "/:id/accepter",
  authentifier,
  async (req: Request, res: Response) => {
    const joueurId = (req as any).user.sub;
    const queteId = Number(req.params.id);
    const { personnageId } = req.body;
    const personnage = await prisma.personnage.findFirst({
      where: {
        id: personnageId,
        joueurId,
      },
    });

    if (!personnage) {
      return res.status(403).json({ erreur: "personnage introuvable" });
    }

    const quete = await prisma.quete.findUnique({
      where: {
        id: queteId,
      },
    });

    if (!quete) {
      return res.status(404).json({
        erreur: "quete introuvable",
      });
    }

    const queteJoueur = await prisma.queteJoueur.create({
      data: {
        personnageId,
        queteId,
        statut: "EN_COURS",
      },
      include: {
        quete: {
          include: {
            monstres: true,
          },
        },
        personnage: true,
      },
    });
    res.status(201).json(queteJoueur);
  },
);

router.patch(
  "/:id/reussir",
  authentifier,
  async (req: Request, res: Response) => {
    const joueurId = (req as any).user.sub;
    const id = Number(req.params.id);
    const queteJoueur = await prisma.queteJoueur.findFirst({
      where: {
        queteId: id,
        personnage: {
          joueurId,
        },
      },
      include: {
        quete: true,
      },
    });

    if (!queteJoueur) {
      return res.status(404).json({ erreur: "quête introuvable" });
    }

    const terminee = await prisma.queteJoueur.update({
      where: { id: queteJoueur.id },
      data: { statut: "TERMINEE" },
    });

    res.json({
      message: "Quête réussie !",
      quete: terminee,
      recompense: queteJoueur.quete.recompense,
    });
  },
);

export default router;
