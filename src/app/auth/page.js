"use client";

import React, { useState } from "react";
import { Tent, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("user");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    if (!username) return;
    
    // Simpan role di browser
    localStorage.setItem("userRole", role);
    localStorage.setItem("userName", username);

    // Redirect sesuai role
    if (role === "admin") {
      router.push("/admin");
    } else {
      router.push("/catalog");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col justify-between">
      <header className="px-8 py-6 flex justify-between items-center border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Tent className="w-8 h-8 text-emerald-400" />
          <span className="text-2xl font-bold tracking-wider text-emerald-400">CHILL TIME</span>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-emerald-400 text-sm">
            <Sparkles className="w-4 h-4" /> Solusi Praktis Liburan Outdoor
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
            Sewa Alat Camping Mudah Bersama <span className="text-emerald-400">Chill Time</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Pilih paket bundling hemat atau barang satuan berkualitas untuk petualanganmu.
          </p>
        </div>

        <div className="w-full md:w-96 p-8 bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Masuk Akun</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm mb-1 text-slate-300">Nama Pengguna</label>
              <input
                type="text"
                required
                placeholder="Masukkan nama..."
                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-slate-300">Role Pengguna</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-2 px-4 rounded-lg text-sm border ${role === "user" ? "bg-emerald-500 text-white" : "bg-slate-900 text-slate-400"}`}
                >
                  User
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 px-4 rounded-lg text-sm border ${role === "admin" ? "bg-emerald-500 text-white" : "bg-slate-900 text-slate-400"}`}
                >
                  Admin
                </button>
              </div>
            </div>

            <button type="submit" className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-lg">
              Masuk
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center text-sm text-slate-500 border-t border-slate-800">
        &copy; 2026 CHILL TIME
      </footer>
    </div>
  );
}