import { useState } from "react";
import api from "../api/axios";
import { HeaderLoginRegister } from "../components/HeaderLogRegister";

interface RegisterProps {
  onLogin: () => void;
}

export function Register({ onLogin }: RegisterProps) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErreur("");
    setLoading(true);

    try {
      await api.post("/auth/register", { nom, email, password });

      alert("Compte créé avec succès !");

      setNom("");
      setEmail("");
      setPassword("");
      onLogin();
    } catch (error) {
      setErreur("Impossible de créer le compte.");
    } finally {
      setLoading(false);
    }
  }

  const inputClasses =
    "w-full rounded-md border border-(--border) bg-transparent px-3 py-2 text-sm text-(--text-h) outline-none transition-colors focus:border-(--accent)";
  const labelClasses = "mb-1 block text-sm font-medium text-(--text)";

  return (
    <div>
      <HeaderLoginRegister />

      <section className="mx-auto flex max-w-md items-center justify-center p-6">
        <div className="w-full rounded-lg border border-(--border) bg-(--code-bg) p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-center">Créer un compte</h2>

            <div>
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

            <div>
              <label htmlFor="email" className={labelClasses}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                className={inputClasses}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClasses}>
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
                className={inputClasses}
              />
            </div>

            {erreur && <p className="text-sm text-red-500">{erreur}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-(--accent) px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer mon compte"}
            </button>

            <div className="border-t border-(--border) pt-4 text-center">
              <p className="mb-2 text-sm text-(--text)">
                Vous avez déjà un compte ?
              </p>
              <button
                type="button"
                onClick={onLogin}
                className="rounded-md border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:border-(--accent-border) hover:text-(--text-h)"
              >
                Se connecter
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}