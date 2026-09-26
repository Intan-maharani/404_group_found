"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock3, CheckCircle2, XCircle, Backpack, RotateCcw, RefreshCw } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";
import { apiFetch } from "../../lib/api";

const statusMeta = {
  pending: { label: "Pending", color: C.amberDeep, icon: Clock3, note: "Menunggu persetujuan manajemen" },
  approved: { label: "Approved", color: C.moss, icon: CheckCircle2, note: "Pengajuan disetujui, siap diambil" },
  rejected: { label: "Rejected", color: C.rust, icon: XCircle, note: "Pengajuan ditolak manajemen" },
  borrowed: { label: "Borrowed", color: C.sky, icon: Backpack, note: "Alat sedang dibawa penyewa" },
  returned: { label: "Returned", color: "#7B8A6E", icon: RotateCcw, note: "Alat sudah dikembalikan & diverifikasi" },
};

function normalizeStatus(rawStatus = "") {
  const s = String(rawStatus).toLowerCase().trim();
  if (s.includes("approve") || s === "disetujui" || s === "acc") return "approved";
  if (s.includes("tolak") || s === "ditolak") return "rejected";
  if (s.includes("pinjam") || s === "dipinjam") return "borrowed";
  if (s.includes("selesai") || s === "dikembalikan") return "returned";
  return "pending";
}

export default function HistoryPage() {
  const [riwayat, setRiwayat] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(false);

  const filteredRiwayat = riwayat.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status.toLowerCase() === activeFilter.toLowerCase();
  });

  const current = filteredRiwayat.find((r) => r.id === selectedId) || filteredRiwayat[0] || null;
  const meta = statusMeta[current?.status?.toLowerCase()] || statusMeta.pending;

  const countStatus = (statusKey) => {
    if (statusKey === "ALL") return riwayat.length;
    return riwayat.filter((r) => r.status.toLowerCase() === statusKey.toLowerCase()).length;
  };

  // Ambil data murni dari endpoint database /borrows
  const loadBorrows = useCallback(async (isBackgroundFetch = false) => {
    if (!isBackgroundFetch) setLoading(true);

    try {
      const res = await apiFetch("/borrows");
      const apiList = Array.isArray(res) ? res : (res?.data || []);

      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      const localNames = JSON.parse(localStorage.getItem("borrow_item_names") || "{}");

      // 1. Ambil data user yang sedang aktif login dari localStorage
      let currentUser = null;
      try {
        const storedUser = localStorage.getItem("session_user");
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }
      } catch (e) {}

      // 2. Tentukan apakah user saat ini adalah admin
      const userRole = String(currentUser?.role || currentUser?.type || "").toLowerCase();
      const userEmail = String(currentUser?.email || "").toLowerCase();
      const isAdmin = userRole === "admin" || userEmail === "admin@chilltime.com";

      const mapped = apiList.map((b, idx) => {
        const displayId = b.id_peminjaman || b.uuid || b.id || `CT-${String(idx + 1).padStart(3, "0")}`;
        
        const startDate = b.tanggal_mulai_sewa || b.tgl_mulai_sewa || "Hari ini";
        const endDate = b.tanggal_selesai_sewa || b.tgl_selesai_sewa || "Selesai";
        
        const rawBiaya = Number(b.total_biaya || b.total_harga || 50000);
        const rawStatus = localOverrides[displayId] || b.status_peminjaman || b.status || "pending";
        const namaBarang = b.nama_item || b.alat || localNames[displayId] || `Peminjaman Alat #${idx + 1}`;
        const namaUser = b.user_nama || b.nama_user || b.username || b.nama || "";

        return {
          id: displayId,
          userId: String(b.id_user || b.user_id || ""),
          alat: namaBarang,
          peminjam: namaUser,
          tanggal: `${startDate} s.d ${endDate}`,
          durasi: b.total_durasi ? `${b.total_durasi} Hari` : "1 Hari",
          status: normalizeStatus(rawStatus),
          total: `Rp${rawBiaya.toLocaleString("id-ID")}`,
        };
      });

      // 3. FILTER HAK AKSES: Admin lihat semua, User biasa HANYA melihat miliknya sendiri
      const filteredByUser = isAdmin 
        ? mapped 
        : mapped.filter(item => {
            if (!currentUser) return false; 
            
            const currentUserId = String(currentUser.id || currentUser.uuid || "").trim();
            const itemUserId = String(item.userId || "").trim();

            // Cocokkan berdasarkan ID User
            if (currentUserId && itemUserId && currentUserId === itemUserId) {
              return true;
            }

            // Fallback: Cocokkan berdasarkan nama user yang login
            if (item.peminjam && currentUser.name && item.peminjam.toLowerCase().trim() === currentUser.name.toLowerCase().trim()) {
              return true;
            }

            return false;
          });

      // Urutkan dari data terbaru di database
      const finalResult = filteredByUser.reverse();
      setRiwayat(finalResult);
      setSelectedId((prev) => prev || finalResult[0]?.id || "");
    } catch (e) {
      console.error("Gagal mengambil data riwayat dari database:", e);
    } finally {
      if (!isBackgroundFetch) setLoading(false);
    }
  }, []);

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!current) return;
    setReturning(true);

    const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
    localOverrides[current.id] = "returned";
    localStorage.setItem("admin_status_overrides", JSON.stringify(localOverrides));

    alert("Pengembalian alat berhasil dikonfirmasi!");
    loadBorrows(true);
    setReturning(false);
  };

  useEffect(() => {
    loadBorrows();
    const intervalId = setInterval(() => loadBorrows(true), 3000);
    return () => clearInterval(intervalId);
  }, [loadBorrows]);

  return (
    <div>
      <div className="flex items-start justify-between gap-4 mb-5">
        <SectionEyebrow
          index={3}
          total={4}
          title="Daftar & Status Peminjaman"
          desc="Pantau seluruh pengajuan sewa, tanggal pengembalian, dan konfirmasi verifikasi dari manajemen secara real-time."
        />
        <button
          type="button"
          onClick={() => loadBorrows(false)}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 hover:bg-stone-50 transition-colors flex-shrink-0 bg-white"
          style={{ color: C.forestDeep }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Memuat..." : "Refresh Status"}</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* Left Column */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.canvasDeep}` }}>
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ backgroundColor: C.forestDeep, color: C.paper }}>
            <div className="flex items-center gap-2">
              <p className="text-sm font-semibold" style={{ ...headingFont }}>
                Daftar Riwayat ({filteredRiwayat.length})
              </p>
              {activeFilter !== "ALL" && (
                <button
                  onClick={() => setActiveFilter("ALL")}
                  className="text-[10px] bg-white/25 hover:bg-white/40 text-white px-2 py-0.5 rounded-full transition cursor-pointer"
                >
                  Reset Filter ✕
                </button>
              )}
            </div>
            <Link
              href="/catalog"
              className="text-xs font-semibold underline flex items-center gap-1 opacity-90 hover:opacity-100"
              style={{ color: C.amber }}
            >
              + Sewa Baru
            </Link>
          </div>

          <div className="divide-y max-h-[460px] overflow-y-auto" style={{ borderColor: C.canvasDeep, backgroundColor: "#fff" }}>
            {filteredRiwayat.length === 0 ? (
              <div className="p-10 text-center text-gray-400 text-xs">
                Belum ada transaksi peminjaman untuk akun Anda.
              </div>
            ) : (
              filteredRiwayat.map((item) => {
                const s = statusMeta[item.status.toLowerCase()] || statusMeta.pending;
                const isSelected = item.id === current?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors cursor-pointer"
                    style={{ backgroundColor: isSelected ? C.paper : "#fff" }}
                  >
                    <div className="pr-3">
                      <p className="text-sm font-semibold truncate max-w-[220px] md:max-w-xs" style={{ ...headingFont, color: C.ink }}>
                        {item.alat}
                      </p>
                      <p className="text-xs mt-0.5" style={{ ...bodyFont, color: "#8A8272" }}>
                        ID: {item.id} · {item.tanggal}
                      </p>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0 capitalize"
                      style={{
                        ...bodyFont,
                        backgroundColor: `${s.color}1A`,
                        color: s.color,
                        border: `1px solid ${s.color}40`,
                      }}
                    >
                      <s.icon size={13} />
                      {s.label}
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
          {current ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-wide" style={{ ...bodyFont, color: "#8A8272" }}>
                Detail Transaksi
              </p>
              <h3 className="text-xl font-bold mt-1 mb-1" style={{ ...headingFont, color: C.forestDeep }}>
                {current.alat}
              </h3>
              <p className="text-xs mb-3" style={{ ...bodyFont, color: "#8A8272" }}>
                ID: {current.id} · Periode: {current.tanggal}
              </p>

              {current.total && (
                <div className="mb-5 inline-block px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700">
                  Total Biaya: <span style={{ color: C.forestDeep }} className="font-bold">{current.total}</span>
                </div>
              )}

              <div
                className="p-4 rounded-xl mb-6 flex items-start gap-3"
                style={{ backgroundColor: `${meta.color}15`, border: `1px solid ${meta.color}40` }}
              >
                <meta.icon size={20} className="mt-0.5 flex-shrink-0" style={{ color: meta.color }} />
                <div>
                  <p className="text-sm font-bold capitalize" style={{ ...headingFont, color: meta.color }}>
                    Status: {meta.label}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ ...bodyFont, color: "#5C5548" }}>
                    {meta.note}
                  </p>
                </div>
              </div>

              {current.status.toLowerCase() === "borrowed" && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <form onSubmit={handleReturnSubmit} className="space-y-3">
                    <button
                      type="submit"
                      disabled={returning}
                      className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold bg-amber-700 hover:bg-amber-800 text-white cursor-pointer shadow-xs flex items-center justify-center gap-1.5"
                    >
                      <RotateCcw size={14} className={returning ? "animate-spin" : ""} />
                      <span>{returning ? "Memproses..." : "Konfirmasi Pengembalian Alat"}</span>
                    </button>
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs">
              Belum ada transaksi peminjaman.
            </div>
          )}

          <div className="flex justify-between items-center mb-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ ...bodyFont, color: "#8A8272" }}>
              Tahapan Pelacakan
            </p>
            <span className="text-[10px] text-stone-500 font-medium">Klik tahapan untuk menyaring</span>
          </div>

          <div className="space-y-2.5 text-xs" style={{ ...bodyFont }}>
            {["pending", "approved", "borrowed", "returned", "rejected"].map((step) => {
              const isCurrentStatus = current && step.toLowerCase() === current.status.toLowerCase();
              const isSelectedFilter = activeFilter.toLowerCase() === step.toLowerCase();
              const stepInfo = statusMeta[step];
              const count = countStatus(step);

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => {
                    if (activeFilter.toLowerCase() === step.toLowerCase()) setActiveFilter("ALL");
                    else {
                      setActiveFilter(step);
                      const match = filteredRiwayat.find((r) => r.status.toLowerCase() === step.toLowerCase());
                      if (match) setSelectedId(match.id);
                    }
                  }}
                  className={`w-full flex items-center gap-2.5 p-2.5 rounded-xl transition-all cursor-pointer text-left border ${
                    isSelectedFilter
                      ? "bg-white shadow-xs border-emerald-600 scale-[1.02]"
                      : isCurrentStatus
                      ? "bg-white border-stone-300"
                      : "bg-transparent border-transparent hover:bg-white/60"
                  }`}
                >
                  <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: isCurrentStatus || isSelectedFilter ? stepInfo.color : "#C5BCAB" }}
                  />
                  <span className="capitalize" style={{ color: isCurrentStatus || isSelectedFilter ? C.forestDeep : "#8A8272", fontWeight: isCurrentStatus || isSelectedFilter ? 700 : 500 }}>
                    {step}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full border border-stone-200">
                      {count}
                    </span>
                    {isCurrentStatus && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize" style={{ backgroundColor: `${stepInfo.color}20`, color: stepInfo.color }}>
                        Status Sekarang
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
