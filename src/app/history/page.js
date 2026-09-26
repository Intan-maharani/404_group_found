"use client";

import { useState, useEffect } from "react";
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

const defaultRiwayat = [
  { id: "CT-2026-091", alat: "Tenda Dome 4P", tanggal: "12–14 Sep 2026", status: "Pending", total: "Rp90.000" },
  { id: "CT-2026-090", alat: "Coolbox 30L, Tikar Piknik", tanggal: "10–12 Sep 2026", status: "Approved", total: "Rp70.000" },
  { id: "CT-2026-088", alat: "Kompor Portable", tanggal: "05–07 Sep 2026", status: "Rejected", total: "Rp40.000" },
  { id: "CT-2026-085", alat: "Set Alat Masak Camping", tanggal: "01–03 Sep 2026", status: "Borrowed", total: "Rp30.000" },
  { id: "CT-2026-081", alat: "Lampu Camping x3", tanggal: "28–30 Agu 2026", status: "Returned", total: "Rp48.000" },
];

function normalizeStatus(rawStatus = "") {
  const s = String(rawStatus).toLowerCase();
  if (s.includes("tunggu") || s === "pending") return "Pending";
  if (s.includes("setuju") || s === "approved") return "Approved";
  if (s.includes("tolak") || s === "rejected") return "Rejected";
  if (s.includes("pinjam") || s === "borrowed") return "Borrowed";
  if (s.includes("selesai") || s === "returned") return "Returned";
  return "Pending";
}

export default function HistoryPage() {
  const [riwayat, setRiwayat] = useState(defaultRiwayat);
  const [selectedId, setSelectedId] = useState(defaultRiwayat[0].id);
  const [loading, setLoading] = useState(false);
  const [isLiveApi, setIsLiveApi] = useState(false);
const [returning, setReturning] = useState(false);
  const [isEarlyReturn, setIsEarlyReturn] = useState(true);
  const [catatanReturn, setCatatanReturn] = useState("");

<<<<<<< HEAD
  const loadBorrows = async () => {
    setLoading(true);
    try {
      const res = await apiFetch("/borrows");
=======
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

      await apiFetch(`/borrows/${current.realId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      localOverrides[current.id] = "Returned";
      localOverrides[current.realId] = "Returned";
      localStorage.setItem("admin_status_overrides", JSON.stringify(localOverrides));

      alert(isEarlyReturn ? "Berhasil mengajukan pengembalian lebih awal!" : "Pengembalian alat berhasil dikonfirmasi!");
      setCatatanReturn("");
      loadBorrows(true);
    } catch (err) {
      console.error("Gagal melakukan pengembalian:", err);
      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      localOverrides[current.id] = "Returned";
      localOverrides[current.realId] = "Returned";
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
    try {
      const res = await apiFetch("/borrows");
      let localOverrides = {};
      try {
        localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      } catch {
        localOverrides = {};
      }

>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
      if (Array.isArray(res) && res.length > 0) {
        const mapped = res.map((b, idx) => {
          const id = b.id_borrow || b.id || `CT-${String(idx + 1).padStart(3, "0")}`;
          const startDate = b.tanggal_pinjam || "Hari ini";
          const endDate = b.tanggal_kembali || "Besok";
          const totalHarga = b.total_harga ? `Rp${Number(b.total_harga).toLocaleString("id-ID")}` : "Rp0";

<<<<<<< HEAD
          return {
            id,
            alat: b.nama_item || b.alat || `Peminjaman Alat Camping (${id.slice(0, 8)})`,
            tanggal: `${startDate} s.d ${endDate}`,
            status: normalizeStatus(b.status),
            total: totalHarga,
          };
=======
  let statusRaw = localOverrides[displayId] || localOverrides[realId] || b.status_peminjaman || b.status;

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
const katalogBarang = [
  "Carrier Eiger 75L",
  "Kompor Portebel",
  "Sleeping Bag Polar",
  "Tenda Camping 4P",
  "Tiker Piknik"
];
return {
  realId,
  id: displayId,
  alat: b.nama_item || b.alat || `Peminjaman Alat Camping (${displayId})`,
  tanggal: `${startDate} s.d ${endDate}`,
  status: normalizeStatus(statusRaw),
  total: totalHarga,
};
>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
        });

        // Tampilkan transaksi terbaru di atas
        const sorted = mapped.reverse();
        setRiwayat(sorted);
        setSelectedId(sorted[0]?.id);
        setIsLiveApi(true);
      }
    } catch (err) {
      console.warn("Menggunakan data default karena backend borrows kosong atau belum login:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBorrows();
  }, []);

  const current = riwayat.find((r) => r.id === selectedId) || riwayat[0] || defaultRiwayat[0];
  const meta = statusMeta[current.status] || statusMeta.Pending;

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <SectionEyebrow
          index={3}
          total={4}
          title="Daftar & Status Peminjaman"
          desc="Pantau seluruh pengajuan sewa, tanggal pengembalian, dan konfirmasi verifikasi dari manajemen."
        />
        <button
          type="button"
          onClick={loadBorrows}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 hover:bg-stone-50 transition-colors flex-shrink-0"
          style={{ color: C.forestDeep }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Memuat..." : "Refresh Status"}</span>
        </button>
      </div>

<<<<<<< HEAD
      {isLiveApi && (
        <div className="mb-5 px-4 py-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <span className="font-medium">✅ Menampilkan data transaksi aktual dari server backend ChillTime.</span>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 uppercase">Live API</span>
        </div>
      )}

=======
      
>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.canvasDeep}` }}>
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ backgroundColor: C.forestDeep, color: C.paper }}>
            <p className="text-sm font-semibold" style={{ ...headingFont }}>
              Daftar Riwayat Peminjaman ({riwayat.length})
            </p>
            <Link
              href="/catalog"
              className="text-xs font-semibold underline flex items-center gap-1 opacity-90 hover:opacity-100"
              style={{ color: C.amber }}
            >
              + Sewa Baru
            </Link>
          </div>

          <div className="divide-y max-h-[460px] overflow-y-auto" style={{ borderColor: C.canvasDeep, backgroundColor: "#fff" }}>
            {riwayat.map((item) => {
              const s = statusMeta[item.status] || statusMeta.Pending;
              const isSelected = item.id === selectedId;

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
            })}
          </div>
        </div>

<<<<<<< HEAD
        {/* Kolom Kanan: Pelacakan Status Real-time */}
=======
        {}
>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
        <div
          className="rounded-2xl p-6"
          style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
        >
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ ...bodyFont, color: "#8A8272" }}>
            Detail Transaksi
          </p>
          <h3 className="text-xl font-bold mt-1 mb-1" style={{ ...headingFont, color: C.forestDeep }}>
            {current.alat}
          </h3>
          <p className="text-xs mb-3" style={{ ...bodyFont, color: "#8A8272" }}>
            ID: {current.id} · Periode: {current.tanggal}
          </p>

<<<<<<< HEAD
          {current.total && (
            <div className="mb-5 inline-block px-3 py-1 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-700">
              Total Biaya: <span style={{ color: C.forestDeep }} className="font-bold">{current.total}</span>
            </div>
          )}

          {/* Kotak Status Aktif */}
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
=======
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
              {current.status === "Borrowed"  && (
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
>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
          </div>

          {/* Alur Tahapan Status */}
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ ...bodyFont, color: "#8A8272" }}>
            Tahapan Pelacakan
          </p>
          <div className="space-y-2.5 text-xs" style={{ ...bodyFont }}>
            {["Pending", "Approved", "Borrowed", "Returned"].map((step) => {
              const isCurrent = step === current.status;
              const stepInfo = statusMeta[step];

              return (
                <div
                  key={step}
                  className="flex items-center gap-2.5 p-2 rounded-lg transition-all"
                  style={{
                    backgroundColor: isCurrent ? "#fff" : "transparent",
                    border: isCurrent ? `1px solid ${C.canvasDeep}` : "1px solid transparent",
                  }}
                >
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: isCurrent ? stepInfo.color : "#C5BCAB" }}
                  />
                  <span
                    style={{
                      color: isCurrent ? C.forestDeep : "#8A8272",
                      fontWeight: isCurrent ? 700 : 500,
                    }}
                  >
                    {step}
                  </span>
                  {isCurrent && (
                    <span
                      className="text-[10px] ml-auto font-semibold px-2 py-0.5 rounded-full"
                      style={{ backgroundColor: `${stepInfo.color}20`, color: stepInfo.color }}
                    >
                      Status Sekarang
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}