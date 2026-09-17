"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tent, LogIn, UserPlus, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow, Field } from "../../components/Shared";
import { apiFetch } from "../../lib/api";

export default function AuthPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const [form, setForm] = useState({
    nama: "",
    email: "",
    no_telepon: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      if (mode === "register") {
        const res = await apiFetch("/register", {
          method: "POST",
          body: JSON.stringify({
            nama: form.nama,
            email: form.email,
            no_telepon: form.no_telepon || "08123456789",
            password: form.password,
            role: "user",
          }),
        });

        setSuccessMsg("Pendaftaran akun berhasil! Silakan masuk.");
        setMode("login");
      } else {
        const res = await apiFetch("/login", {
          method: "POST",
          body: JSON.stringify({
            email: form.email,
            password: form.password,
          }),
        });

        if (res.token) {
          localStorage.setItem("session_token", res.token);
          if (res.user) {
            localStorage.setItem("session_user", JSON.stringify(res.user));
          }
        }

        setSuccessMsg("Login berhasil! Mengalihkan ke Katalog...");
        setTimeout(() => {
          router.push("/catalog");
        }, 800);
      }
    } catch (err) {
      setErrorMsg(err.message || "Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <SectionEyebrow
        index={1}
        total={4}
        title="Selamat Datang di Chill Time"
        desc="Silakan masuk untuk mengakses akun dan menggunakan layanan Chill Time."
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
        </div>

        <div className="rounded-2xl p-7" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
          <div className="flex rounded-full p-1 mb-6" style={{ backgroundColor: C.canvas }}>
            {[
              { key: "login", label: "Masuk", icon: LogIn },
              { key: "register", label: "Daftar", icon: UserPlus },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setMode(key);
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-full text-sm font-semibold transition-colors cursor-pointer"
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

          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
              <AlertCircle size={15} className="flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl flex items-center gap-2 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
              <CheckCircle2 size={15} className="flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <>
                <Field
                  label="Nama lengkap"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  placeholder="Nama lengkap kamu"
                  required
                />
                <Field
                  label="No. Telepon / WhatsApp"
                  name="no_telepon"
                  value={form.no_telepon}
                  onChange={handleChange}
                  placeholder="08123456789"
                  required
                />
              </>
            )}

            <Field
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="nama@email.com"
              required
            />

            <Field
              label="Kata sandi"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 py-3 rounded-full font-semibold text-sm flex items-center justify-center gap-2 cursor-pointer transition-opacity"
              style={{
                ...bodyFont,
                backgroundColor: C.amber,
                color: C.forestDeep,
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {mode === "login" ? "Masuk sekarang" : "Buat akun"}
            </button>
          </form>

          <p className="text-center text-xs mt-4" style={{ ...bodyFont, color: "#8A8272" }}>
            {mode === "login" ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => {
                setMode(mode === "login" ? "register" : "login");
                setErrorMsg("");
                setSuccessMsg("");
              }}
              className="font-semibold underline cursor-pointer"
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
