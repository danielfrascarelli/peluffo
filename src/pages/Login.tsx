import { useState } from "react";
import { login } from "@/api/auth";
import type { User } from "@/lib/schemas";
import Button from "@/components/shared/Button";
import { inputClass } from "@/lib/utils";

interface LoginProps {
  onLogin: (user: User) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const user = await login(username, password);
      if (user) {
        onLogin(user);
        return;
      }
      setError("Usuario o contraseña incorrectos.");
    } catch {
      setError("No se pudo iniciar sesión.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-sidebar via-primary via-60% to-accent">
      {/* Left panel */}
      <div className="hidden lg:block relative w-1/2 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&q=80"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20 flex flex-col p-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="w-6 h-6 text-primary-foreground"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                <path d="M12 6v6l4 2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-primary-foreground tracking-tight">Peluffo Giguens</span>
          </div>
        </div>
      </div>

      {/* Right panel - Login form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="bg-card rounded-2xl shadow-2xl p-8">
            <div className="mb-8">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary mb-4">
                <svg
                  aria-hidden
                  viewBox="0 0 24 24"
                  fill="none"
                  className="w-5 h-5 text-primary-foreground"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
                  <path d="M12 6v6l4 2" strokeLinecap="round" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold text-foreground">Peluffo Giguens</h1>
              <p className="text-sm mt-1 text-muted-foreground">Ingresá con tu usuario del equipo.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="login-username" className="block text-sm font-medium mb-1.5 text-foreground">
                  Usuario
                </label>
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Ingresá tu usuario"
                  required
                  className={`w-full h-11 px-4 rounded-lg text-sm transition-all ${inputClass}`}
                />
              </div>

              <div>
                <label htmlFor="login-password" className="block text-sm font-medium mb-1.5 text-foreground">
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className={`w-full h-11 pl-4 pr-12 rounded-lg text-sm transition-all ${inputClass}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="absolute inset-y-0 right-0 w-11 flex items-center justify-center text-muted-foreground hover:text-foreground"
                  >
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="w-5 h-5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                      <circle cx="12" cy="12" r="3" />
                      {showPassword && <path d="M3 3l18 18" />}
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="text-sm px-3 py-2 rounded-lg bg-danger text-destructive border border-destructive/30"
                >
                  {error}
                </div>
              )}

              <Button variant="primary" type="submit" disabled={loading} className="w-full h-11">
                {loading ? "Ingresando..." : "Ingresar"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
