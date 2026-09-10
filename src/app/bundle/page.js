"use client";

import { useState } from "react";
import { Sparkles, ChevronRight } from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow, GearTag, StitchDivider } from "../../components/Shared";

const paket = [
  {
    name: "Paket Camping Solo",
    items: ["Tenda Dome 2P", "Kompor Portable", "Lampu Camping", "Matras"],
    price: "Rp55.000/hari",
    save: "Hemat 18%",
  },
  {
    name: "Paket Piknik Keluarga",
    items: ["Tikar Piknik XL", "Coolbox 30L", "Set Alat Makan"],
    price: "Rp38.000/hari",
    save: "Hemat 22%",
  },
  {
    name: "Paket Grill Party",
    items: ["Kompor Portable", "Set Alat Masak", "Coolbox 30L", "Meja Lipat"],
    price: "Rp62.000/hari",
    save: "Hemat 15%",
  },
];

export default function BundlePage() {
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <SectionEyebrow
        index={4}
        total={5}
        title="Paket Hemat (Bundling)"
        desc="Penyewa memilih kombinasi alat sekaligus dengan harga lebih hemat; Admin mengelola isi paket dan sistem menyinkronkan stok tiap alat di dalamnya."
      />
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
        <div className="grid sm:grid-cols-3 gap-4">
          {paket.map((p, i) => (
            <button
              key={p.name}
              onClick={() => setSelected(i)}
              className="text-left rounded-2xl p-5 flex flex-col"
              style={{
                backgroundColor: selected === i ? C.moss : C.paper,
                border: `1px solid ${selected === i ? C.moss : C.canvasDeep}`,
              }}
            >
              <Sparkles size={18} style={{ color: selected === i ? C.amber : C.amberDeep }} />
              <p className="mt-3 font-bold text-sm leading-snug" style={{ ...headingFont, color: selected === i ? "#fff" : C.forestDeep }}>
                {p.name}
              </p>
              <p className="text-xs mt-2 flex-1" style={{ ...bodyFont, color: selected === i ? "#E4EEE0" : "#8A8272" }}>
                {p.items.length} alat termasuk
              </p>
              <div className="flex items-center justify-between mt-4">
                <span className="text-xs font-semibold" style={{ ...bodyFont, color: selected === i ? "#fff" : C.ink }}>
                  {p.price}
                </span>
                <GearTag tone={selected === i ? C.amber : C.rust}>{p.save}</GearTag>
              </div>
            </button>
          ))}
        </div>

        <div className="rounded-2xl p-6" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
          <h3 className="text-lg font-bold mb-4" style={{ ...headingFont, color: C.forestDeep }}>
            {paket[selected].name}
          </h3>
          <p className="text-xs font-semibold mb-2" style={{ ...bodyFont, color: "#8A8272" }}>
            ISI PAKET
          </p>
          <ul className="space-y-2 mb-5">
            {paket[selected].items.map((it) => (
              <li key={it} className="flex items-center gap-2 text-sm" style={{ ...bodyFont, color: C.ink }}>
                <ChevronRight size={13} style={{ color: C.moss }} />
                {it}
              </li>
            ))}
          </ul>
          <StitchDivider />
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-xs" style={{ ...bodyFont, color: "#8A8272" }}>Total sewa</p>
              <p className="text-xl font-bold" style={{ ...headingFont, color: C.forestDeep }}>
                {paket[selected].price}
              </p>
            </div>
            <GearTag tone={C.rust}>{paket[selected].save} vs satuan</GearTag>
          </div>
          <button
            className="w-full py-3 rounded-full font-semibold text-sm"
            style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep }}
          >
            Sewa Sekarang — Semua Alat
          </button>
          <p className="text-[11px] text-center mt-3" style={{ ...bodyFont, color: "#8A8272" }}>
            Satu pengajuan untuk seluruh alat di paket ini
          </p>
        </div>
      </div>
    </div>
  );
}
