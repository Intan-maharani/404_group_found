"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogIn, PackageSearch, ClipboardList, Sparkles, LayoutGrid } from "lucide-react";
import { C } from "../lib/tokens";

const FEATURES = [
  { href: "/auth", label: "Autentikasi", icon: LogIn },
  { href: "/catalog", label: "Pengajuan Peminjaman", icon: PackageSearch },
  { href: "/history", label: "Riwayat & Status", icon: ClipboardList },
  { href: "/bundle", label: "Paket Hemat", icon: Sparkles },
  { href: "/admin", label: "Approval Admin", icon: LayoutGrid },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
      {FEATURES.map((f) => {
        const active = pathname === f.href;
        return (
          <Link
            key={f.href}
            href={f.href}
            className="flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap flex-shrink-0"
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
  );
}
