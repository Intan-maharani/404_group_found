"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Clock3, CheckCircle2, XCircle, Backpack, RotateCcw, RefreshCw } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";
import { apiFetch } from "../../lib/api";

const statusMeta = {
  Pending: { label: "Pending", color: C.amberDeep, icon: Clock3, note: "Menunggu persetujuan manajemen" },
  Approved: { label: "Approved", color: C.moss, icon: CheckCircle2, note: "Pengajuan disetujui, siap diambil" },
  Rejected: { label: "Rejected", color: C.rust, icon: XCircle, note: "Pengajuan ditolak manajemen" },
  Borrowed: { label: "Borrowed", color: C.sky, icon: Backpack, note: "Alat sedang dibawa penyewa" },
  Returned: { label: "Returned", color: "#7B8A6E", icon: RotateCcw, note: "Alat sudah dikembalikan & diverifikasi" },
};

const defaultRiwayat = [];

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
  if (s.includes("pinjam") || s.includes("borrow") || s === "dipinjam") {
    return "Borrowed";
  }
  if (s.includes("selesai") || s.includes("return") || s === "dikembalikan") {
    return "Returned";
  }
  return "Pending";
}

export default function HistoryPage() {
  const [riwayat, setRiwayat] = useState(defaultRiwayat);
  const [selectedId, setSelectedId] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(false);
  const [isEarlyReturn, setIsEarlyReturn] = useState(true);
  const [catatanReturn, setCatatanReturn] = useState("");

  const filteredRiwayat = riwayat.filter((item) => {
    if (activeFilter === "ALL") return true;
    return item.status === activeFilter;
  });

  const current =
    riwayat.find((r) => r.id === selectedId) ||
    filteredRiwayat[0] ||
    riwayat[0] ||
    null;

  const meta = statusMeta[current?.status] || statusMeta.Pending;

  const countStatus = (statusKey) => {
    if (statusKey === "ALL") return riwayat.length;
    return riwayat.filter((r) => r.status === statusKey).length;
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    if (!current) return;

    setReturning(true);
    const todayStr = new Date().toISOString().split("T")[0];

    try {
      const payload = {
        status: "Returned",
        tanggal_dikembalikan_aktual: todayStr,
        catatan: isEarlyReturn 
          ? `[Pengembalian Lebih Awal] ${catatanReturn || "Alat dikembalikan sebelum tanggal tenggat."}`
          : catatanReturn || "Pengembalian sesuai jadwal.",
      };

      await apiFetch(`/borrows_details/${current.realId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      if (current.id) localOverrides[current.id] = "Returned";
      if (current.realId) localOverrides[current.realId] = "Returned";
      localStorage.setItem("admin_status_overrides", JSON.stringify(localOverrides));

      alert(isEarlyReturn ? "Berhasil mengajukan pengembalian lebih awal!" : "Pengembalian alat berhasil dikonfirmasi!");
      setCatatanReturn("");
      loadBorrows(true);
    } catch (err) {
      console.warn("Gagal melakukan pengembalian ke API, diproses secara lokal:", err.message);
      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      if (current.id) localOverrides[current.id] = "Returned";
      if (current.realId) localOverrides[current.realId] = "Returned";
      localStorage.setItem("admin_status_overrides", JSON.stringify(localOverrides));

      alert("Pengembalian alat diproses secara lokal!");
      setCatatanReturn("");
      loadBorrows(true);
    } finally {
      setReturning(false);
    }
  };

  const loadBorrows = useCallback(async (isBackgroundFetch = false) => {
    if (!isBackgroundFetch) setLoading(true);

    // 1. Ambil data transaksi simpanan lokal dari Katalog
    let localList = [];
    let localOverrides = {};
    try {
      localList = JSON.parse(localStorage.getItem("local_borrows_list") || "[]");
      localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
    } catch {
      localList = [];
      localOverrides = {};
    }

    try {
      // 2. Ambil data dari API Backend
      const res = await apiFetch("/borrows_details");
      const rawApiList = Array.isArray(res) ? res : (res?.data || []);

      // Gabungkan data dari API dan simpanan lokal
      const combinedList = [...rawApiList, ...localList];

      if (combinedList.length > 0) {
        const mapped = combinedList.map((b, idx) => {
          const displayId = b.id || `CT-${String(idx + 1).padStart(3, "0")}`;
          const realId = b.id_borrow_detail || b.id_borrow || b.id || displayId;
          
          const startDate = b.tanggal_mulai_sewa || b.tanggal_pinjam || "Hari ini";
          const endDate = b.tanggal_selesai_sewa || b.tanggal_kembali || "Besok";
          const dayDiff = Math.max(1, Math.ceil(Math.abs(new Date(String(endDate).replace(/-/g, "/")) - new Date(String(startDate).replace(/-/g, "/"))) / 86400000) || 1);
          const rawBiaya = Number(b.total_biaya || b.total_harga || b.total) || (dayDiff * 45000);
          const totalHarga = `Rp${rawBiaya.toLocaleString("id-ID")}`;

          let statusRaw = localOverrides[displayId] || localOverrides[realId] || b.status_peminjaman || b.status || "Pending";
          const normalized = normalizeStatus(statusRaw);

          if (normalized === "Approved") {
            const rawStart = b.tanggal_mulai_sewa || b.tanggal_pinjam;
            const rawEnd = b.tanggal_selesai_sewa || b.tanggal_kembali;

            if (rawStart && rawEnd) {
              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const start = new Date(String(rawStart).replace(/-/g, "/"));
              const end = new Date(String(rawEnd).replace(/-/g, "/"));

              start.setHours(0, 0, 0, 0);
              end.setHours(0, 0, 0, 0);

              if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                if (today >= start && today <= end) {
                  statusRaw = "Borrowed"; 
                } else if (today > end) {
                  statusRaw = "Returned"; 
                }
              }
            }
          }

          return {
            realId,
            id: displayId,
            alat: b.nama_item || b.alat || `Peminjaman Alat Camping (${displayId})`,
            tanggal: `${startDate} s.d ${endDate}`,
            status: normalizeStatus(statusRaw),
            total: totalHarga,
          };
        });

        const sorted = mapped.reverse();
        setRiwayat(sorted);
        setSelectedId((prev) => prev || sorted[0]?.id || "");
      } else {
        setRiwayat([]);
      }
    } catch (err) {
      // Fallback jika API bermasalah: Tetap tampilkan data transaksi lokal dari Katalog
      if (localList.length > 0) {
        const mappedLocal = localList.map((b, idx) => {
          const displayId = b.id || `CT-${String(idx + 1).padStart(3, "0")}`;
          const startDate = b.tanggal_mulai_sewa || "Hari ini";
          const endDate = b.tanggal_selesai_sewa || "Besok";
          let statusRaw = localOverrides[displayId] || b.status || "Pending";

          return {
            realId: displayId,
            id: displayId,
            alat: b.nama_item || b.alat || "Peminjaman Alat",
            tanggal: `${startDate} s.d ${endDate}`,
            status: normalizeStatus(statusRaw),
            total: `Rp${Number(b.total_biaya || 50000).toLocaleString("id-ID")}`,
          };
        });
        setRiwayat(mappedLocal.reverse());
        setSelectedId((prev) => prev || mappedLocal[0]?.id || "");
      } else {
        setRiwayat([]);
      }
    } finally {
      if (!isBackgroundFetch) setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBorrows();
 
    const intervalId = setInterval(() => {
      loadBorrows(true);
    }, 2000);

    const handleFocus = () => loadBorrows(true);
    window.addEventListener("focus", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
    };
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
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 hover:bg-stone-50 transition-colors flex-shrink-0"
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
                  className="text-[10px] bg-white/20 hover:bg-white/30 text-white px-2 py-0.5 rounded-full transition cursor-pointer"
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
                {riwayat.length === 0
                  ? "Belum ada transaksi peminjaman."
                  : `Tidak ada peminjaman dengan status ${activeFilter}.`}
                {activeFilter !== "ALL" && (
                  <div className="mt-2">
                    <button
                      onClick={() => setActiveFilter("ALL")}
                      className="text-xs text-emerald-700 underline font-semibold cursor-pointer"
                    >
                      Tampilkan Semua Peminjaman ({riwayat.length})
                    </button>
                  </div>
                )}
              </div>
            ) : (
              filteredRiwayat.map((item) => {
                const s = statusMeta[item.status] || statusMeta.Pending;
                const isSelected = item.id === current?.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left transition-colors cursor-pointer"
                    style={{
                      backgroundColor: isSelected ? C.paper : "#fff",
                    }}
                  >
                    <div className="pr-3">
                      <p className="text-sm font-semibold truncate max-w-[220px] md:max-w-xs" style={{ ...headingFont, color: C.ink }}>
                        {item.alat}
                      </p>
                      <p className="text-xs mt-0.5" style={{ ...bodyFont, color: "#8A8272" }}>
                        {item.id} · {item.tanggal}
                      </p>
                    </div>

                    <span
                      className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full flex-shrink-0"
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
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
        >
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
                  <p className="text-sm font-bold" style={{ ...headingFont, color: meta.color }}>
                    Status: {meta.label}
                  </p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ ...bodyFont, color: "#5C5548" }}>
                    {meta.note}
                  </p>
                </div>
              </div>

              {current.status === "Borrowed" && (
                <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                      <RotateCcw size={14} /> Pengembalian Alat
                    </p>
                    <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-2 py-0.5 rounded-full">
                      Bisa Kembalikan Awal
                    </span>
                  </div>

                  <p className="text-[11px] text-amber-800 mb-3 leading-relaxed">
                    Masa sewa Anda s.d <strong>{current.tanggal.split("s.d")[1] || current.tanggal}</strong>. Jika pemakaian sudah selesai, Anda dapat mengembalikan barang sekarang tanpa menunggu tanggal tenggat.
                  </p>

                  <form onSubmit={handleReturnSubmit} className="space-y-3">
                    <div className="flex items-center gap-2 bg-white p-2 rounded-lg border border-amber-200">
                      <input
                        type="checkbox"
                        id="earlyCheck"
                        checked={isEarlyReturn}
                        onChange={(e) => setIsEarlyReturn(e.target.checked)}
                        className="rounded text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                      />
                      <label htmlFor="earlyCheck" className="text-xs font-semibold text-stone-700 cursor-pointer">
                        ⚡ Kembalikan lebih awal hari ini ({new Date().toLocaleDateString("id-ID")})
                      </label>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                        Catatan Kondisi Barang (Opsional):
                      </label>
                      <textarea
                        rows={2}
                        value={catatanReturn}
                        onChange={(e) => setCatatanReturn(e.target.value)}
                        placeholder="Contoh: Dikembalikan lebih cepat, semua alat dalam kondisi lengkap & bersih."
                        className="w-full p-2 text-xs rounded-lg border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>

                    {(() => {
                      const endDateRaw = current.tanggal.split("s.d")[1]?.trim() || current.tanggal;
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);

                      const endDateObj = new Date(String(endDateRaw).replace(/-/g, "/"));
                      endDateObj.setHours(0, 0, 0, 0);

                      const isDueDate = !isNaN(endDateObj.getTime()) && today >= endDateObj;
                      const isDisabled = returning || (!isDueDate && !isEarlyReturn);

                      return (
                        <button
                          type="submit"
                          disabled={isDisabled}
                          className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold transition flex items-center justify-center gap-1.5 ${
                            isDisabled
                              ? "bg-stone-300 text-stone-500 cursor-not-allowed opacity-70"
                              : "bg-amber-700 hover:bg-amber-800 text-white cursor-pointer shadow-xs"
                          }`}
                        >
                          <RotateCcw size={14} className={returning ? "animate-spin" : ""} />
                          <span>
                            {returning
                              ? "Memproses..."
                              : !isDueDate && !isEarlyReturn
                              ? "Belum Waktunya Pengembalian"
                              : isEarlyReturn
                              ? "Konfirmasi Kembalikan Sekarang (Lebih Awal)"
                              : "Konfirmasi Pengembalian Alat"}
                          </span>
                        </button>
                      );
                    })()}
                  </form>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-6 text-gray-400 text-xs">
              Pilih transaksi untuk melihat detail.
            </div>
          )}

          <div className="flex justify-between items-center mb-3 pt-2">
            <p className="text-xs font-semibold uppercase tracking-wide" style={{ ...bodyFont, color: "#8A8272" }}>
              Tahapan Pelacakan
            </p>
            <span className="text-[10px] text-stone-500 font-medium">Klik tahapan untuk menyaring</span>
          </div>

          <div className="space-y-2.5 text-xs" style={{ ...bodyFont }}>
            {["Pending", "Approved", "Borrowed", "Returned", "Rejected"].map((step) => {
              const isCurrentStatus = current && step === current.status;
              const isSelectedFilter = activeFilter === step;
              const stepInfo = statusMeta[step];
              const count = countStatus(step);

              return (
                <button
                  key={step}
                  type="button"
                  onClick={() => {
                    if (activeFilter === step) {
                      setActiveFilter("ALL");
                    } else {
                      setActiveFilter(step);
                      const match = riwayat.find((r) => r.status === step);
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
                  <span
                    style={{
                      color: isCurrentStatus || isSelectedFilter ? C.forestDeep : "#8A8272",
                      fontWeight: isCurrentStatus || isSelectedFilter ? 700 : 500,
                    }}
                  >
                    {step}
                  </span>

                  <div className="ml-auto flex items-center gap-2">
                    <span className="text-[10px] bg-stone-100 text-stone-600 font-bold px-2 py-0.5 rounded-full border border-stone-200">
                      {count}
                    </span>
                    {isCurrentStatus && (
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${stepInfo.color}20`, color: stepInfo.color }}
                      >
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