import { useEffect, useState } from "react";
import api from "../api/axios";

interface Personnage {
  id: number;
  nom: string;
  classe: string;
  niveau: number;
  pv: number;
}

export function Personnages() {
  const [personnages, setPersonnages] = useState<Personnage[]>([]);

  const [loading, setLoading] = useState(true);
  const [erreur, setErreur] = useState("");

  const [nom, setNom] = useState("");
  const [classe, setClasse] = useState("GUERRIER");

  const [loadingCreation, setLoadingCreation] = useState(false);
  const [erreurCreation, setErreurCreation] = useState("");

  const [personnageModifie, setPersonnageModifie] = useState<Personnage | null>(
    null,
  );

  const [nomModifie, setNomModifie] = useState("");
  const [classeModifiee, setClasseModifiee] = useState("GUERRIER");

  const [loadingModification, setLoadingModification] = useState(false);
  const [erreurModification, setErreurModification] = useState("");

  useEffect(() => {
    chargerPersonnages();
  }, []);

  async function chargerPersonnages() {
    try {
      const response = await api.get("/personnages");
      setPersonnages(response.data.personnages);
    } catch (error) {
      setErreur("Impossible de récupérer les personnages.");
    } finally {
      setLoading(false);
    }
  }

  async function creerPersonnage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErreurCreation("");
    setLoadingCreation(true);

    try {
      await api.post("/personnages", { nom, classe });
      setNom("");
      await chargerPersonnages();
    } catch (error) {
      setErreurCreation("Impossible de créer le personnage.");
    } finally {
      setLoadingCreation(false);
    }
  }

  async function modifierPersonnage(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!personnageModifie) return;

    setErreurModification("");
    setLoadingModification(true);

    try {
      await api.patch(`/personnages/${personnageModifie.id}`, {
        nom: nomModifie,
        classe: classeModifiee,
      });

      setPersonnageModifie(null);
      await chargerPersonnages();
    } catch (error) {
      setErreurModification("Impossible de modifier le personnage.");
    } finally {
      setLoadingModification(false);
    }
  }

  function commencerModification(personnage: Personnage) {
    setPersonnageModifie(personnage);
    setNomModifie(personnage.nom);
    setClasseModifiee(personnage.classe);
    setErreurModification("");
  }

  async function supprimerPersonnage(id: number) {
    if (!confirm("Voulez-vous vraiment supprimer ce personnage ?")) {
      return;
    }

    try {
      await api.delete(`/personnages/${id}`);
      await chargerPersonnages();
    } catch (error) {
      setErreur("Impossible de supprimer le personnage.");
    }
  }

  if (loading) {
    return (
      <p className="p-6 text-center text-(--text)">
        Chargement des personnages...
      </p>
    );
  }

  if (erreur) {
    return <p className="p-6 text-center font-medium text-red-500">{erreur}</p>;
  }

  const classesOptions = [
    { value: "GUERRIER", label: "Guerrier" },
    { value: "MAGE", label: "Mage" },
    { value: "VOLEUR", label: "Voleur" },
    { value: "CLERC", label: "Clerc" },
  ];

  const inputClasses =
    "w-full rounded-md border border-(--border) bg-transparent px-3 py-2 text-sm text-(--text-h) outline-none transition-colors focus:border-(--accent)";
  const labelClasses =
    "mb-1 block text-sm font-medium text-(--text)";
  const primaryButton =
    "rounded-md bg-(--accent) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50";
  const secondaryButton =
    "rounded-md border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:border-(--accent-border) hover:text-(--text-h)";
  const cardClasses =
    "rounded-lg border border-(--border) bg-(--code-bg) p-6";

  return (
    <section className="mx-auto max-w-3xl space-y-8 p-6 text-left">
      <h2 className="text-center">Mes personnages</h2>

      {/* Création */}
      <form onSubmit={creerPersonnage} className={`${cardClasses} space-y-4`}>
        <h3>Créer un personnage</h3>

        <div className="flex gap-4">
          <div className="flex-1">
            <label htmlFor="nom" className={labelClasses}>
              Nom
            </label>
            <input
              type="text"
              id="nom"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              required
              className={inputClasses}
            />
          </div>

          <div className="w-48 shrink-0">
            <label htmlFor="classe" className={labelClasses}>
              Classe
            </label>
            <select
              id="classe"
              value={classe}
              onChange={(event) => setClasse(event.target.value)}
              className={inputClasses}
            >
              {classesOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {erreurCreation && (
          <p className="text-sm text-red-500">{erreurCreation}</p>
        )}

        <button type="submit" disabled={loadingCreation} className={primaryButton}>
          {loadingCreation ? "Création..." : "Créer le personnage"}
        </button>
      </form>

      {/* Modification */}
      {personnageModifie && (
        <form
          onSubmit={modifierPersonnage}
          className={`${cardClasses} space-y-4 border-(--accent-border)`}
        >
          <h3>Modifier le personnage</h3>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="nomModifie" className={labelClasses}>
                Nom
              </label>
              <input
                type="text"
                id="nomModifie"
                value={nomModifie}
                onChange={(event) => setNomModifie(event.target.value)}
                required
                className={inputClasses}
              />
            </div>

            <div className="w-48 shrink-0">
              <label htmlFor="classeModifiee" className={labelClasses}>
                Classe
              </label>
              <select
                id="classeModifiee"
                value={classeModifiee}
                onChange={(event) => setClasseModifiee(event.target.value)}
                className={inputClasses}
              >
                {classesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {erreurModification && (
            <p className="text-sm text-red-500">{erreurModification}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loadingModification}
              className={primaryButton}
            >
              {loadingModification ? "Modification..." : "Enregistrer"}
            </button>

            <button
              type="button"
              onClick={() => setPersonnageModifie(null)}
              className={secondaryButton}
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {/* Liste */}
      <div className="space-y-4">
        <h3 className="text-center">Personnages</h3>

        {personnages.length === 0 ? (
          <p className="text-center text-(--text)">
            Aucun personnage.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {personnages.map((personnage) => (
              <div key={personnage.id} className={cardClasses}>
                <h4 className="mb-1 text-base font-semibold text-(--text-h)">
                  {personnage.nom}
                </h4>
                <p className="text-sm text-(--text)">
                  Classe : {personnage.classe}
                </p>
                <p className="text-sm text-(--text)">
                  Niveau : {personnage.niveau}
                </p>
                <p className="text-sm text-(--text)">
                  PV : {personnage.pv}
                </p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => commencerModification(personnage)}
                    className="rounded-md bg-(--accent-bg) px-3 py-1.5 text-sm font-medium text-(--accent) transition-opacity hover:opacity-80"
                  >
                    Modifier
                  </button>

                  <button
                    onClick={() => supprimerPersonnage(personnage.id)}
                    className="rounded-md border border-(--border) px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:border-red-400"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}