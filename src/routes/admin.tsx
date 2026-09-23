import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  Image,
  LayoutDashboard,
  LogOut,
  Newspaper,
  Settings,
  Video,
  Monitor,
  Menu,
  X,
  Shield,
} from "lucide-react";
import { useEffect, useState } from "react";
import { adminLogout, isAdminLoggedIn } from "@/lib/admin-store";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const navItems = [
  { label: "Dashboard", to: "/admin/", icon: LayoutDashboard },
  { label: "Berita", to: "/admin/berita", icon: Newspaper },
  { label: "Galeri", to: "/admin/galeri", icon: Image },
  { label: "Video", to: "/admin/video", icon: Video },
  { label: "Header", to: "/admin/header", icon: Monitor },
  { label: "Pengaturan", to: "/admin/pengaturan", icon: Settings },
] as const;

function AdminLayout() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoginPage && !isAdminLoggedIn()) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate, isLoginPage]);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    adminLogout();
    navigate({ to: "/admin/login" });
  };

  if (isLoginPage) {
    return <Outlet />;
  }

  if (!isAdminLoggedIn()) return null;

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/60 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 shadow-2xl transition-transform duration-300 lg:translate-x-0 lg:static lg:shadow-none ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-slate-800 px-6 py-5">
          <span className="flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg">
            <Shield className="size-5 text-white" />
          </span>
          <div>
            <p className="text-sm font-bold text-white">Admin KONI</p>
            <p className="text-xs text-slate-400">Nganjuk</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500">Menu</p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isExact = item.to === "/admin/" || item.to === "/admin";
            const active = isExact
              ? pathname === "/admin" || pathname === "/admin/"
              : pathname.startsWith(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/40"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-lg bg-slate-800/60 px-3 py-2.5">
            <span className="flex size-8 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">A</span>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-white">admin_koni</p>
              <p className="text-[10px] text-slate-500">Administrator</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition-colors hover:bg-red-900/30 hover:text-red-400"
          >
            <LogOut className="size-4" />
            Keluar
          </button>
          <Link
            to="/"
            className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-800 hover:text-slate-300"
          >
            ← Kembali ke website
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar (mobile) */}
        <header className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <Menu className="size-5" />
          </button>
          <span className="text-sm font-bold text-white">Admin KONI Nganjuk</span>
          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg p-2 text-slate-400 hover:bg-red-900/30 hover:text-red-400"
          >
            <LogOut className="size-4" />
          </button>
        </header>

        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
