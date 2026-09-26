"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  CheckCircle2,
  XCircle,
  Backpack,
  Clock3,
  Users,
  ShieldCheck,
  RefreshCw,
  Loader2,
  Check,
} from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";
import { apiFetch } from "../../lib/api";

export default function AdminPage() {
  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [bannerMsg, setBannerMsg] = useState("");
  const [returnConfirmed, setReturnConfirmed] = useState(false);
  const [selectedQueue, setSelectedQueue] = useState(null);

  // Statistik
  const [stats, setStats] = useState({
    dipinjam: 0,
    menunggu: 0,
    totalPenyewa: 0,
  });

const loadAdminData = async () => {
  setLoading(true);

  try {
    // Ambil semua data yang diperlukan dari API
    const [borrows, borrowDetails, items, users] = await Promise.all([
      apiFetch("/borrows"),
      apiFetch("/borrows_details"),
      apiFetch("/items"),
      apiFetch("/users"),
    ]);

    // =========================
    // 1. FILTER PEMINJAMAN PENDING
    // =========================
    const pending = Array.isArray(borrows)
      ? borrows.filter(
          (b) => b.status_peminjaman === "pending"
        )
      : [];

    // =========================
    // 2. PEMINJAMAN YANG SEDANG DIPINJAM
    // =========================
    const activeBorrowed = Array.isArray(borrows)
      ? borrows.filter(
          (b) => b.status_peminjaman === "borrowed"
        )
      : [];

    // =========================
    // 3. BUAT DATA ANTREAN
    // =========================
    const mappedPending = pending.map((b) => {
      // Cari semua detail barang untuk peminjaman ini
      const details = Array.isArray(borrowDetails)
        ? borrowDetails.filter(
            (d) => d.id_peminjaman === b.id_peminjaman
          )
        : [];

      // Cari nama barang
      const namaAlat = details
        .map((detail) => {
          const item = Array.isArray(items)
            ? items.find(
                (i) => i.id_item === detail.id_item
              )
            : null;

          if (item) {
            return detail.jumlah_pinjam > 1
              ? `${item.nama_item} x${detail.jumlah_pinjam}`
              : item.nama_item;
          }

          return null;
        })
        .filter(Boolean)
        .join(", ");

      // Cari data user berdasarkan id_user
      const user = Array.isArray(users)
        ? users.find(
            (u) => u.id_user === b.id_user
          )
        : null;

      return {
      id: b.id_peminjaman,

      user: user?.nama_lengkap || "Nama tidak tersedia",

      email: user?.email || "Email tidak tersedia",

      phone: "Nomor HP tidak tersedia",

      alat: namaAlat || "Barang tidak tersedia",

      jumlah: details.reduce(
        (total, detail) =>
          total + Number(detail.jumlah_pinjam || 0),
        0
      ),

      tanggal: `${b.tanggal_mulai_sewa} – ${b.tanggal_selesai_sewa}`,

      totalBiaya: b.total_biaya || 0,

      status: b.status_peminjaman,
    };
    });

    // Masukkan data asli ke antrean
    setQueue(mappedPending);

    // =========================
    // 4. UPDATE STATISTIK
    // =========================
    setStats({
      dipinjam: activeBorrowed.length,
      menunggu: pending.length,
      totalPenyewa: Array.isArray(users)
        ? users.length
        : 0,
    });

  } catch (err) {
    console.error("Gagal mengambil data admin:", err);
  } finally {
    setLoading(false);
  }
};


  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDecision = async (id, status) => {
    setActionLoading(id);
    setBannerMsg("");

    try {
      await apiFetch(`/borrows/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status_peminjaman: status,
          alasan_penolakan:
            status === "rejected"
              ? "Pengajuan ditolak oleh admin"
              : "",
        }),
      });

      setQueue((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setStats((prev) => ({
        ...prev,
        menunggu: Math.max(0, prev.menunggu - 1),
      }));

      setBannerMsg(
        `Peminjaman ID: ${id} berhasil di-${
          status === "approved" ? "setujui" : "tolak"
        }!`
      );

    } catch (err) {
      console.error("Gagal mengubah status peminjaman:", err);

      setBannerMsg(
        `Gagal mengubah status peminjaman ID: ${id}.`
      );
    } finally {
      setActionLoading(null);
    }
  };
  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <SectionEyebrow
          index={4}
          total={4}
          title="Approval & Manajemen Admin"
          desc="Manajemen memantau ringkasan operasional, menyetujui atau menolak pengajuan, serta mengelola inventaris dan pengembalian alat."
        />
        <button
          type="button"
          onClick={loadAdminData}
          disabled={loading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 hover:bg-stone-50 transition-colors flex-shrink-0"
          style={{ color: C.forestDeep }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span>{loading ? "Memuat..." : "Refresh Data"}</span>
        </button>
      </div>

      {bannerMsg && (
        <div className="mb-6 p-4 rounded-xl flex items-center justify-between gap-3 text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{bannerMsg}</span>
          </div>
          <button type="button" onClick={() => setBannerMsg("")} className="cursor-pointer text-emerald-900 font-bold">
            Tutup
          </button>
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Alat sedang dipinjam", value: String(stats.dipinjam), icon: Backpack, tone: C.sky },
          { label: "Persetujuan tertunda", value: String(stats.menunggu), icon: Clock3, tone: C.amberDeep },
          { label: "Total penyewa aktif", value: String(stats.totalPenyewa), icon: Users, tone: C.moss },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
            <s.icon size={18} style={{ color: s.tone }} />
            <p className="text-2xl font-bold mt-3" style={{ ...headingFont, color: C.forestDeep }}>
              {s.value}
            </p>
            <p className="text-xs mt-1" style={{ ...bodyFont, color: "#8A8272" }}>
              {s.label}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Antrean Approval */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.canvasDeep}` }}>
          <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: C.forestDeep }}>
            <div className="flex items-center gap-2">
              <ClipboardList size={15} style={{ color: C.amber }} />
              <span className="text-sm font-semibold" style={{ ...bodyFont, color: C.paper }}>
                Antrean Persetujuan ({queue.length})
              </span>
            </div>
          </div>

          {queue.length === 0 ? (
            <div className="p-8 text-center bg-white">
              <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-600" />
              <p className="text-sm font-bold text-stone-700">Semua pengajuan telah diproses!</p>
              <p className="text-xs text-stone-500 mt-1">Tidak ada antrean tertunda saat ini.</p>
            </div>
          ) : (
            <div className="divide-y divide-stone-100 bg-white">
              {queue.map((q) => (
                <div
              key={q.id}
              onClick={() => setSelectedQueue(q)}
              className="flex items-center justify-between px-5 py-4 hover:bg-stone-50 transition-colors cursor-pointer"
              >
                  <div className="pr-3">
                    <p className="text-sm font-semibold hover:underline" style={{ ...headingFont, color: C.ink }}>
                      {q.alat}
                    </p>
                    <p className="text-xs mt-0.5" style={{ ...bodyFont, color: "#8A8272" }}>
                      {q.user} · {q.tanggal} · <span className="font-mono">{q.id}</span>
                    </p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      type="button"
                      disabled={actionLoading === q.id}
                      onClick={(e) => {
                      e.stopPropagation();
                      handleDecision(q.id, "approved");
                      }}
                      title="Setujui Peminjaman"
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: `${C.moss}1A` }}
                    >
                      {actionLoading === q.id ? (
                        <Loader2 size={14} className="animate-spin text-stone-600" />
                      ) : (
                        <CheckCircle2 size={16} style={{ color: C.moss }} />
                      )}
                    </button>
                    <button
                      type="button"
                      disabled={actionLoading === q.id}
                      onClick={(e) => {e.stopPropagation();
                      handleDecision(q.id, "rejected");}}
                      title="Tolak Peminjaman"
                      className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-transform hover:scale-105"
                      style={{ backgroundColor: `${C.rust}1A` }}
                    >
                      {actionLoading === q.id ? (
                        <Loader2 size={14} className="animate-spin text-stone-600" />
                      ) : (
                        <XCircle size={16} style={{ color: C.rust }} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Verifikasi Pengembalian */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>

          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} style={{ color: C.moss }} />
            <p className="text-sm font-bold" style={{ ...headingFont, color: C.forestDeep }}>
              Verifikasi Pengembalian
            </p>
          </div>
          <p className="text-xs mb-4" style={{ ...bodyFont, color: "#8A8272" }}>
            CT-2026-085 · Set Alat Masak · dikembalikan 10 Sep
          </p>

          <div className="space-y-2 mb-5">
            {["Kondisi lengkap", "Tidak ada kerusakan", "Tepat waktu"].map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm cursor-pointer select-none" style={{ ...bodyFont, color: C.ink }}>
                <input type="checkbox" defaultChecked style={{ accentColor: C.moss }} />
                {c}
              </label>
            ))}
          </div>

          <button
            type="button"
            disabled={returnConfirmed}
            onClick={() => {
              setReturnConfirmed(true);
              setBannerMsg("Pengembalian alat CT-2026-085 berhasil diverifikasi & stok dikembalikan.");
            }}
            className="w-full py-2.5 rounded-full font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-colors"
            style={{
              ...bodyFont,
              backgroundColor: returnConfirmed ? `${C.moss}26` : C.forest,
              color: returnConfirmed ? C.moss : C.paper,
            }}
          >
            {returnConfirmed ? (
              <>
                <Check size={16} /> Pengembalian Telah Dikonfirmasi
              </>
            ) : (
              "Konfirmasi Pengembalian"
            )}
          </button>
        </div>
      </div>
      {/* POPUP DETAIL PENYEWA */}
      {selectedQueue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div
            className="w-full max-w-md rounded-2xl p-6"
            style={{
              backgroundColor: C.paper,
              border: `1px solid ${C.canvasDeep}`,
            }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <p
                  className="text-lg font-bold"
                  style={{ ...headingFont, color: C.forestDeep }}
                >
                  Detail Peminjaman
                </p>

                <p
                  className="text-xs mt-1"
                  style={{ ...bodyFont, color: "#8A8272" }}
                >
                  {selectedQueue.id}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedQueue(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-stone-100"
              >
                <XCircle size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-stone-500">Nama Penyewa</p>
                <p className="text-sm font-semibold">
                  {selectedQueue.user}
                </p>
              </div>

              <div>
                <p className="text-sm font-semibold">
                {selectedQueue.phone}
              </p>
              </div>

              <div>
                <p className="text-sm font-semibold">
               {selectedQueue.email}
              </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">Alat</p>
                <p className="text-sm font-semibold">
                  {selectedQueue.alat}
                </p>
              </div>

              <div>
                 <p className="text-xs text-stone-500">Jumlah</p>
                <p className="text-sm font-semibold">
                  {selectedQueue.jumlah}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">
                  Tanggal Peminjaman
                </p>
                <p className="text-sm font-semibold">
                  {selectedQueue.tanggal}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">
                  Total Biaya
                </p>

                <p className="text-sm font-semibold">
                  Rp{" "}
                  {Number(selectedQueue.totalBiaya).toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <p className="text-xs text-stone-500">Status</p>
                <p className="text-sm font-semibold text-amber-600">
                  Menunggu Persetujuan
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedQueue(null)}
              className="w-full mt-6 py-2.5 rounded-full font-semibold text-sm"
              style={{
                backgroundColor: C.forest,
                color: C.paper,
              }}
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}