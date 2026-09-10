"use client";

import { useState } from "react";
import { Tent, LogIn, UserPlus } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { GearTag, SectionEyebrow, Field } from "../../components/Shared";

export default function AuthPage() {
  const [mode, setMode] = useState("login");

  return (
    <div>
      <SectionEyebrow
        index={1}
        total={5}
        title="Masuk ke Chill Time"
        desc="Pengguna mendaftar atau masuk, lalu sistem mengarahkan ke tampilan Penyewa atau Admin sesuai hak akses."
      />
      <div className="grid md:grid-cols-[1fr_1.1fr] gap-8 items-start">
        <div className="rounded-2xl p-8" style={{ backgroundColor: C.forestDeep, color: C.paper }}>
          <Tent size={32} style={{ color: C.amber }} />
          <p className="mt-6 text-2xl leading-snug" style={{ ...headingFont }}>
            Alat lengkap,<br />tinggal berangkat.
          </p>
          <p className="mt-4 text-sm leading-relaxed opacity-80" style={{ ...bodyFont }}>
            Sewa coolbox, tikar, kompor portable, tenda, dan lampu camping
            dalam hitungan menit. Kembalikan setelah petualangan selesai.
          </p>
          <div className="mt-8 flex gap-2 flex-wrap">
            <GearTag tone={C.amber}>Real-time stock</GearTag>
            <GearTag tone={C.sky}>Role-based access</GearTag>
          </div>
        </div>

        <div className="rounded-2xl p-7" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
          <div className="flex rounded-full p-1 mb-6" style={{ backgroundColor: C.canvas }}>
            {[
              { key: "login", label: "Masuk", icon: LogIn },
              { key: "register", label: "Daftar", icon: UserPlus },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors"
                style={{
                  ...bodyFont,
                  backgroundColor: mode === key ? C.forest : "transparent",
                  color: mode === key ? C.paper : C.ink,
                }}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {mode === "register" && <Field label="Nama lengkap" placeholder="Nama kamu" />}
            <Field label="Username" placeholder="username_kamu" />
            <Field label="Kata sandi" placeholder="••••••••" type="password" />
            {mode === "register" && (
              <div>
                <label className="text-xs font-semibold block mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                  Daftar sebagai
                </label>
                <div className="flex gap-2">
                  <GearTag tone={C.forest}>Penyewa (User)</GearTag>
                  <span className="text-xs self-center" style={{ color: "#999" }}>
                    Admin dibuat oleh manajemen
                  </span>
                </div>
              </div>
            )}
          </div>

          <button
            className="w-full mt-6 py-3 rounded-full font-semibold text-sm"
            style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep }}
          >
            {mode === "login" ? "Masuk sekarang" : "Buat akun"}
          </button>
          <p className="text-center text-xs mt-4" style={{ ...bodyFont, color: "#8A8272" }}>
            {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="font-semibold underline"
              style={{ color: C.forest }}
            >
              {mode === "login" ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
