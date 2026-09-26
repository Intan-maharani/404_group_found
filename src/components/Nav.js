"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, PackageSearch, ClipboardList, LayoutGrid, LogOut, User, ShieldCheck } from "lucide-react";
import { C, bodyFont } from "../lib/tokens";

const FEATURES = [
  { href: "/auth", label: "Autentikasi", icon: LogIn },
  { href: "/catalog", label: "Katalog Peminjaman", icon: PackageSearch },
  { href: "/history", label: "Riwayat & Status", icon: ClipboardList },
  { href: "/admin", label: "Approval Admin", icon: LayoutGrid },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);

  const loadUser = () => {
    try {
      const savedUser = localStorage.getItem("session_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    const handleAuthEvent = () => loadUser();
    window.addEventListener("auth-change", handleAuthEvent);
    window.addEventListener("storage", handleAuthEvent);

    return () => {
      window.removeEventListener("auth-change", handleAuthEvent);
      window.removeEventListener("storage", handleAuthEvent);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("session_user");
    setUser(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("auth-change"));
      window.dispatchEvent(new Event("storage"));
    }
    router.push("/auth");
  };

  const isAdmin = String(user?.role || "").toLowerCase().trim() === "admin";

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {FEATURES.map((f) => {
          const active = pathname === f.href;
          const isApprovalAdmin = f.href === "/admin";
          return (
            <Link
              key={f.href}
              href={f.href}
              className="flex items-center justify-between gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                backgroundColor: active ? C.forestDeep : "transparent",
                color: active ? C.paper : C.ink,
              }}
            >
              <div className="flex items-center gap-2.5">
                <f.icon size={16} style={{ color: active ? C.amber : C.moss }} />
                <span>{f.label}</span>
              </div>
              {isApprovalAdmin && isAdmin && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-400 text-stone-900 shadow-xs">
                  ADMIN
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Profil User & Logout */}
      <div
        className="rounded-2xl p-4 hidden md:flex flex-col gap-3 mt-auto"
        style={{
          backgroundColor: isAdmin ? "#FDF8ED" : C.paper,
          border: `1px solid ${isAdmin ? "#F59E0B" : C.canvasDeep}`,
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              backgroundColor: isAdmin ? "#F59E0B" : `${C.moss}26`,
              color: isAdmin ? "#FFF" : C.moss,
            }}
          >
            {isAdmin ? <ShieldCheck size={18} /> : <User size={16} />}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate" style={{ ...bodyFont, color: C.forestDeep }}>
              {user ? user.nama_lengkap || user.nama || user.name || user.email : "Tamu (Belum Masuk)"}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span
                className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                  isAdmin
                    ? "bg-amber-500 text-white font-black"
                    : "text-stone-500 bg-stone-100"
                }`}
              >
                {user ? `Role: ${user.role || "user"}` : "Akses Terbatas"}
              </span>
            </div>
          </div>
        </div>

        {user ? (
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer transition-opacity hover:opacity-90"
            style={{ backgroundColor: `${C.rust}1A`, color: C.rust }}
          >
            <LogOut size={13} />
            Keluar Sesi
          </button>
        ) : (
          <Link
            href="/auth"
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold cursor-pointer text-center"
            style={{ backgroundColor: C.forest, color: C.paper }}
          >
            <LogIn size={13} />
            Masuk / Daftar
          </Link>
        )}
      </div>
    </div>
  );
}
