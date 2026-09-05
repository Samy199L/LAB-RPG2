import { useAuth } from "../contexts/AuthContext";
import { Monstres } from "./Monstres";
import { Personnages } from "./Personnages";
import { Quetes } from "./Quetes";
import { Objets } from "./Objets";
import { Inventaire } from "./Inventaire";
export function Acceuil() {
  const { logout } = useAuth();

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6 text-center">
      <h1 className="text-4xl font-bold leading-tight">Bienvenue dans<br/><b> Dungeon & Dragon</b></h1>

      <div className="flex items-center justify-center gap-4">
        <p className="text-(--text)">Vous êtes connecté.</p>

        <button
          onClick={logout}
          className="rounded-md border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:border-(--accent-border) hover:text-(--text-h)"
        >
          Déconnexion
        </button>
      </div>

      <Personnages />
      <Inventaire/>
      <Quetes />
      <Monstres/>
      <Objets/>
    </main>
  );
}