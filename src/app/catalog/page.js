"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  Plus,
  Minus,
  Sparkles,
  ChevronRight,
  Loader2,
  RefreshCw,
  ArrowRight,
} from "lucide-react";
import { C, headingFont, bodyFont } from "../../lib/tokens";
import { SectionEyebrow, GearTag, StitchDivider } from "../../components/Shared";
import { apiFetch } from "../../lib/api";

const initialAlatList = [
  { id_item: "coolbox-30l", name: "Coolbox 30L", icon: PackageSearch, stock: 6, price: "Rp25.000/hari", rawPrice: 25000 },
  { id_item: "tikar-piknik", name: "Tikar Piknik", icon: LayoutGrid, stock: 12, price: "Rp10.000/hari", rawPrice: 10000 },
  { id_item: "kompor-portable", name: "Kompor Portable", icon: Flame, stock: 4, price: "Rp20.000/hari", rawPrice: 20000 },
  { id_item: "tenda-dome-4p", name: "Tenda Dome 4P", icon: Tent, stock: 3, price: "Rp45.000/hari", rawPrice: 45000 },
  { id_item: "lampu-camping", name: "Lampu Camping", icon: Lamp, stock: 9, price: "Rp8.000/hari", rawPrice: 8000 },
  { id_item: "set-alat-masak", name: "Set Alat Masak", icon: Utensils, stock: 5, price: "Rp15.000/hari", rawPrice: 15000 },
];

const initialPaket = [
  {
    id_package: "pkg-solo",
    name: "Paket Camping Solo",
    items: ["Tenda Dome 2P", "Kompor Portable", "Lampu Camping", "Matras"],
    price: "Rp55.000/hari",
    rawPrice: 55000,
    save: "Hemat 18%",
  },
  {
    id_package: "pkg-family",
    name: "Paket Piknik Keluarga",
    items: ["Tikar Piknik XL", "Coolbox 30L", "Set Alat Makan"],
    price: "Rp38.000/hari",
    rawPrice: 38000,
    save: "Hemat 22%",
  },
  {
<<<<<<< HEAD
    id_package: "pkg-grill",
    name: "Paket Grill Party",
    items: ["Kompor Portable", "Set Alat Masak", "Coolbox 30L", "Meja Lipat"],
    price: "Rp62.000/hari",
    rawPrice: 62000,
    save: "Hemat 15%",
=======
    id: "s3",
    name: "Kompor Camping Portable",
    category: "Satuan",
    pricePerDay: 12000,
    available: 15,
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400",
    description: "Kompor Mawar Windproof berukuran praktis.",
  },
  {
    id: "s4",
    name: "Nesting Cooking Set (DS-308)",
    category: "Satuan",
    pricePerDay: 15000,
    available: 12,
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400",
    description: "Panci dan teko aluminium ringan 3-in-1.",
  },
  {
    id: "s5",
    name: "Kursi Lipat Outdoor Portable",
    category: "Satuan",
    pricePerDay: 10000,
    available: 25,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400",
    description: "Kursi lipat yang mampu menahan beban hingga 100kg.",
  },
  {
    id: "s6",
    name: "Lampu Lentera LED",
    category: "Satuan",
    pricePerDay: 8000,
    available: 18,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400",
    description: "Lampu penerangan portable rechargeable waterproof.",
>>>>>>> 99a1b58ea1e7aeab52ecd8ff22687b2d2bc56ac4
  },
];

function getIconByName(name = "") {
  const n = name.toLowerCase();
  if (n.includes("tenda") || n.includes("dome")) return Tent;
  if (n.includes("kompor") || n.includes("grill") || n.includes("masak")) return Flame;
  if (n.includes("lampu") || n.includes("light") || n.includes("lentera")) return Lamp;
  if (n.includes("makan") || n.includes("utensil") || n.includes("alat masak")) return Utensils;
  if (n.includes("tikar") || n.includes("matras") || n.includes("kursi") || n.includes("meja")) return LayoutGrid;
  return PackageSearch;
}

export default function CatalogPage() {
  const [activeTab, setActiveTab] = useState("satuan");
  const [searchQuery, setSearchQuery] = useState("");

  const [alatList, setAlatList] = useState(initialAlatList);
  const [paketList, setPaketList] = useState(initialPaket);
  const [loadingData, setLoadingData] = useState(false);

  const [qty, setQty] = useState(1);
  const [selectedAlatIndex, setSelectedAlatIndex] = useState(0);
  const [selectedBundleIndex, setSelectedBundleIndex] = useState(0);

  // Tanggal sewa
  const todayStr = new Date().toISOString().split("T")[0];
  const defaultEndStr = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(todayStr);
  const [endDate, setEndDate] = useState(defaultEndStr);

  // Status submit sewa
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");

  const loadData = async () => {
    setLoadingData(true);
    try {
      const itemsRes = await apiFetch("/items");
      if (Array.isArray(itemsRes) && itemsRes.length > 0) {
        const mapped = itemsRes.map((it) => {
          const rawPrice = it.harga_sewa_per_hari || it.harga_sewa || 20000;
          const stock = it.stok_tersedia !== undefined ? it.stok_tersedia : (it.stok || it.stok_total || 5);
          return {
            id_item: it.id_item || it.id,
            name: it.nama_item || it.name || "Alat Camping",
            icon: getIconByName(it.nama_item || it.name),
            stock: Number(stock),
            rawPrice: Number(rawPrice),
            price: `Rp${Number(rawPrice).toLocaleString("id-ID")}/hari`,
          };
        });
        setAlatList(mapped);
      }

      const packagesRes = await apiFetch("/packages");
      if (Array.isArray(packagesRes) && packagesRes.length > 0) {
        const mappedPkgs = packagesRes.map((p, idx) => {
          const rawPrice = p.harga || p.harga_paket || 50000;
          return {
            id_package: p.id_package || p.id || `pkg-${idx}`,
            name: p.nama_paket || p.name || `Paket Glamping ${idx + 1}`,
            items: p.deskripsi ? p.deskripsi.split(",").map((s) => s.trim()) : ["Perlengkapan Standar"],
            rawPrice: Number(rawPrice),
            price: `Rp${Number(rawPrice).toLocaleString("id-ID")}/hari`,
            save: "Paket Hemat",
          };
        });
        setPaketList(mappedPkgs);
      }
    } catch (err) {
      console.warn("Menggunakan fallback data lokal karena API belum diisi:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAlat = alatList.filter((a) =>
    a.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPaket = paketList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.items.some((it) => it.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const safeAlatIndex = selectedAlatIndex >= filteredAlat.length ? 0 : selectedAlatIndex;
  const safeBundleIndex = selectedBundleIndex >= filteredPaket.length ? 0 : selectedBundleIndex;

  const currentAlat = filteredAlat[safeAlatIndex];
  const currentPaket = filteredPaket[safeBundleIndex];

  // Handler pengubahan tanggal
  const handleStartDateChange = (e) => {
    const val = e.target.value;
    setStartDate(val);
    if (endDate < val) setEndDate(val);
  };

  const handleEndDateChange = (e) => {
    const val = e.target.value;
    if (val >= startDate) setEndDate(val);
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    if (isNaN(start) || isNaN(end) || end < start) return 1;
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff >= 0 ? diff + 1 : 1;
  };

  const rentDays = calculateDays();

  const handleSewa = async (type) => {
    setSubmitting(true);
    setSubmitError("");
    setSubmitSuccess("");

    const savedUser = localStorage.getItem("session_user");
    const token = localStorage.getItem("session_token");

    if (!token || !savedUser) {
      setSubmitError("Silakan masuk (login) terlebih dahulu pada menu Autentikasi sebelum mengajukan sewa.");
      setSubmitting(false);
      return;
    }

    let user = {};
    try {
      user = JSON.parse(savedUser);
    } catch {
      user = {};
    }

    const userId = user.id_user || user.id || user._id;

    if (!userId) {
      setSubmitError("Sesi pengguna tidak valid. Silakan login kembali.");
      setSubmitting(false);
      return;
    }

    const isSatuan = type === "satuan";
    const selectedItem = isSatuan ? currentAlat : currentPaket;

    if (!selectedItem) {
      setSubmitError("Item yang dipilih tidak valid.");
      setSubmitting(false);
      return;
    }

    const itemPrice = selectedItem?.rawPrice || 25000;
    const totalHarga = isSatuan ? itemPrice * qty * rentDays : itemPrice * rentDays;

    try {
      // PENTING: Key dikirim sesuai kebutuhan Backend (id_user, tanggal_mulai_sewa, tanggal_selesai_sewa)
      const borrowRes = await apiFetch("/borrows", {
        method: "POST",
        body: JSON.stringify({
          id_user: userId,
          tanggal_mulai_sewa: startDate,
          tanggal_selesai_sewa: endDate,
          status: "menunggu",
          total_harga: totalHarga,
        }),
      });

      const borrowId = borrowRes?.id_borrow || borrowRes?.id || `CT-${Date.now().toString().slice(-4)}`;

      try {
        await apiFetch("/borrows_details", {
          method: "POST",
          body: JSON.stringify({
            id_borrow: borrowId,
            id_item: isSatuan ? selectedItem.id_item : "bundle-pkg",
            jumlah: isSatuan ? qty : 1,
            subtotal: totalHarga,
          }),
        });
      } catch {
        // Abaikan error jika endpoint detail opsional
      }

      setSubmitSuccess(
        `Pengajuan peminjaman "${selectedItem.name}" berhasil dikirim! ID Transaksi: ${borrowId}`
      );
    } catch (err) {
      setSubmitError(err?.message || "Gagal mengirim pengajuan sewa. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <SectionEyebrow
          index={2}
          total={4}
          title="Katalog Peminjaman"
          desc="Penyewa dapat menelusuri alat satuan maupun paket hemat camping & piknik dengan pengecekan stok otomatis."
        />
        <button
          type="button"
          onClick={loadData}
          disabled={loadingData}
          title="Segarkan data dari server"
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer border border-stone-200 hover:bg-stone-50 transition-colors flex-shrink-0"
          style={{ color: C.forestDeep }}
        >
          <RefreshCw size={13} className={loadingData ? "animate-spin" : ""} />
          <span>{loadingData ? "Memuat..." : "Refresh API"}</span>
        </button>
      </div>

      <div
        className="flex items-center gap-2 p-1.5 rounded-2xl mb-6 w-fit"
        style={{ backgroundColor: C.paper, border: `1px solid ${C.canvasDeep}` }}
      >
        <button
          type="button"
          onClick={() => {
            setActiveTab("satuan");
            setSearchQuery("");
            setSubmitError("");
            setSubmitSuccess("");
            setSelectedAlatIndex(0);
            setQty(1);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: activeTab === "satuan" ? C.forestDeep : "transparent",
            color: activeTab === "satuan" ? C.paper : C.ink,
          }}
        >
          <PackageSearch size={16} style={{ color: activeTab === "satuan" ? C.amber : C.moss }} />
          Alat Satuan ({alatList.length})
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab("bundle");
            setSearchQuery("");
            setSubmitError("");
            setSubmitSuccess("");
            setSelectedBundleIndex(0);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all cursor-pointer"
          style={{
            backgroundColor: activeTab === "bundle" ? C.forestDeep : "transparent",
            color: activeTab === "bundle" ? C.paper : C.ink,
          }}
        >
          <Sparkles size={16} style={{ color: activeTab === "bundle" ? C.amber : C.amberDeep }} />
          Paket Bundle ({paketList.length})
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

      {submitError && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle size={17} className="flex-shrink-0" />
            <span>{submitError}</span>
          </div>
          <Link
            href="/auth"
            className="underline flex items-center gap-1 font-bold whitespace-nowrap text-red-800"
          >
            Ke Menu Masuk <ArrowRight size={13} />
          </Link>
        </div>
      )}

      {submitSuccess && (
        <div className="mb-6 p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={17} className="flex-shrink-0" />
            <span>{submitSuccess}</span>
          </div>
          <Link
            href="/history"
            className="underline flex items-center gap-1 font-bold whitespace-nowrap text-green-800"
          >
            Cek Riwayat Peminjaman <ArrowRight size={13} />
          </Link>
        </div>
      )}

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
                {filteredAlat.map((a, i) => {
                  const Icon = a.icon;
                  const isSelected = currentAlat?.id_item === a.id_item || currentAlat?.name === a.name;
                  return (
                    <button
                      key={a.id_item || a.name}
                      type="button"
                      onClick={() => {
                        setSelectedAlatIndex(i);
                        setQty(1);
                        setSubmitError("");
                        setSubmitSuccess("");
                      }}
                      className="text-left rounded-2xl p-4 transition-all cursor-pointer"
                      style={{
                        backgroundColor: isSelected ? C.forestDeep : C.paper,
                        border: `1px solid ${isSelected ? C.forestDeep : C.canvasDeep}`,
                      }}
                    >
                      <Icon size={22} style={{ color: isSelected ? C.amber : C.moss }} />
                      <p
                        className="mt-3 text-sm font-semibold"
                        style={{ ...headingFont, color: isSelected ? C.paper : C.ink }}
                      >
                        {a.name}
                      </p>
                      <div className="flex items-center justify-between mt-1.5">
                        <span
                          className="text-xs"
                          style={{ ...bodyFont, color: isSelected ? "#CFE0D2" : "#8A8272" }}
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
                  );
                })}
              </div>
            )}
          </div>

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
                    <input
                      type="date"
                      value={startDate}
                      onChange={handleStartDateChange}
                      min={todayStr}
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer border border-stone-200"
                      style={{ backgroundColor: "#fff", color: C.ink }}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                      <Calendar size={12} /> Tgl kembali
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={handleEndDateChange}
                      min={startDate}
                      className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer border border-stone-200"
                      style={{ backgroundColor: "#fff", color: C.ink }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-semibold flex items-center gap-1" style={{ ...bodyFont, color: "#5C5548" }}>
                      <Hash size={12} /> Jumlah unit
                    </label>
                    <span className="text-[11px] text-stone-500">Maks: {currentAlat.stock} unit</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors"
                      style={{ backgroundColor: C.canvas }}
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-semibold w-6 text-center" style={{ ...bodyFont }}>
                      {qty}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQty(Math.min(currentAlat.stock || 1, qty + 1))}
                      className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors"
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
                  Durasi: {rentDays} hari sewa ({startDate} s.d {endDate})
                </div>

                <div className="p-3 rounded-xl bg-white border border-stone-200 flex justify-between items-center">
                  <div>
                    <p className="text-[11px] text-stone-500">Total Perkiraan Biaya</p>
                    <p className="text-base font-bold" style={{ ...headingFont, color: C.forestDeep }}>
                      Rp{((currentAlat.rawPrice || 25000) * qty * rentDays).toLocaleString("id-ID")}
                    </p>
                  </div>
                  <span className="text-[11px] text-stone-500">
                    {qty} unit x {rentDays} hr
                  </span>
                </div>
              </div>

              <button
                type="button"
                disabled={submitting || currentAlat.stock <= 0}
                onClick={() => handleSewa("satuan")}
                className="w-full mt-6 py-3 rounded-full font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
                style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep, opacity: submitting || currentAlat.stock <= 0 ? 0.7 : 1 }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {currentAlat.stock <= 0 ? "Stok Habis" : "Kirim Pengajuan Sewa"}
              </button>
            </div>
          )}
        </div>
      )}

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
                  const isSelected = currentPaket?.id_package === p.id_package || currentPaket?.name === p.name;
                  return (
                    <button
                      key={p.id_package || p.name}
                      type="button"
                      onClick={() => {
                        setSelectedBundleIndex(i);
                        setSubmitError("");
                        setSubmitSuccess("");
                      }}
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

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                    <Calendar size={12} /> Tgl mulai sewa
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={handleStartDateChange}
                    min={todayStr}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer border border-stone-200"
                    style={{ backgroundColor: "#fff", color: C.ink }}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold flex items-center gap-1 mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
                    <Calendar size={12} /> Tgl sewa kembali
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={handleEndDateChange}
                    min={startDate}
                    className="w-full px-3 py-2 rounded-lg text-xs outline-none cursor-pointer border border-stone-200"
                    style={{ backgroundColor: "#fff", color: C.ink }}
                  />
                </div>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-medium mb-5"
                style={{ backgroundColor: `${C.moss}18`, color: C.moss }}
              >
                <CheckCircle2 size={14} />
                Durasi: {rentDays} hari sewa paket
              </div>

              <StitchDivider />
              <div className="flex items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-xs" style={{ ...bodyFont, color: "#8A8272" }}>Total sewa</p>
                  <p className="text-xl font-bold" style={{ ...headingFont, color: C.forestDeep }}>
                    Rp{((currentPaket.rawPrice || 50000) * rentDays).toLocaleString("id-ID")}
                  </p>
                </div>
                <GearTag tone={C.rust}>{currentPaket.save}</GearTag>
              </div>

              <button
                type="button"
                disabled={submitting}
                onClick={() => handleSewa("bundle")}
                className="w-full py-3 rounded-full font-semibold text-sm cursor-pointer flex items-center justify-center gap-2 transition-opacity hover:opacity-90 disabled:cursor-not-allowed"
                style={{ ...bodyFont, backgroundColor: C.amber, color: C.forestDeep, opacity: submitting ? 0.7 : 1 }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                Sewa Sekarang — Semua Alat Paket
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