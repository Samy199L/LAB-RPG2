import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import authRoutes from "./routes/auth.routes.js";
import monstresRoutes from "./routes/monstres.routes.js";
import personnagesRoutes from "./routes/personnage.routes.js";
import quetesRoutes from "./routes/quete.routes.js";
import objetsRoutes from "./routes/objets.routes.js";
import inventaireRoutes from "./routes/inventaire.routes.js";
import dotenv from "dotenv";
import cors from "cors";
dotenv.config();

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "RPG" });
});

const PORT = process.env.PORT || 3000;

app.use("/auth", authRoutes);
app.use("/monstres", monstresRoutes);
app.use("/personnages", personnagesRoutes);
app.use("/quetes", quetesRoutes);
app.use("/objets", objetsRoutes);
app.use("/inventaire", inventaireRoutes);
app.use((req: Request, res: Response) =>
  res.status(404).json({ erreur: "Route inconnue" }),
);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ erreur: "Erreur interne du serveur" });
});

app.listen(PORT, () => console.log(`Serveur sur http://localhost:${PORT}`));
