"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogIn, PackageSearch, ClipboardList, LayoutGrid, LogOut, User } from "lucide-react";
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

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("session_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      setUser(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("session_token");
    localStorage.removeItem("session_user");
    setUser(null);
    router.push("/auth");
  };

  return (
    <div className="flex flex-col gap-4">
      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
        {FEATURES.map((f) => {
          const active = pathname === f.href;
          return (
            <Link
              key={f.href}
              href={f.href}
              className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors"
              style={{
                backgroundColor: active ? C.forestDeep : "transparent",
                color: active ? C.paper : C.ink,
              }}
            >
              <f.icon size={16} style={{ color: active ? C.amber : C.moss }} />
              {f.label}
            </Link>
          );
        })}
      </nav>

      {/* Profil User & Logout */}
      <div
        className="rounded-2xl p-4 hidden md:flex flex-col gap-3 mt-auto"
        style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${C.moss}26`, color: C.moss }}
          >
            <User size={16} />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold truncate" style={{ ...bodyFont, color: C.forestDeep }}>
              {user ? user.nama || user.name || user.email : "Tamu (Belum Masuk)"}
            </p>
            <p className="text-[10px] truncate text-stone-500 uppercase tracking-wider font-semibold">
              {user ? `Role: ${user.role || "user"}` : "Akses Terbatas"}
            </p>
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
