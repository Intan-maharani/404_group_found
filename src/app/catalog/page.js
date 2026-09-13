"use client";

import { useState } from "react";
import {
  PackageSearch,
  LayoutGrid,
  Flame,
  Tent,
  Lamp,
  Utensils,
  Search,
  Calendar,
  Hash,
  CheckCircle2,
  Plus,
  Minus,
} from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow } from "../../components/Shared";

const alatList = [
  { name: "Coolbox 30L", icon: PackageSearch, stock: 6, price: "Rp25.000/hari" },
  { name: "Tikar Piknik", icon: LayoutGrid, stock: 12, price: "Rp10.000/hari" },
  { name: "Kompor Portable", icon: Flame, stock: 4, price: "Rp20.000/hari" },
  { name: "Tenda Dome 4P", icon: Tent, stock: 3, price: "Rp45.000/hari" },
  { name: "Lampu Camping", icon: Lamp, stock: 9, price: "Rp8.000/hari" },
  { name: "Set Alat Masak", icon: Utensils, stock: 5, price: "Rp15.000/hari" },
];

export default function CatalogPage() {
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState(0);

  return (
    <div>
      <SectionEyebrow
        index={2}
        total={5}
        title="Katalog & Pengajuan Peminjaman"
        desc="Penyewa menelusuri alat yang tersedia, memilih tanggal, dan sistem otomatis memvalidasi stok sebelum pengajuan dikirim."
      />
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
        <div>
          <div
            className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-5"
            style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
          >
            <Search size={16} style={{ color: "#8A8272" }} />
            <span className="text-sm" style={{ ...bodyFont, color: "#8A8272" }}>
              Cari alat camping atau piknik...
            </span>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {alatList.map((a, i) => (
              <button
                key={a.name}
                onClick={() => setSelected(i)}
                className="text-left rounded-2xl p-4 transition-all"
                style={{
                  backgroundColor: selected === i ? C.forestDeep : C.paper,
                  border: `1px solid ${selected === i ? C.forestDeep : C.canvasDeep}`,
                }}
              >
                <a.icon size={22} style={{ color: selected === i ? C.amber : C.moss }} />
                <p className="mt-3 text-sm font-semibold" style={{ ...headingFont, color: selected === i ? C.paper : C.ink }}>
                  {a.name}
                </p>
                <div className="flex items-center justify-between mt-1.5">
                  <span className="text-xs" style={{ ...bodyFont, color: selected === i ? "#CFE0D2" : "#8A8272" }}>
                    {a.price}
                  </span>
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: a.stock > 4 ? `${C.moss}22` : `${C.rust}22`,
                      color: a.stock > 4 ? C.moss : C.rust,
                    }}
                  >
                    Stok {a.stock}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl p-6 h-fit" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
          <h3 className="text-lg font-bold mb-1" style={{ ...headingFont, color: C.forestDeep }}>
            Form Pengajuan
          </h3>
          <p className="text-xs mb-5" style={{ ...bodyFont, color: "#8A8272" }}>
            {alatList[selected].name} dipilih
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                  <Calendar size={12} /> Tgl mulai
                </label>
                <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#fff", border: `1px solid ${C.canvasDeep}` }}>
                  12 Sep 2026
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                  <Calendar size={12} /> Tgl kembali
                </label>
                <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#fff", border: `1px solid ${C.canvasDeep}` }}>
                  14 Sep 2026
                </div>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                <Hash size={12} /> Jumlah alat
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.canvas }}
                >
                  <Minus size={14} />
                </button>
                <span className="text-sm font-semibold w-6 text-center" style={{ ...bodyFont }}>
                  {qty}
                </span>
                <button
                  onClick={() => setQty(Math.min(alatList[selected].stock, qty + 1))}
                  className="w-9 h-9 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: C.canvas }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium"
              style={{ backgroundColor: `${C.moss}18`, color: C.moss }}
            >
              <CheckCircle2 size={14} />
              Stok tersedia untuk tanggal yang dipilih
            </div>
          </div>

          <button
            className="w-full mt-6 py-3 rounded-full font-semibold text-sm"
            style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep }}
          >
            Kirim Pengajuan
          </button>
        </div>
      </div>
    </div>
  );
}
