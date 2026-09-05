import { Router, type Request, type Response } from "express";
import prisma from "../utils/prisma.js";
import { authentifier, exigerRole } from "../middlewares/auth.js";
import axios from "axios";
import { dndAPI } from "../api/dndapi.js";

const router = Router();

async function recupererMonstre(index: string) {
  try {
    const { data } = await dndAPI.get(`/${index}`);

    return {
      nom: data.name,
      pv: data.hit_points,
      attaque: data.actions?.length ?? 0,
    };
  } catch (e) {
    if (axios.isAxiosError(e) && e.response) {
      console.log("Erreur API D&D :", e.response.status);
    } else {
      console.log("Erreur réseau");
    }

    return null;
  }
}

router.get("/", async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Number(req.query.limit) || 10);
  const [monstre, total] = await Promise.all([
    prisma.monstre.findMany({
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { id: "asc" },
    }),
    prisma.monstre.count(),
  ]);
  res.json({ page, limit, total, monstre });
});

// GET
router.get("/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const monstre = await prisma.monstre.findUnique({
    where: { id },
    include: { quetes: true },
  });
  if (!monstre) return res.status(404).json({ erreur: "monstre introuvable" });
  res.json(monstre);
});
// POST
router.post(
  "/",
  authentifier,
  exigerRole("ADMIN"),
  async (req: Request, res: Response) => {
    const { nom, pv, attaque } = req.body;

    if (pv == null || attaque == null || !nom)
      return res.status(400).json({ erreur: "attaque, pv et nom requis" });
    const monstre = await prisma.monstre.create({
      data: { nom, pv, attaque },
    });
    res.status(201).json(monstre);
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
      const monstre = await prisma.monstre.update({
        where: { id },
        data: req.body,
      });
      res.json(monstre);
    } catch {
      res.status(404).json({ erreur: "monstre introuvable" });
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
      await prisma.monstre.delete({ where: { id } });
      res.status(204).end();
    } catch {
      res.status(404).json({ erreur: "monstre introuvable" });
    }
  },
);

// POST

router.post("/importer", authentifier, async (req: Request, res: Response) => {
  const limite = Math.min(10, Number(req.body.limite) || 5);

  try {
    const { data } = await dndAPI.get("/");
    let importes = 0;

    for (const m of data.results.slice(0, limite)) {
      const monstre = await recupererMonstre(m.index);
      if (!monstre) continue;
      await prisma.monstre.upsert({
        where: { nom: monstre.nom },

        update: { pv: monstre.pv, attaque: monstre.attaque },

        create: monstre,
      });
      importes++;
    }
    res.status(201).json({ message: `${importes} monstre(s)`, importes });
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return res
        .status(502)
        .json({ erreur: "API injoignable (ou quota atteint)" });
    }
    res.status(500).json({ erreur: "Erreur lors de l’import" });
  }
});

export default router;
