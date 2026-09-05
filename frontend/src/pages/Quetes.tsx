import { useEffect, useState } from "react";
import api from "../api/axios";

interface Quete {
  id: number;
  titre: string;
  difficulte: string;
  statut: string;
  recompense: string;
}

export function Quetes() {
  const [quetes, setQuetes] = useState<Quete[]>([]);

  const [difficulte, setDifficulte] = useState("");
  const [statut, setStatut] = useState("");

  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerQuetes();
  }, [difficulte, statut]);

  async function chargerQuetes() {
    setLoading(true);
    setErreur("");

    try {
      const params: Record<string, string> = {};

      if (difficulte) {
        params.difficulte = difficulte;
      }

      if (statut) {
        params.statut = statut;
      }

      const response = await api.get("/quetes", {
        params,
      });

      setQuetes(response.data.quetes);
    } catch (error) {
      setErreur("Impossible de récupérer les quêtes.");
    } finally {
      setLoading(false);
    }
  }

  function reinitialiserFiltres() {
    setDifficulte("");
    setStatut("");
  }

  const cardClasses =
    "rounded-lg border border-(--border) bg-(--code-bg) p-6 shadow-sm transition hover:-translate-y-1";

  if (loading) {
    return (
      <p className="p-6 text-center text-(--text)">
        Chargement des quêtes...
      </p>
    );
  }

  if (erreur) {
    return (
      <p className="p-6 text-center font-medium text-red-500">
        {erreur}
      </p>
    );
  }

  return (
    <section className="mx-auto max-w-5xl space-y-6 p-6 text-left">
      <h2 className="text-center text-2xl font-bold text-(--text-h)">
        Quêtes
      </h2>

      {/* Filtres */}
      <div className="rounded-lg border border-(--border) bg-(--code-bg) p-4">
        <h3 className="mb-4 text-lg font-semibold text-(--text-h)">
          Filtrer les quêtes
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="difficulte"
              className="mb-1 block text-sm font-medium text-(--text)"
            >
              Difficulté
            </label>

            <select
              id="difficulte"
              value={difficulte}
              onChange={(event) => setDifficulte(event.target.value)}
              className="w-full rounded-md border border-(--border) bg-(--code-bg) px-3 py-2 text-(--text)"
            >
              <option value="">Toutes les difficultés</option>
              <option value="FACILE">Facile</option>
              <option value="MOYEN">Moyen</option>
              <option value="DIFFICILE">Difficile</option>
              <option value="EXTREME">Extrême</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="statut"
              className="mb-1 block text-sm font-medium text-(--text)"
            >
              Statut
            </label>

            <select
              id="statut"
              value={statut}
              onChange={(event) => setStatut(event.target.value)}
              className="w-full rounded-md border border-(--border) bg-(--code-bg) px-3 py-2 text-(--text)"
            >
              <option value="">Tous les statuts</option>
              <option value="DISPONIBLE">Disponible</option>
              <option value="EN_COURS">En cours</option>
              <option value="TERMINEE">Terminée</option>
              <option value="ECHOUEE">Échouée</option>
            </select>
          </div>
        </div>

        {(difficulte || statut) && (
          <button
            type="button"
            onClick={reinitialiserFiltres}
            className="mt-4 rounded-md border border-(--border) px-4 py-2 text-sm text-(--text) transition hover:opacity-80"
          >
            Réinitialiser les filtres
          </button>
        )}
      </div>

      {/* Liste */}
      {quetes.length === 0 ? (
        <p className="text-center text-(--text)">
          Aucune quête ne correspond aux filtres.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {quetes.map((quete) => (
            <div key={quete.id} className={cardClasses}>
              <h3 className="mb-3 text-lg font-bold text-(--text-h)">
                {quete.titre}
              </h3>

              <div className="space-y-2 text-sm text-(--text)">
                <p>
                  <span className="font-semibold">Difficulté :</span>{" "}
                  {quete.difficulte}
                </p>

                <p>
                  <span className="font-semibold">Statut :</span>{" "}
                  {quete.statut}
                </p>

                <p>
                  <span className="font-semibold">Récompense :</span>{" "}
                  {quete.recompense}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}