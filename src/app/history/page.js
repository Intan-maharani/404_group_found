"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // <-- 1. Impor useRouter
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

function normalizeStatus(rawStatus = "", startDateStr = "", endDateStr = "") {
  const s = String(rawStatus).toLowerCase().trim();
  
  // Ambil tanggal hari ini (format YYYY-MM-DD lokal)
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

  if (s.includes("selesai") || s === "dikembalikan" || s === "returned") return "returned";
  if (s.includes("tolak") || s === "ditolak" || s === "rejected") return "rejected";
  if (s.includes("pinjam") || s === "dipinjam" || s === "borrowed") return "borrowed";

  if (s.includes("approve") || s === "disetujui" || s === "acc") {
    if (startDateStr && todayStr >= startDateStr) {
      return "borrowed";
    }
    return "approved";
  }

  return "pending";
}

export default function HistoryPage() {
  const router = useRouter(); // <-- 2. Inisialisasi router

  const [riwayat, setRiwayat] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [loading, setLoading] = useState(false);
  const [returning, setReturning] = useState(false);

  // --- STATE TAMBAHAN UNTUK MODAL FORM PENGEMBALIAN ---
  const [returnModalOpen, setReturnModalOpen] = useState(false);
  const [selectedReturnItem, setSelectedReturnItem] = useState(null);
  const [actualReturnDate, setActualReturnDate] = useState("");
  const [returnNote, setReturnNote] = useState("");
  const [isEarlyReturnChecked, setIsEarlyReturnChecked] = useState(false);

  // --- 3. CEK OTENTIKASI: JIKA TAMU BELUM LOGIN, LEMPAR KE /auth ---
  useEffect(() => {
    if (typeof window !== "undefined") {
      const sessionUserStr = localStorage.getItem("session_user");
      if (!sessionUserStr) {
        router.replace("/auth");
      }
    }
  }, [router]);

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
    if (typeof window !== "undefined") {
      const sessionUserStr = localStorage.getItem("session_user");
      if (!sessionUserStr) {
        router.replace("/auth");
        return;
      }
    }

    if (!isBackgroundFetch) setLoading(true);

    try {
      // Ambil data utama peminjaman DAN data detail borrows_details secara bersamaan
      const [resBorrows, resDetails] = await Promise.all([
        apiFetch("/borrows").catch(() => []),
        apiFetch("/borrows_details").catch(() => [])
      ]);

      const apiList = Array.isArray(resBorrows) ? resBorrows : (resBorrows?.data || []);
      const detailsList = Array.isArray(resDetails) ? resDetails : (resDetails?.data || []);

      // Buat mapping detail berdasarkan peminjaman_id / borrow_id
      const detailMap = {};
      detailsList.forEach(d => {
        const bId = d.peminjaman_id || d.borrow_id || d.id_peminjaman;
        if (bId) {
          detailMap[bId] = d.nama_item || d.item_name || d.alat || d.name;
        }
      });

      const localOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
      const localNames = JSON.parse(localStorage.getItem("borrow_item_names") || "{}");

      let currentUser = null;
      try {
        const storedUser = localStorage.getItem("session_user");
        if (storedUser) {
          currentUser = JSON.parse(storedUser);
        }
      } catch (e) {}

      const userRole = String(currentUser?.role || currentUser?.type || "").toLowerCase();
      const userEmail = String(currentUser?.email || "").toLowerCase();
      const isAdmin = userRole === "admin" || userEmail === "admin@chilltime.com";

      const mapped = apiList.map((b, idx) => {
        const displayId = String(b.id || b.uuid || b.id_peminjaman || `CT-${String(idx + 1).padStart(3, "0")}`);
        
        const startDate = b.tanggal_mulai_sewa || b.tgl_mulai_sewa || b.start_date || "Hari ini";
        const endDate = b.tanggal_selesai_sewa || b.tgl_selesai_sewa || b.end_date || "Selesai";
        
        const rawBiaya = Number(b.total_biaya || b.total_harga || b.price || 50000);
        const rawStatus = localOverrides[displayId] || b.status_peminjaman || b.status || "pending";
        
        // Prioritas nama barang: dari tabel borrows_details -> kolom database -> localStorage -> fallback
        const namaBarang = detailMap[displayId] || b.nama_item || b.alat || b.name || localNames[displayId] || `Peminjaman Alat #${idx + 1}`;
        const namaUser = b.user_nama || b.nama_user || b.username || b.user || "Penyewa";

        return {
          id: displayId,
          userId: String(b.id_user || b.user_id || ""),
          alat: namaBarang,
          peminjam: namaUser,
          tanggal: `${startDate} s.d ${endDate}`,
          startDateRaw: startDate,
          endDateRaw: endDate,
          durasi: b.total_durasi ? `${b.total_durasi} Hari` : "1 Hari",
          status: normalizeStatus(rawStatus, startDate, endDate),
          total: `Rp${rawBiaya.toLocaleString("id-ID")}`,
        };
      });

      const filteredByUser = isAdmin
        ? mapped
        : mapped.filter((item) => {
            if (!currentUser) return false;

            const currentUserId = String(currentUser.id || currentUser.uuid || "").trim();
            const itemUserId = String(item.userId || "").trim();
            const currentUserName = String(currentUser.name || currentUser.username || currentUser.email || "").toLowerCase().trim();
            const itemUserName = String(item.peminjam || "").toLowerCase().trim();
            const currentUserEmail = String(currentUser.email || "").toLowerCase().trim();
            const itemUserEmail = String(item.userEmail || item.email_user || "").toLowerCase().trim();

            if (currentUserId && itemUserId && currentUserId === itemUserId) return true;
            if (currentUserName && itemUserName && currentUserName === itemUserName) return true;
            if (currentUserEmail && itemUserEmail && currentUserEmail === itemUserEmail) return true;

            return false;
          });

      const finalResult = filteredByUser.reverse();
      setRiwayat(finalResult);
      setSelectedId((prev) => prev || finalResult[0]?.id || "");
    } catch (e) {
      console.error("Gagal mengambil data riwayat dari database:", e);
    } finally {
      if (!isBackgroundFetch) setLoading(false);
    }
  }, [router]);

  // --- FUNGSI UNTUK MEMBUKA MODAL FORM PENGEMBALIAN ---
  const handleOpenReturnModal = (item) => {
    setSelectedReturnItem(item);
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setActualReturnDate(todayStr);
    setReturnNote("");
    setIsEarlyReturnChecked(false);
    setReturnModalOpen(true);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      loadBorrows();
    }, 0);

    const intervalId = setInterval(() => loadBorrows(true), 15000);
    return () => {
      clearTimeout(timer);
      clearInterval(intervalId);
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
                Belum ada transaksi peminjaman di database.
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
                        Oleh: <strong className="text-stone-700">{item.peminjam}</strong> · {item.tanggal}
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
                Peminjam: <strong className="text-stone-700">{current.peminjam}</strong> · Periode: {current.tanggal}
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
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold text-amber-900">Form Pengembalian Dini (Early Return)</span>
                  </div>
                  
                  {/* --- KOTAK CENTANG DENGAN FORMAT TANGGAL HARI INI --- */}
                  <div className="mb-3">
                    <label className="flex items-start gap-2 cursor-pointer text-xs text-amber-900 leading-relaxed">
                      <input 
                        type="checkbox" 
                        id="earlyCheck"
                        checked={isEarlyReturnChecked}
                        onChange={(e) => setIsEarlyReturnChecked(e.target.checked)}
                        className="mt-0.5 w-4 h-4 cursor-pointer accent-amber-700"
                      />
                      <span>
                        Jika ingin mengembalikan barang lebih awal pada tanggal  ({new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}), silakan centang kotak ini.
                      </span>
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const targetId = current.id;
                      const existingOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
                      existingOverrides[targetId] = "returned";
                      localStorage.setItem("admin_status_overrides", JSON.stringify(existingOverrides));
                      
                      alert("Pengembalian berhasil dikonfirmasi!");
                      window.location.reload();
                    }}
                    disabled={!isEarlyReturnChecked} // Tombol terkunci jika belum dicentang!
                    className={`w-full py-2.5 px-3 rounded-xl text-xs font-semibold text-white shadow-xs flex items-center justify-center gap-1.5 transition-colors ${
                      isEarlyReturnChecked 
                        ? "bg-amber-700 hover:bg-amber-800 cursor-pointer" 
                        : "bg-stone-300 cursor-not-allowed"
                    }`}
                  >
                    <RotateCcw size={14} />
                    <span>Konfirmasi Pengembalian Alat</span>
                  </button>
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

      {/* --- MODAL FORM PENGEMBALIAN LEBIH CEPAT / TEPAT WAKTU --- */}
      {returnModalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center",
          alignItems: "center", zIndex: 9999
        }}>
          <div style={{
            backgroundColor: "#fff", padding: "24px", borderRadius: "16px",
            width: "420px", boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
          }}>
            <h3 style={{ marginBottom: "8px", color: "#1c281e", fontWeight: "bold", fontSize: "18px" }}>Form Pengembalian Alat</h3>
            <p style={{ fontSize: "13px", color: "#666", marginBottom: "16px" }}>
              Alat: <b>{selectedReturnItem?.alat}</b><br/>
              Jadwal Semula: {selectedReturnItem?.tanggal}
            </p>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#333" }}>
                Tanggal Pengembalian Aktual:
              </label>
              <input 
                type="date" 
                value={actualReturnDate} 
                onChange={(e) => setActualReturnDate(e.target.value)}
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "14px" }}
              />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#333" }}>
                Catatan Kondisi Alat (Opsional):
              </label>
              <textarea 
                value={returnNote} 
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="Contoh: Alat dikembalikan dalam keadaan baik."
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #ccc", height: "60px", fontSize: "13px" }}
              />
            </div>

            {/* --- KOTAK CENTANG (CHECKBOX) PENGEMBALIAN LEBIH AWAL --- */}
            <div style={{ marginBottom: "20px", backgroundColor: "#f9f6f0", padding: "12px", borderRadius: "8px", border: "1px solid #e6dec5" }}>
              <label style={{ display: "flex", alignItems: "flex-start", gap: "8px", cursor: "pointer", fontSize: "13px", color: "#333" }}>
                <input 
                  type="checkbox" 
                  checked={isEarlyReturnChecked}
                  onChange={(e) => setIsEarlyReturnChecked(e.target.checked)}
                  style={{ marginTop: "2px", width: "16px", height: "16px", cursor: "pointer" }}
                />
                <span>
                  <b>Konfirmasi Pengembalian Dini:</b> Saya ingin mengembalikan barang ini lebih awal menggunakan tanggal hari ini ({actualReturnDate}).
                </span>
              </label>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
              <button 
                onClick={() => setReturnModalOpen(false)}
                style={{ padding: "10px 16px", backgroundColor: "#e0e0e0", border: "none", borderRadius: "8px", cursor: "pointer", fontWeight: "600", fontSize: "13px" }}
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  const targetId = selectedReturnItem.id;
                  const existingOverrides = JSON.parse(localStorage.getItem("admin_status_overrides") || "{}");
                  existingOverrides[targetId] = "returned";
                  localStorage.setItem("admin_status_overrides", JSON.stringify(existingOverrides));
                  
                  setReturnModalOpen(false);
                  alert(`Pengembalian berhasil dikonfirmasi pada tanggal ${actualReturnDate}!`);
                  window.location.reload();
                }}
                disabled={!isEarlyReturnChecked}
                style={{ 
                  padding: "10px 16px", 
                  backgroundColor: isEarlyReturnChecked ? "#2e7d32" : "#ccc", 
                  color: "#fff", 
                  border: "none", 
                  borderRadius: "8px", 
                  cursor: isEarlyReturnChecked ? "pointer" : "not-allowed", 
                  fontWeight: "600", 
                  fontSize: "13px",
                  transition: "background-color 0.2s"
                }}
              >
                Konfirmasi Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}