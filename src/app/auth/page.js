"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleAuth = (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    setTimeout(() => {
      if (isLogin) {
        // Validasi input sederhana
        if (!email || !password) {
          setErrorMsg("Email dan kata sandi wajib diisi!");
          setIsLoading(false);
          return;
        }

        // Cek jika yang masuk adalah Admin
        if (email.toLowerCase().includes("admin") || email === "admin@gmail.com") {
          localStorage.setItem("userRole", "admin");
          localStorage.setItem("userEmail", email);
        } else {
          // Jika pengguna biasa (User)
          localStorage.setItem("userRole", "user");
          localStorage.setItem("userEmail", email);
        }

        // Berhasil login -> Arahkan langsung ke halaman Katalog Peminjaman
        router.push("/catalog");
      } else {
        alert("Pendaftaran akun berhasil, silakan masuk!");
        setIsLogin(true);
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ea] flex items-center justify-center p-6 text-[#1b2b22]">
      <div className="bg-white rounded-3xl p-8 max-w-4xl w-full shadow-sm border border-slate-200/60 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Banner Kiri */}
        <div className="bg-[#132a20] text-white p-8 rounded-2xl flex flex-col justify-between">
          <div>
            <div className="text-amber-400 text-3xl mb-4">⛺</div>
            <h2 className="text-2xl font-bold mb-3">Alat lengkap, tinggal berangkat.</h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Sewa coolbox, tikar, kompor portable, tenda, dan lampu camping dalam hitungan menit. Kembalikan setelah petualangan selesai.
            </p>
          </div>
        </div>

        {/* Form Kanan */}
        <div className="flex flex-col justify-center">
          <div className="flex bg-[#e8e4d9] p-1 rounded-full mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setErrorMsg(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                isLogin ? "bg-[#132a20] text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              ➔ Masuk
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setErrorMsg(""); }}
              className={`flex-1 py-2 text-sm font-semibold rounded-full transition-all ${
                !isLogin ? "bg-[#132a20] text-white shadow" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              👤+ Daftar
            </button>
          </div>

          {/* Pesan Error */}
          {errorMsg && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@gmail.com"
                className="w-full bg-[#eef2fc] border-none rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#132a20]/20 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Kata sandi</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#eef2fc] border-none rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#132a20]/20 text-slate-800"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#e29d38] hover:bg-[#d18c27] text-white font-bold py-3 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50"
            >
              {isLoading ? "Memproses..." : isLogin ? "Masuk sekarang" : "Daftar Akun"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-500 mt-4">
            {isLogin ? "Belum punya akun? " : "Sudah punya akun? "}
            <button
              type="button"
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
              className="text-slate-800 font-semibold underline"
            >
              {isLogin ? "Daftar di sini" : "Masuk di sini"}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}