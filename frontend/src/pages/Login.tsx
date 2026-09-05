import { useState } from "react";
import api from "../api/axios";
import { HeaderLoginRegister } from "../components/HeaderLogRegister";
import { useAuth } from "../contexts/AuthContext";

interface LoginProps {
  onRegister: () => void;
  onLoginSuccess: () => void;
}

export function Login({ onRegister, onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState("");
  const { login } = useAuth();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErreur("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { email, password });

      login(response.data.token);
      onLoginSuccess();
    } catch (error) {
      setErreur("Email ou mot de passe incorrect.");
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
            <h2 className="text-center">Se connecter</h2>

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
                Mot de Passe
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
              {loading ? "Connexion..." : "Connexion"}
            </button>

            <div className="border-t border-(--border) pt-4 text-center">
              <p className="mb-2 text-sm text-(--text)">
                Ou créez-vous un compte
              </p>
              <button
                type="button"
                onClick={onRegister}
                className="rounded-md border border-(--border) px-4 py-2 text-sm font-medium text-(--text) transition-colors hover:border-(--accent-border) hover:text-(--text-h)"
              >
                Créer un compte
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}