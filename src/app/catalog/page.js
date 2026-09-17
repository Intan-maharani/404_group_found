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
  Sparkles,
  ChevronRight,
} from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow, GearTag, StitchDivider } from "../../components/Shared";

const alatList = [
  { name: "Coolbox 30L", icon: PackageSearch, stock: 6, price: "Rp25.000/hari" },
  { name: "Tikar Piknik", icon: LayoutGrid, stock: 12, price: "Rp10.000/hari" },
  { name: "Kompor Portable", icon: Flame, stock: 4, price: "Rp20.000/hari" },
  { name: "Tenda Dome 4P", icon: Tent, stock: 3, price: "Rp45.000/hari" },
  { name: "Lampu Camping", icon: Lamp, stock: 9, price: "Rp8.000/hari" },
  { name: "Set Alat Masak", icon: Utensils, stock: 5, price: "Rp15.000/hari" },
];

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

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("satuan");
  const [searchQuery, setSearchQuery] = useState("");
  
  const [qty, setQty] = useState(1);
  const [selectedAlatIndex, setSelectedAlatIndex] = useState(0);

  const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);

  const filteredAlat = alatList.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPaket = paket.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.items.some((it) => it.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const currentAlat = filteredAlat[selectedAlatIndex] || filteredAlat[0];
  const currentPaket = filteredPaket[selectedBundleIndex] || filteredPaket[0];

  return (
    <div>
      <SectionEyebrow
        index={2}
        total={4}
        title="Katalog Peminjaman"
        desc="Penyewa dapat menelusuri alat satuan maupun paket hemat camping & piknik dengan pengecekan stok otomatis."
      />

      {/* Segmented Tab Switcher */}
      <div
        className="flex items-center gap-2 p-1.5 rounded-2xl mb-6 w-fit"
        style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("satuan");
            setSearchQuery("");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: activeTab === "satuan" ? C.forestDeep : "transparent",
            color: activeTab === "satuan" ? C.paper : C.ink,
          }}
        >
          <PackageSearch size={16} style={{ color: activeTab === "satuan" ? C.amber : C.moss }} />
          Alat Satuan
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("bundle");
            setSearchQuery("");
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: activeTab === "bundle" ? C.forestDeep : "transparent",
            color: activeTab === "bundle" ? C.paper : C.ink,
          }}
        >
          <Sparkles size={16} style={{ color: activeTab === "bundle" ? C.amber : C.amberDeep }} />
          Paket Bundle
          <span
            className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
            style={{
              backgroundColor: activeTab === "bundle" ? C.amber : `${C.amber}33`,
              color: activeTab === "bundle" ? C.forestDeep : C.amberDeep,
            }}
          >
            Hemat
          </span>
        </button>
      </div>

      {/* Konten Tab Alat Satuan */}
      {activeTab === "satuan" && (
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8">
          <div>
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-5"
              style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
            >
              <Search size={16} style={{ color: "#8A8272" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedAlatIndex(0);
                }}
                placeholder="Cari alat camping atau piknik..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8A8272]"
                style={{ ...bodyFont, color: C.ink }}
              />
            </div>

            {filteredAlat.length === 0 ? (
              <div
                className="p-8 text-center rounded-2xl"
                style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}`, color: "#8A8272" }}
              >
                <p className="text-sm">Tidak ada alat yang cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 gap-3">
                {filteredAlat.map((a, i) => (
                  <button
                    key={a.name}
                    onClick={() => {
                      setSelectedAlatIndex(i);
                      setQty(1);
                    }}
                    className="text-left rounded-2xl p-4 transition-all cursor-pointer"
                    style={{
                      backgroundColor: currentAlat?.name === a.name ? C.forestDeep : C.paper,
                      border: `1px solid ${currentAlat?.name === a.name ? C.forestDeep : C.canvasDeep}`,
                    }}
                  >
                    <a.icon size={22} style={{ color: currentAlat?.name === a.name ? C.amber : C.moss }} />
                    <p
                      className="mt-3 text-sm font-semibold"
                      style={{ ...headingFont, color: currentAlat?.name === a.name ? C.paper : C.ink }}
                    >
                      {a.name}
                    </p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span
                        className="text-xs"
                        style={{ ...bodyFont, color: currentAlat?.name === a.name ? "#CFE0D2" : "#8A8272" }}
                      >
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
            )}
          </div>

          {/* Form Pengajuan Alat Satuan */}
          {currentAlat && (
            <div className="rounded-2xl p-6 h-fit" style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}>
              <h3 className="text-lg font-bold mb-1" style={{ ...headingFont, color: C.forestDeep }}>
                Form Pengajuan
              </h3>
              <p className="text-xs mb-5" style={{ ...bodyFont, color: "#8A8272" }}>
                {currentAlat.name} dipilih
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
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                      style={{ backgroundColor: C.canvas }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center" style={{ ...bodyFont }}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(currentAlat.stock, qty + 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
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
                type="button"
                className="w-full mt-6 py-3 rounded-full font-semibold text-sm cursor-pointer"
                style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep }}
              >
                Kirim Pengajuan
              </button>
            </div>
          )}
        </div>
      )}

      {/* Konten Tab Paket Bundle */}
      {activeTab === "bundle" && (
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-start">
          <div className="flex flex-col">
            <div
              className="flex items-center gap-2 px-4 py-2.5 rounded-full mb-5"
              style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
            >
              <Search size={16} style={{ color: "#8A8272" }} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedBundleIndex(0);
                }}
                placeholder="Cari paket bundle hemat..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8A8272]"
                style={{ ...bodyFont, color: C.ink }}
              />
            </div>

            {filteredPaket.length === 0 ? (
              <div
                className="p-8 text-center rounded-2xl"
                style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}`, color: "#8A8272" }}
              >
                <p className="text-sm">Tidak ada paket yang cocok dengan pencarian.</p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-3 gap-4">
                {filteredPaket.map((p, i) => {
                  const isSelected = currentPaket?.name === p.name;
                  return (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => setSelectedBundleIndex(i)}
                      className="text-left rounded-2xl p-5 flex flex-col justify-between transition-all cursor-pointer min-h-[310px]"
                      style={{
                        backgroundColor: isSelected ? C.moss : C.paper,
                        border: `1px solid ${isSelected ? C.moss : C.canvasDeep}`,
                      }}
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <Sparkles size={18} style={{ color: isSelected ? C.amber : C.amberDeep }} />
                          <GearTag tone={isSelected ? C.amber : C.rust}>{p.save}</GearTag>
                        </div>

                        <p
                          className="mt-3 font-bold text-sm leading-snug"
                          style={{ ...headingFont, color: isSelected ? "#fff" : C.forestDeep }}
                        >
                          {p.name}
                        </p>
                        <p
                          className="text-xs mt-1 mb-3"
                          style={{ ...bodyFont, color: isSelected ? "#E4EEE0" : "#8A8272" }}
                        >
                          {p.items.length} alat termasuk:
                        </p>

                        <div className="space-y-1.5">
                          {p.items.map((it) => (
                            <div
                              key={it}
                              className="flex items-center gap-1.5 text-xs"
                              style={{ ...bodyFont, color: isSelected ? "#F3F7F2" : "#5C5548" }}
                            >
                              <ChevronRight size={12} style={{ color: isSelected ? C.amber : C.moss, flexShrink: 0 }} />
                              <span className="truncate">{it}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div
                        className="pt-3 mt-4 border-t flex flex-col items-start gap-1"
                        style={{ borderColor: isSelected ? "rgba(255,255,255,0.18)" : C.canvasDeep }}
                      >
                        <span
                          className="text-[11px]"
                          style={{ ...bodyFont, color: isSelected ? "#CFE0D2" : "#8A8272" }}
                        >
                          Harga sewa
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ ...headingFont, color: isSelected ? "#fff" : C.forestDeep }}
                        >
                          {p.price}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Banner info tambahan agar area bawah tidak kosong */}
            <div
              className="mt-5 p-4 rounded-2xl flex items-center justify-between gap-4"
              style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ backgroundColor: `${C.moss}1F` }}
                >
                  <CheckCircle2 size={18} style={{ color: C.moss }} />
                </div>
                <div>
                  <p className="text-xs font-bold" style={{ ...headingFont, color: C.forestDeep }}>
                    Kombinasi Praktis & Siap Pakai
                  </p>
                  <p className="text-[11px] leading-relaxed" style={{ ...bodyFont, color: "#8A8272" }}>
                    Semua alat dalam paket telah diperiksa kondisinya dan siap digunakan bersama rombongan Anda.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Detail & Pengajuan Paket */}
          {currentPaket && (
            <div
              className="rounded-2xl p-6 h-fit"
              style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
            >
              <h3 className="text-lg font-bold mb-1" style={{ ...headingFont, color: C.forestDeep }}>
                Form Pengajuan Paket
              </h3>
              <p className="text-xs mb-4" style={{ ...bodyFont, color: "#8A8272" }}>
                {currentPaket.name} dipilih
              </p>

              <p className="text-xs font-semibold mb-2" style={{ ...bodyFont, color: "#8A8272" }}>
                ISI PERLENGKAPAN PAKET
              </p>
              <ul className="space-y-2 mb-5">
                {currentPaket.items.map((it) => (
                  <li key={it} className="flex items-center gap-2 text-sm" style={{ ...bodyFont, color: C.ink }}>
                    <ChevronRight size={13} style={{ color: C.moss }} />
                    {it}
                  </li>
                ))}
              </ul>

              {/* Tanggal Sewa Paket */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                    <Calendar size={12} /> Tgl mulai sewa
                  </label>
                  <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#fff", border: `1px solid ${C.canvasDeep}` }}>
                    12 Sep 2026
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                    <Calendar size={12} /> Tgl sewa kembali
                  </label>
                  <div className="px-3 py-2 rounded-lg text-sm" style={{ backgroundColor: "#fff", border: `1px solid ${C.canvasDeep}` }}>
                    14 Sep 2026
                  </div>
                </div>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium mb-5"
                style={{ backgroundColor: `${C.moss}18`, color: C.moss }}
              >
                <CheckCircle2 size={14} />
                Seluruh alat dalam paket tersedia untuk tanggal ini
              </div>

              <StitchDivider />
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs" style={{ ...bodyFont, color: "#8A8272" }}>Total sewa</p>
                  <p className="text-xl font-bold" style={{ ...headingFont, color: C.forestDeep }}>
                    {currentPaket.price}
                  </p>
                </div>
                <GearTag tone={C.rust}>{currentPaket.save} vs satuan</GearTag>
              </div>
              <button
                type="button"
                className="w-full py-3 rounded-full font-semibold text-sm cursor-pointer"
                style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep }}
              >
                Sewa Sekarang — Semua Alat
              </button>
              <p className="text-[11px] text-center mt-3" style={{ ...bodyFont, color: "#8A8272" }}>
                Satu pengajuan untuk seluruh alat di paket ini
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
