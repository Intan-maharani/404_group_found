"use client";

import { useState, useEffect } from "react";
import { Check, X, RefreshCw, Clock, Users, Tent } from "lucide-react";
import { C, headingFont } from "../../lib/tokens";
import { apiFetch } from "../../lib/api";

function normalizeStatus(rawStatus = "") {
  const s = String(rawStatus).toLowerCase().trim();
  if (
    s.includes("setuju") ||
    s.includes("approve") ||
    s === "disetujui" ||
    s === "approved" ||
    s === "acc"
  ) {
    return "Approved";
  }
  if (s.includes("tolak") || s.includes("reject") || s === "ditolak") {
    return "Rejected";
  }

  if (
    s.includes("pinjam") ||
    s.includes("borrow") ||
    s === "dipinjam" ||
    s === "active" ||
    s === "ongoing"
  ) {
    return "Borrowed";
  }
  if (
    s.includes("selesai") ||
    s.includes("return") ||
    s === "dikembalikan" ||
    s === "done" ||
    s === "completed"
  ) {
    return "Returned";
  }
  return "Pending";
}

const defaultBorrows = [];

export default function AdminPage() {
  const [borrows, setBorrows] = useState(defaultBorrows);
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);

  // State Modal Popup Interaktif
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("borrowed"); // 'borrowed' | 'pending' | 'users'
  const [modalTitle, setModalTitle] = useState("");

  // 1. Fetch Data Peminjaman Real-time dari Backend
  const loadAdminData = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/borrows");

      // Ambil override status lokal jika ada
      let localOverrides = {};
      try {
        localOverrides = JSON.parse(
          localStorage.getItem("admin_status_overrides") || "{}"
        );
      } catch {
        localOverrides = {};
      }

      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map((b, idx) => {
          const displayId = `CT-${String(idx + 1).padStart(3, "0")}`;
          const realId = b.id_borrow || b.id || displayId;

          const startDate =
            b.tanggal_mulai_sewa || b.tanggal_pinjam || "Hari ini";
          const endDate =
            b.tanggal_selesai_sewa || b.tanggal_kembali || "Besok";

          // Gunakan status override jika pernah diubah oleh admin
          const rawStatus =
            localOverrides[displayId] || localOverrides[realId] || b.status;

          return {
            realId,
            id: displayId,
            alat: b.nama_item || b.alat || `Peminjaman Alat Camping (${displayId})`,
            peminjam: b.nama_pemohon || b.user || b.peminjam || "Penyewa Anonim",
            tanggal: `${startDate} s.d ${endDate}`,
            status: normalizeStatus(rawStatus),
          };
        });
        setBorrows(mapped.reverse());
        setIsLiveApi(true);
      } else {
        setBorrows([]);
      }
    } catch (err) {
      console.warn("Backend /borrows kosong atau tidak dapat dijangkau:", err);
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // 2. Perhitungan Statistik Real-Time
  const alatDipinjamList = borrows.filter(
    (b) => b.status === "Borrowed" || b.status === "Approved"
  );
  const pendingList = borrows.filter((b) => b.status === "Pending");

  // Kelompokkan Penyewa Unik
  const activeRentersMap = borrows.reduce((acc, curr) => {
    if (!acc[curr.peminjam]) {
      acc[curr.peminjam] = [];
    }
    acc[curr.peminjam].push(curr);
    return acc;
  }, {});
  const uniqueRenters = Object.keys(activeRentersMap);

  // 3. Action Approve / Reject Real-Time ke Backend & Local Storage
  const handleUpdateStatus = async (itemObj, newStatus) => {
    // A. Simpan ke Local Storage agar halaman History langsung ter-update secara otomatis
    try {
      const existing = JSON.parse(
        localStorage.getItem("admin_status_overrides") || "{}"
      );
      existing[itemObj.id] = newStatus;
      existing[itemObj.realId] = newStatus;
      localStorage.setItem("admin_status_overrides", JSON.stringify(existing));
    } catch (e) {
      console.error("Gagal menyimpan override lokal:", e);
    }

    // B. Update UI Admin secara instan (Optimistic UI Update)
    setBorrows((prev) =>
      prev.map((b) => (b.id === itemObj.id ? { ...b, status: newStatus } : b))
    );

    // C. Kirim perubahan ke backend API
    try {
      const targetBackendStatus =
        newStatus === "Approved" ? "disetujui" : "ditolak";
      await apiFetch(`/borrows/${itemObj.realId}`, {
        method: "PUT",
        body: JSON.stringify({ status: targetBackendStatus }),
      });
      loadAdminData();
    } catch (err) {
      console.warn("Update PUT backend gagal, menggunakan state lokal:", err);
    }
  };

  const openDetailModal = (type, title) => {
    setModalType(type);
    setModalTitle(title);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-[#b8860b]">
            Fitur 4 dari 4
          </span>
          <h1
            className="text-2xl md:text-3xl font-bold mt-1"
            style={{ ...headingFont, color: C?.forestDeep || "#1a2e26" }}
          >
            Approval & Manajemen Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1 max-w-xl">
            Manajemen memantau ringkasan operasional, menyetujui atau menolak
            pengajuan, serta mengelola inventaris dan pengembalian alat.
          </p>
        </div>
        <button
          type="button"
          onClick={loadAdminData}
          disabled={loading}
          className="flex items-center gap-2 border border-gray-200 bg-white hover:bg-gray-50 px-4 py-2 rounded-xl text-xs font-semibold shadow-xs transition self-start sm:self-auto cursor-pointer"
          style={{ color: C?.forestDeep || "#1a2e26" }}
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>{loading ? "Memuat..." : "Refresh Data"}</span>
        </button>
      </div>

      {isLiveApi && (
        <div className="mb-6 px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span>✅ Terhubung ke Server Backend (Data Real-Time)</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 uppercase">
            Live API
          </span>
        </div>
      )}

      {/* --- KARTU STATISTIK INTERAKTIF --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {/* Kartu 1: Alat Sedang Dipinjam */}
        <button
          type="button"
          onClick={() =>
            openDetailModal("borrowed", "Daftar Alat Sedang Dipinjam")
          }
          className="text-left p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer border border-transparent hover:border-emerald-300"
          style={{ backgroundColor: C?.canvas || "#f5f3ef" }}
        >
          <div className="flex justify-between items-center w-full">
            <Tent className="w-6 h-6" style={{ color: C?.forestDeep || "#1a2e26" }} />
            <span className="text-[10px] bg-white text-gray-600 px-2.5 py-1 rounded-full font-bold border border-gray-200 shadow-xs">
              Klik Detail →
            </span>
          </div>
          <div className="mt-5">
            <div
              className="text-4xl font-bold"
              style={{ ...headingFont, color: C?.forestDeep || "#1a2e26" }}
            >
              {alatDipinjamList.length}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">
              Alat sedang dipinjam
            </div>
          </div>
        </button>

        {/* Kartu 2: Persetujuan Tertunda */}
        <button
          type="button"
          onClick={() =>
            openDetailModal("pending", "Daftar Persetujuan Tertunda")
          }
          className="text-left p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer border border-transparent hover:border-amber-300"
          style={{ backgroundColor: C?.canvas || "#f5f3ef" }}
        >
          <div className="flex justify-between items-center w-full">
            <Clock className="w-6 h-6 text-amber-600" />
            <span className="text-[10px] bg-white text-amber-700 px-2.5 py-1 rounded-full font-bold border border-amber-200 shadow-xs">
              Klik Detail →
            </span>
          </div>
          <div className="mt-5">
            <div
              className="text-4xl font-bold"
              style={{ ...headingFont, color: C?.forestDeep || "#1a2e26" }}
            >
              {pendingList.length}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">
              Persetujuan tertunda
            </div>
          </div>
        </button>

        {/* Kartu 3: Total Penyewa Aktif */}
        <button
          type="button"
          onClick={() => openDetailModal("users", "Daftar Penyewa Aktif")}
          className="text-left p-6 rounded-2xl flex flex-col justify-between transition-all hover:scale-[1.02] hover:shadow-md cursor-pointer border border-transparent hover:border-emerald-300"
          style={{ backgroundColor: C?.canvas || "#f5f3ef" }}
        >
          <div className="flex justify-between items-center w-full">
            <Users className="w-6 h-6" style={{ color: C?.forestDeep || "#1a2e26" }} />
            <span className="text-[10px] bg-white text-gray-600 px-2.5 py-1 rounded-full font-bold border border-gray-200 shadow-xs">
              Klik Detail →
            </span>
          </div>
          <div className="mt-5">
            <div
              className="text-4xl font-bold"
              style={{ ...headingFont, color: C?.forestDeep || "#1a2e26" }}
            >
              {uniqueRenters.length}
            </div>
            <div className="text-xs text-gray-600 font-medium mt-1">
              Total penyewa aktif
            </div>
          </div>
        </button>
      </div>

      {/* Bagian Utama: Antrean Persetujuan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-xs">
          <div
            className="text-white px-6 py-4 font-semibold text-sm flex items-center justify-between"
            style={{ backgroundColor: C?.forestDeep || "#1a2e26" }}
          >
            <span>📋 Antrean Persetujuan ({pendingList.length})</span>
            <span className="text-xs font-normal opacity-80">
              Perlu Konfirmasi Admin
            </span>
          </div>
          <div className="divide-y divide-gray-100 p-2">
            {pendingList.length === 0 ? (
              <div className="p-8 text-center text-gray-400 text-sm">
                Tidak ada persetujuan yang tertunda.
              </div>
            ) : (
              pendingList.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition"
                >
                  <div>
                    <div className="font-bold text-base text-gray-800">
                      {item.alat}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Peminjam:{" "}
                      <strong className="text-gray-700">{item.peminjam}</strong> ·{" "}
                      {item.tanggal} ·{" "}
                      <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                        {item.id}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item, "Approved")}
                      className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition cursor-pointer"
                      title="Setujui Peminjaman"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus(item, "Rejected")}
                      className="p-2.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
                      title="Tolak Peminjaman"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Panel Verifikasi Pengembalian */}
        <div
          className="rounded-2xl p-6 border border-gray-200"
          style={{ backgroundColor: C?.canvas || "#f5f3ef" }}
        >
          <h2 className="font-bold text-base text-gray-800 mb-1">
            🛡️ Verifikasi Pengembalian
          </h2>
          <p className="text-xs text-gray-500 mb-4">
            CT-2026-085 · Set Alat Masak · dikembalikan 10 Sep
          </p>

          <div className="space-y-3">
            <label className="flex items-center gap-3 text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              Kondisi lengkap
            </label>
            <label className="flex items-center gap-3 text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              Tidak ada kerusakan
            </label>
            <label className="flex items-center gap-3 text-xs text-gray-700 font-medium bg-white p-3 rounded-xl border border-gray-200 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                className="w-4 h-4 accent-emerald-700 rounded"
              />
              Tepat waktu
            </label>
          </div>
        </div>
      </div>

      {/* --- MODAL POPUP INTERAKTIF --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-gray-100">
            {/* Modal Header */}
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
              <h3
                className="text-lg font-bold text-gray-800"
                style={{ ...headingFont }}
              >
                {modalTitle}
              </h3>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="max-h-80 overflow-y-auto space-y-3 pr-1">
              {(modalType === "borrowed" || modalType === "pending") && (
                <>
                  {(modalType === "borrowed"
                    ? alatDipinjamList
                    : pendingList
                  ).length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-sm">
                      Tidak ada data untuk ditampilkan.
                    </p>
                  ) : (
                    (modalType === "borrowed"
                      ? alatDipinjamList
                      : pendingList
                    ).map((item) => (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex justify-between items-center"
                      >
                        <div>
                          <div className="font-bold text-sm text-gray-800">
                            {item.alat}
                          </div>
                          <div className="text-xs text-gray-600 mt-0.5">
                            Peminjam:{" "}
                            <span className="font-semibold text-gray-800">
                              {item.peminjam}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-400 mt-0.5">
                            Periode: {item.tanggal}
                          </div>
                        </div>
                        <span className="text-[10px] font-mono bg-white px-2 py-1 rounded border border-gray-200 text-gray-600 font-medium">
                          {item.id}
                        </span>
                      </div>
                    ))
                  )}
                </>
              )}

              {modalType === "users" && (
                <>
                  {uniqueRenters.length === 0 ? (
                    <p className="text-gray-400 text-center py-6 text-sm">
                      Tidak ada penyewa aktif saat ini.
                    </p>
                  ) : (
                    uniqueRenters.map((renterName, idx) => {
                      const userItems = activeRentersMap[renterName];
                      return (
                        <div
                          key={idx}
                          className="p-4 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <div className="font-bold text-sm text-gray-800 flex items-center justify-between mb-2">
                            <span>👤 {renterName}</span>
                            <span className="text-[10px] font-semibold bg-white border border-gray-200 px-2 py-0.5 rounded-full text-gray-600">
                              {userItems.length} Transaksi
                            </span>
                          </div>
                          <div className="space-y-1.5">
                            {userItems.map((it) => (
                              <div
                                key={it.id}
                                className="flex justify-between items-center bg-white p-2 rounded-lg border border-gray-100 text-xs"
                              >
                                <span className="font-medium text-gray-700">
                                  • {it.alat}
                                </span>
                                <span
                                  className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                    it.status === "Borrowed" ||
                                    it.status === "Approved"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-amber-50 text-amber-700 border border-amber-200"
                                  }`}
                                >
                                  {it.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })
                  )}
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="mt-5 pt-3 border-t border-gray-100 text-right">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-white rounded-xl text-xs font-semibold transition hover:opacity-90 cursor-pointer"
                style={{ backgroundColor: C?.forestDeep || "#1a2e26" }}
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}