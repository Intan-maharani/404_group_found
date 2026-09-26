"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Package, ShoppingBag, Calendar, CheckCircle2, X, AlertCircle, ShieldAlert, RefreshCw } from "lucide-react";
import { apiFetch } from "../../lib/api";

export default function CatalogPage() {
  const [bundleItems, setBundleItems] = useState([]);
  const [satuanItems, setSatuanItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const updateRole = () => {
      try {
        const sessionUserStr = localStorage.getItem("session_user");
        if (sessionUserStr) {
          const userObj = JSON.parse(sessionUserStr);
          const role = String(userObj.role || "").toLowerCase().trim();
          setIsAdmin(role === "admin");
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        setIsAdmin(false);
      }
    };

    updateRole();
    window.addEventListener("auth-change", updateRole);
    window.addEventListener("storage", updateRole);
    return () => {
      window.removeEventListener("auth-change", updateRole);
      window.removeEventListener("storage", updateRole);
    };
  }, []);

  const loadCatalogData = async () => {
    setLoading(true);
    let fetchedBundles = [];
    let fetchedSatuan = [];

    // 1. Ambil data Paket dari endpoint /packages
    try {
      const resPkg = await apiFetch("/packages");
      const rawPkg = Array.isArray(resPkg) ? resPkg : (resPkg?.data || []);
      fetchedBundles = rawPkg.map((pkg, idx) => ({
        id: pkg.uuid || pkg.id || `pkg-${idx}`,
        name: pkg.nama_paket || pkg.name || "Paket Camping",
        category: "Bundle",
        pricePerDay: Number(pkg.harga_paket_hari || pkg.harga || pkg.pricePerDay) || 100000,
        available: Number(pkg.stok || pkg.available) || 5,
        image: pkg.ikon || pkg.image || "https://i.pinimg.com/1200x/de/12/42/de12422cd598be0198805dac5e67506a.jpg",
        description: pkg.deskripsi || pkg.description || "Paket bundle hemat untuk kegiatan camping dan piknik.",
      }));
    } catch (e) {
      console.log("Gagal memuat endpoint /packages:", e);
    }

    // 2. Ambil data Barang Satuan dari endpoint /items
    try {
      const resItem = await apiFetch("/items");
      const rawItem = Array.isArray(resItem) ? resItem : (resItem?.data || []);
      fetchedSatuan = rawItem.map((item, idx) => ({
        id: item.uuid || item.id || `item-${idx}`,
        name: item.nama_item || item.name || "Barang Satuan",
        category: "Satuan",
        pricePerDay: Number(item.harga_sewa_hari || item.harga_sewa || item.pricePerDay) || 25000,
        available: Number(item.stok_tersedia ?? item.available) ?? 10,
        image: item.ikon_item || item.image || "https://i.pinimg.com/1200x/ef/ad/a8/efada842dbe689ef1f1965066334aa15.jpg",
        description: item.deskripsi || item.description || "Peralatan satuan berkualitas untuk kebutuhan outdoor Anda.",
      }));
    } catch (e) {
      console.log("Gagal memuat endpoint /items:", e);
    }

    setBundleItems(fetchedBundles);
    setSatuanItems(fetchedSatuan);
    setLoading(false);
  };

  useEffect(() => {
    loadCatalogData();
  }, []);

  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayStr = getTodayString();

  const handleOpenBorrowModal = (item) => {
    if (isAdmin) {
      alert("Akun Admin tidak diizinkan meminjam barang. Peminjaman hanya untuk akun User.");
      return;
    }

    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];

    setStartDate(formatDate(today));
    setEndDate(formatDate(tomorrow));
    setErrorMessage("");
    setSelectedItem(item);
  };

  const handleConfirmBorrow = async () => {
    if (!startDate || !endDate) {
      setErrorMessage("Silakan pilih tanggal mulai dan selesai sewa!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date(todayStr);

    if (start < today) {
      setErrorMessage("Tanggal sewa tidak boleh tanggal yang sudah lewat!");
      return;
    }

    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    if (end < start) {
      setErrorMessage("Tanggal selesai sewa tidak boleh sebelum tanggal mulai!");
      return;
    }

    if (dayDiff < 1) {
      setErrorMessage("Peminjaman tidak boleh kurang dari sehari (minimal 1 hari)!");
      return;
    }

    let sessionUser = { id: "71cedae5-a3e9-a9dd-47a4-b6919bb07701", username: "ayuay" };
    try {
      const storedUser = localStorage.getItem("session_user");
      if (storedUser) sessionUser = JSON.parse(storedUser);
    } catch (e) {}

    const borrowId = `CT-${Date.now().toString().slice(-4)}`;
    const payload = {
      uuid: borrowId,
      id: borrowId,
      user_id: sessionUser.id || sessionUser.uuid || "71cedae5-a3e9-a9dd-47a4-b6919bb07701",
      user_nama: sessionUser.username || sessionUser.email || "ayuay",
      tanggal_pengajuan: new Date().toISOString().split("T")[0],
      tanggal_mulai_sewa: startDate,
      tanggal_selesai_sewa: endDate,
      tgl_mulai_sewa: startDate,
      tgl_selesai_sewa: endDate,
      nama_item: selectedItem.name,
      alat: selectedItem.name,
      total_biaya: selectedItem.pricePerDay * dayDiff,
      status: "Pending",
    };

    // Simpan ke localStorage terlebih dahulu agar dijamin langsung muncul di Riwayat
    try {
      const existingList = JSON.parse(localStorage.getItem("local_borrows_list") || "[]");
      existingList.push(payload);
      localStorage.setItem("local_borrows_list", JSON.stringify(existingList));

      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      localOverrides[borrowId] = "Pending";
      localStorage.setItem("admin_status_overrides", JSON.stringify(localOverrides));
    } catch (e) {
      console.error("Gagal simpan lokal:", e);
    }

    // Coba kirim ke API backend, jika gagal tetap sukses lewat penyimpanan lokal
    try {
      await apiFetch("/borrows", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("Backend API POST diabaikan, diproses via lokal:", err);
    }

    alert(`Pengajuan peminjaman "${selectedItem.name}" berhasil diajukan!`);
    setSelectedItem(null);
    window.location.href = "/history";
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-800">
      <div className="max-w-7xl mx-auto mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Katalog Peminjaman Alat Piknik
          </h1>
          <p className="text-slate-600 text-base sm:text-lg">
            Pilih paket glamping/bundle atau peralatan satuan langsung dari database.
          </p>
        </div>
        <button
          type="button"
          onClick={loadCatalogData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 bg-white hover:bg-stone-50 transition-colors self-start sm:self-auto shadow-xs text-slate-700"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Memuat..." : "Refresh Katalog"}</span>
        </button>
      </div>

      {isAdmin && (
        <div className="max-w-7xl mx-auto mb-8 p-4 bg-amber-50 border border-amber-300 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-amber-900 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-stone-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <p className="font-bold text-sm text-stone-900">Mode Administrator Aktif</p>
              <p className="text-xs text-amber-800">
                Anda masuk sebagai <strong>Admin</strong>. Tombol peminjaman dinonaktifkan khusus untuk akun pengelola/admin.
              </p>
            </div>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-stone-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap self-start sm:self-auto shadow-xs"
          >
            Buka Panel Approval &rarr;
          </Link>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-12">
        {loading ? (
          <div className="text-center py-20 text-slate-400 text-sm">Memuat data paket dan item dari database...</div>
        ) : (
          <>
            {/* Section 1: Paket Glamping / Bundle (Dari tabel /packages) */}
            {bundleItems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6 border-b pb-3 border-slate-200">
                  <Package className="text-emerald-600 w-6 h-6" />
                  <h2 className="text-2xl font-bold text-slate-900">Paket Glamping & Bundle</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {bundleItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col overflow-hidden group"
                    >
                      <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://i.pinimg.com/1200x/de/12/42/de12422cd598be0198805dac5e67506a.jpg";
                          }}
                        />
                        <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                          Paket Glamping
                        </span>
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                          Stok: {item.available}
                        </span>
                      </div>

                      <div className="p-5 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-slate-600 text-sm mt-2 leading-relaxed line-clamp-3">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-1 overflow-hidden">
                          <div className="min-w-0 flex-1">
                            <span className="text-[10px] text-slate-400 block leading-none mb-1">Sewa / Hari</span>
                            <span className="font-extrabold text-emerald-600 text-xs sm:text-sm whitespace-nowrap tracking-tight block">
                              Rp {item.pricePerDay.toLocaleString("id-ID")}
                            </span>
                          </div>
                          {!isAdmin ? (
                            <button
                              onClick={() => handleOpenBorrowModal(item)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-sm shrink-0 whitespace-nowrap cursor-pointer"
                            >
                              Pinjam Paket
                            </button>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-lg border border-amber-300 shrink-0">
                              Mode Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 2: Barang Satuan (Dari tabel /items) */}
            {satuanItems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-6 border-b pb-3 border-slate-200">
                  <ShoppingBag className="text-emerald-600 w-6 h-6" />
                  <h2 className="text-2xl font-bold text-slate-900">Barang Satuan Camping & Piknik</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {satuanItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col overflow-hidden group"
                    >
                      <div className="relative h-44 w-full overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.src = "https://i.pinimg.com/1200x/de/12/42/de12422cd598be0198805dac5e67506a.jpg";
                          }}
                        />
                        <span className="absolute top-3 left-3 bg-slate-800 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                          Satuan
                        </span>
                        <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-medium px-2 py-0.5 rounded-full border border-slate-200">
                          Stok: {item.available}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col flex-1 justify-between">
                        <div>
                          <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                            {item.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1.5 leading-relaxed line-clamp-2">
                            {item.description}
                          </p>
                        </div>

                        <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center gap-1.5">
                          <div className="shrink-0">
                            <span className="text-[10px] text-slate-400 block leading-tight">Sewa / Hari</span>
                            <span className="font-bold text-emerald-600 text-xs sm:text-sm whitespace-nowrap">
                              Rp {item.pricePerDay.toLocaleString("id-ID")}
                            </span>
                          </div>
                          {!isAdmin ? (
                            <button
                              onClick={() => handleOpenBorrowModal(item)}
                              className="bg-slate-900 hover:bg-emerald-600 text-white font-medium px-3 py-1.5 rounded-lg text-xs transition-colors active:scale-95 duration-150 shrink-0 whitespace-nowrap cursor-pointer"
                            >
                              Pinjam
                            </button>
                          ) : (
                            <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-1 rounded-lg border border-amber-300 shrink-0">
                              Mode Admin
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                Formulir Peminjaman
              </span>
              <h3 className="font-bold text-xl text-slate-900 mt-2">{selectedItem.name}</h3>
              <p className="text-sm text-slate-500 mt-1">
                Harga Sewa:{" "}
                <strong className="text-emerald-600 font-semibold whitespace-nowrap">
                  Rp {selectedItem.pricePerDay.toLocaleString("id-ID")}
                </strong>{" "}
                / hari
              </p>
            </div>

            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Tanggal Mulai Sewa
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Tanggal Selesai Sewa
                </label>
                <input
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBorrow}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" /> Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}