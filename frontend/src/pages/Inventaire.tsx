import { useEffect, useState } from "react";
import api from "../api/axios";

interface InventaireItem {
  id: number;
  quantite: number;
  personnage: {
    id: number;
    nom: string;
  };
  objet: {
    id: number;
    nom: string;
    rarete: string;
    type: string;
  };
}

export function Inventaire() {
  const [inventaires, setInventaires] = useState<InventaireItem[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerInventaire();
  }, [page]);

  async function chargerInventaire() {
    setLoading(true);
    setErreur("");

    try {
      const response = await api.get("/inventaire", {
        params: {
          page,
          limit,
        },
      });

      setInventaires(response.data.inventaire);
      setTotal(response.data.total);
    } catch (error) {
      setErreur("Impossible de récupérer l'inventaire.");
    } finally {
      setLoading(false);
    }
  }

  const nombrePages = Math.ceil(total / limit);

  const cardClasses =
    "rounded-lg border border-(--border) bg-(--code-bg) p-6 shadow-sm transition hover:-translate-y-1";

  if (loading) {
    return (
      <p className="p-6 text-center text-(--text)">
        Chargement de l'inventaire...
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
        Inventaire
      </h2>

      {inventaires.length === 0 ? (
        <p className="text-center text-(--text)">
          Aucun objet dans l'inventaire.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {inventaires.map((item) => (
            <div key={item.id} className={cardClasses}>
              <h3 className="mb-3 text-lg font-bold text-(--text-h)">
                {item.objet.nom}
              </h3>

              <div className="space-y-2 text-sm text-(--text)">
                <p>
                  <span className="font-semibold">Personnage :</span>{" "}
                  {item.personnage.nom}
                </p>

                <p>
                  <span className="font-semibold">Quantité :</span>{" "}
                  {item.quantite}
                </p>

                <p>
                  <span className="font-semibold">Rareté :</span>{" "}
                  {item.objet.rarete}
                </p>

                <p>
                  <span className="font-semibold">Type :</span>{" "}
                  {item.objet.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {nombrePages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
            className="rounded-md border border-(--border) px-4 py-2 text-(--text) transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Précédent
          </button>

          <span className="text-sm text-(--text)">
            Page {page} / {nombrePages}
          </span>

          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === nombrePages}
            className="rounded-md border border-(--border) px-4 py-2 text-(--text) transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Suivant
          </button>
        </div>
      )}
    </section>
  );
}