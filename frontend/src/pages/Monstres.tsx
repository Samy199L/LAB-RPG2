import { useEffect, useState } from "react";
import api from "../api/axios";

interface Monstre {
  id: number;
  nom: string;
  pv: number;
  attaque: number;
}

export function Monstres() {
  const [monstres, setMonstres] = useState<Monstre[]>([]);

  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10);

  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  useEffect(() => {
    chargerMonstres();
  }, [page]);

  async function chargerMonstres() {
    setLoading(true);
    setErreur("");

    try {
      const response = await api.get("/monstres", {
        params: {
          page,
          limit,
        },
      });

      setMonstres(response.data.monstre);
      setTotal(response.data.total);
    } catch (error) {
      setErreur("Impossible de récupérer les monstres.");
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
        Chargement des monstres...
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
        Monstres
      </h2>

      {monstres.length === 0 ? (
        <p className="text-center text-(--text)">
          Aucun monstre disponible.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {monstres.map((monstre) => (
            <div key={monstre.id} className={cardClasses}>
              <h3 className="mb-4 text-lg font-bold text-(--text-h)">
                {monstre.nom}
              </h3>

              <div className="space-y-2 text-sm text-(--text)">
                <p>
                  <span className="font-semibold">PV :</span>{" "}
                  {monstre.pv}
                </p>

                <p>
                  <span className="font-semibold">Attaque :</span>{" "}
                  {monstre.attaque}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {nombrePages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4">
          <button
            type="button"
            onClick={() => setPage((anciennePage) => anciennePage - 1)}
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
            onClick={() => setPage((anciennePage) => anciennePage + 1)}
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