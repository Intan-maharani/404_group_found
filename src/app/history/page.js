"use client";

import { useState } from "react";
import { Clock3, CheckCircle2, XCircle, Backpack, RotateCcw } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";

// 5 Status Peminjaman sesuai deskripsi README Nomor 3
const statusMeta = {
  Pending: { label: "Pending", color: C.amberDeep, icon: Clock3, note: "Menunggu persetujuan manajemen" },
  Approved: { label: "Approved", color: C.moss, icon: CheckCircle2, note: "Pengajuan disetujui, siap diambil" },
  Rejected: { label: "Rejected", color: C.rust, icon: XCircle, note: "Pengajuan ditolak manajemen" },
  Borrowed: { label: "Borrowed", color: C.sky, icon: Backpack, note: "Alat sedang dibawa penyewa" },
  Returned: { label: "Returned", color: "#7B8A6E", icon: RotateCcw, note: "Alat sudah dikembalikan & diverifikasi" },
};

// Data riwayat peminjaman awal
const riwayatAwal = [
  { id: "CT-2026-091", alat: "Tenda Dome 4P", tanggal: "12–14 Sep 2026", status: "Pending" },
  { id: "CT-2026-090", alat: "Coolbox 30L, Tikar Piknik", tanggal: "10–12 Sep 2026", status: "Approved" },
  { id: "CT-2026-088", alat: "Kompor Portable", tanggal: "05–07 Sep 2026", status: "Rejected" },
  { id: "CT-2026-085", alat: "Set Alat Masak Camping", tanggal: "01–03 Sep 2026", status: "Borrowed" },
  { id: "CT-2026-081", alat: "Lampu Camping x3", tanggal: "28–30 Agu 2026", status: "Returned" },
];

export default function HistoryPage() {
  const [selectedId, setSelectedId] = useState(riwayatAwal[0].id);
  const current = riwayatAwal.find((r) => r.id === selectedId) || riwayatAwal[0];
  const meta = statusMeta[current.status];

  return (
    <div>
      <SectionEyebrow
        index={3}
        total={5}
        title="Daftar & Status Peminjaman"
        desc="Penyewa memantau riwayat pengajuan peminjaman alat camping/piknik serta melacak status peminjaman secara real-time."
      />

      <div className="grid lg:grid-cols-[1.3fr_1fr] gap-6 items-start">
        {/* Kolom Kiri: Daftar Riwayat Transaksi */}
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.canvasDeep}` }}>
          <div className="px-5 py-3.5" style={{ backgroundColor: C.forestDeep, color: C.paper }}>
            <p className="text-sm font-semibold" style={{ ...headingFont }}>
              Daftar Riwayat Peminjaman
            </p>
          </div>

          <div className="divide-y" style={{ borderColor: C.canvasDeep, backgroundColor: "#fff" }}>
            {riwayatAwal.map((item) => {
              const s = statusMeta[item.status];
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
                  <div>
                    <p className="text-sm font-semibold" style={{ ...headingFont, color: C.ink }}>
                      {item.alat}
                    </p>
                    <p className="text-xs mt-0.5" style={{ ...bodyFont, color: "#8A8272" }}>
                      {item.id} · {item.tanggal}
                    </p>
                  </div>

                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
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

        {/* Kolom Kanan: Pelacakan Status Real-time */}
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
          <p className="text-xs mb-5" style={{ ...bodyFont, color: "#8A8272" }}>
            ID: {current.id} · Periode: {current.tanggal}
          </p>

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
          </div>

          {/* Alur Tahapan Status */}
          <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ ...bodyFont, color: "#8A8272" }}>
            Pelacakan Status Pengajuan
          </p>
          <div className="space-y-2.5 text-xs" style={{ ...bodyFont }}>
            {["Pending", "Approved", "Borrowed", "Returned"].map((step) => {
              const isCurrent = step === current.status;
              const stepInfo = statusMeta[step];

              return (
                <div
                  key={step}
                  className="flex items-center gap-2.5 p-2 rounded-lg"
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