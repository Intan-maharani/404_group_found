"use client";

import { ClipboardList, CheckCircle2, XCircle, Backpack, Clock3, Users, ShieldCheck } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";

const approvalQueue = [
  { id: "CT-2026-091", user: "Raka A.", alat: "Tenda Dome 4P", tanggal: "12–14 Sep" },
  { id: "CT-2026-093", user: "Nadia S.", alat: "Coolbox 30L x2", tanggal: "13–15 Sep" },
  { id: "CT-2026-094", user: "Fajar P.", alat: "Set Alat Masak", tanggal: "14–16 Sep" },
];

export default function AdminPage() {
  return (
    <div>
      <SectionEyebrow
        index={5}
        total={5}
        title="Approval & Manajemen Admin"
        desc="Manajemen memantau ringkasan operasional, menyetujui atau menolak pengajuan, serta mengelola inventaris dan pengembalian alat."
      />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Alat sedang dipinjam", value: "27", icon: Backpack, tone: C.sky },
          { label: "Persetujuan tertunda", value: "3", icon: Clock3, tone: C.amberDeep },
          { label: "Total penyewa aktif", value: "142", icon: Users, tone: C.moss },
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
        <div className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${C.canvasDeep}` }}>
          <div className="px-5 py-3 flex items-center gap-2" style={{ backgroundColor: C.forestDeep }}>
            <ClipboardList size={15} style={{ color: C.amber }} />
            <span className="text-sm font-semibold" style={{ ...bodyFont, color: C.paper }}>
              Antrean Persetujuan
            </span>
          </div>
          {approvalQueue.map((q, i) => (
            <div
              key={q.id}
              className="flex items-center justify-between px-5 py-4"
              style={{
                backgroundColor: "#fff",
                borderBottom: i < approvalQueue.length - 1 ? `1px solid ${C.canvasDeep}` : "none",
              }}
            >
              <div>
                <p className="text-sm font-semibold" style={{ ...headingFont, color: C.ink }}>
                  {q.alat}
                </p>
                <p className="text-xs mt-0.5" style={{ ...bodyFont, color: "#8A8272" }}>
                  {q.user} · {q.tanggal} · {q.id}
                </p>
              </div>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${C.moss}1A` }}>
                  <CheckCircle2 size={15} style={{ color: C.moss }} />
                </button>
                <button className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${C.rust}1A` }}>
                  <XCircle size={15} style={{ color: C.rust }} />
                </button>
              </div>
            </div>
          ))}
        </div>

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
              <label key={c} className="flex items-center gap-2 text-sm" style={{ ...bodyFont, color: C.ink }}>
                <input type="checkbox" defaultChecked readOnly style={{ accentColor: C.moss }} />
                {c}
              </label>
            ))}
          </div>
          <button
            className="w-full py-2.5 rounded-full font-semibold text-sm"
            style={{ ...bodyFont, backgroundColor: C.forest, color: C.paper }}
          >
            Konfirmasi Pengembalian
          </button>
        </div>
      </div>
    </div>
  );
}
