import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff, Lock, Shield, User } from "lucide-react";
import { useState } from "react";
import { adminLogin } from "@/lib/admin-store";

export const Route = createFileRoute("/admin/login")({
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (adminLogin(username, password)) {
        navigate({ to: "/admin/" });
      } else {
        setError("Username atau password salah. Silakan coba lagi.");
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-slate-950 px-4"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/2 size-[600px] -translate-x-1/2 rounded-full bg-blue-900/20 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-br from-blue-900/60 to-slate-900 px-8 py-8 text-center">
            <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 shadow-lg shadow-blue-900/50">
              <Shield className="size-8 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-slate-400">KONI Kabupaten Nganjuk</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 px-8 py-8">
            {error && (
              <div className="flex items-start gap-3 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-400">
                <Lock className="mt-0.5 size-4 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label htmlFor="admin-username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <User className="size-4 text-slate-500" />
                </span>
                <input
                  id="admin-username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  autoComplete="username"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center">
                  <Lock className="size-4 text-slate-500" />
                </span>
                <input
                  id="admin-password"
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-slate-700 bg-slate-800 py-3 pl-10 pr-12 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPass ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 py-3 text-sm font-bold text-white shadow-lg shadow-blue-900/30 transition-all hover:-translate-y-0.5 hover:shadow-blue-900/50 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Memverifikasi...
                </span>
              ) : (
                "Masuk ke Dashboard"
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-slate-600">
          Hanya untuk pengurus resmi KONI Kabupaten Nganjuk
        </p>
      </div>
    </div>
  );
}
