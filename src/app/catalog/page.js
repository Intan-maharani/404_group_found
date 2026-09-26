"use client";

import React, { useState } from "react";
import { Package, ShoppingBag, Calendar, CheckCircle2, X, AlertCircle } from "lucide-react";

export const initialItems = [
  // Paket Bundle (>1 Paket)
  {
    id: "p1",
    name: "Paket Piknik Estetik Romance (2 Orang)",
    category: "Bundle",
    pricePerDay: 45000,
    available: 8,
    image: "https://i.pinimg.com/1200x/de/12/42/de12422cd598be0198805dac5e67506a.jpg",
    description: "Cocok untuk kencan/photo-session pasangan: Termasuk 1x Tikar Estetik, 1x Keranjang Piknik Anyaman, 1x Kamera Kayu Polaroid, dan 1x Set Piring & Gelas Estetik.",
  },
  {
    id: "p2",
    name: "Paket Masak & Santai Ceria (3-4 Orang)",
    category: "Bundle",
    pricePerDay: 58000,
    available: 10,
    image: "https://i.pinimg.com/1200x/22/7c/57/227c579eff9f406f3d6a8be2898878e9.jpg",
    description: "Solusi hemat BBQ/masak di alam: Termasuk 1x Tikar Estetik, 1x Meja Lipat Portable, 1x Kompor Camping Portable, dan 1x Nesting Cooking Set (DS-308).",
  },
  {
    id: "p3",
    name: "Paket Teduh & Chill Outdoor",
    category: "Bundle",
    pricePerDay: 80000,
    available: 6,
    image: "https://i.pinimg.com/1200x/b5/05/90/b505908b5b6b135b4deb6ec646b58e98.jpg",
    description: "Perlengkapan bersantai bebas panas terik: Termasuk 1x Tenda Semi Outdoor, 1x Meja Lipat Portable, 2x Kursi Lipat Outdoor, dan 1x Tikar Estetik.",
  },
  {
    id: "p4",
    name: "Paket Piknik Senja to Night",
    category: "Bundle",
    pricePerDay: 50000,
    available: 8,
    image: "https://i.pinimg.com/1200x/0d/00/89/0d0089ef47d6b4662c48e4fb87a1ab3a.jpg",
    description: "Lengkap hingga malam hari: Termasuk 1x Tikar Estetik, 1x Kompor Camping, 1x Nesting Cooking Set, 1x Lampu Lentera LED, dan 1x Set Piring & Gelas.",
  },
  {
    id: "p5",
    name: "Paket Sultan Complete Picnic (Group/Family)",
    category: "Bundle",
    pricePerDay: 135000,
    available: 5,
    image: "https://i.pinimg.com/736x/a1/33/7c/a1337c0f57986eed9892408baeecda3f.jpg",
    description: "Paket komplit tanpa repot: Termasuk Tenda Semi Outdoor, Meja Lipat, 2x Kursi Lipat, Tikar Estetik, Keranjang, Kompor + Nesting, Kamera Polaroid, dan Lampu LED.",
  },

  // Barang Satuan (>5 Barang)
  {
    id: "s1",
    name: "Tenda Semi Outdoor",
    category: "Satuan",
    pricePerDay: 45000,
    available: 10,
    image: "https://i.pinimg.com/1200x/ef/ad/a8/efada842dbe689ef1f1965066334aa15.jpg",
    description: "Tenda peneduh praktis berbahan waterproof, cocok untuk kenyamanan bersantai saat piknik.",
  },
  {
    id: "s2",
    name: "Meja Lipat Portable",
    category: "Satuan",
    pricePerDay: 25000,
    available: 20,
    image: "https://i.pinimg.com/1200x/15/12/96/1512966f6740af8e5dfd232fd53e4e3c.jpg",
    description: "Meja lipat aluminium yang praktis, ringan, dan kokoh untuk menaruh makanan dan minuman.",
  },
  {
    id: "s3",
    name: "Kompor Camping Portable",
    category: "Satuan",
    pricePerDay: 12000,
    available: 15,
    image: "https://i.pinimg.com/1200x/31/01/df/3101df18a97b2794789a828e41baa41e.jpg",
    description: "Kompor mini praktis dan tahan angin, cocok untuk memasak atau menyeduh minuman hangat saat piknik di alam terbuka.",
  },
  {
    id: "s4",
    name: "Nesting Cooking Set (DS-308)",
    category: "Satuan",
    pricePerDay: 15000,
    available: 12,
    image: "https://i.pinimg.com/1200x/6e/b9/b6/6eb9b69d07a65e4fc2c3cfa00baecea4.jpg",
    description: "Panci dan teko aluminium ringan 3-in-1 serbaguna.",
  },
  {
    id: "s5",
    name: "Kursi Lipat Outdoor Portable",
    category: "Satuan",
    pricePerDay: 10000,
    available: 25,
    image: "https://i.pinimg.com/1200x/43/ce/34/43ce349498c499ed40faafcc5d076cfd.jpg",
    description: "Kursi lipat yang nyaman dan mampu menahan beban hingga 100kg.",
  },
  {
    id: "s6",
    name: "Lampu Lentera LED",
    category: "Satuan",
    pricePerDay: 8000,
    available: 18,
    image: "https://i.pinimg.com/736x/5d/21/a2/5d21a23c02ba4139255a10477f5d02d4.jpg",
    description: "Lampu penerangan portable rechargeable yang tahan air.",
  },
  {
    id: "s7",
    name: "Keranjang Piknik Anyaman",
    category: "Satuan",
    pricePerDay: 20000,
    available: 10,
    image: "https://i.pinimg.com/1200x/f0/65/ee/f065ee9cf7081b815e2a15d5404e4f21.jpg",
    description: "Keranjang piknik klasik estetis dengan kapasitas luas untuk membawa makanan dan perlengkapan.",
  },
  {
    id: "s8",
    name: "Tikar Piknik Estetik Motif Kotak",
    category: "Satuan",
    pricePerDay: 15000,
    available: 20,
    image: "https://i.pinimg.com/736x/e0/1c/96/e01c96951ac573ef9ec3611bdd230d83.jpg",
    description: "Tikar piknik kain berlapir waterproof dengan motif kotak-kotak klasik yang cantik dan nyaman untuk properti foto.",
  },
  {
    id: "s9",
    name: "Piring & Gelas Estetik",
    category: "Satuan",
    pricePerDay: 10000,
    available: 15,
    image: "https://down-id.img.susercontent.com/file/id-11134207-7ra0q-mcbr0lx7zc9l60_tn",
    description: "Set 1 piring dan 1 gelas berdesain kayu/keramik estetik yang food-grade, cocok untuk melengkapi suasana makan saat piknik.",
  },
  {
    id: "s10",
    name: "Kamera Kayu Polaroid",
    category: "Satuan",
    pricePerDay: 10000,
    available: 10,
    image: "https://i.pinimg.com/736x/79/c0/d7/79c0d783113ba2771fc348f4077ff421.jpg",
    description: "Kamera cetak langsung dengan bodi sentuhan kayu estetik. Cocok untuk mengabadikan momen instan sekaligus properti foto piknik yang Instagrammable.",
  },
];

export default function CatalogPage() {
  const [selectedItem, setSelectedItem] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // Cek peran user dari localStorage
  const [isAdmin] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      const sessionUserStr = localStorage.getItem("session_user");
      if (sessionUserStr) {
        const userObj = JSON.parse(sessionUserStr);
        return userObj.role === "admin";
      }
    } catch (err) {
      console.error("Gagal membaca session_user:", err);
    }
    return false;
  });

  // Dapatkan tanggal hari ini dalam format YYYY-MM-DD
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const todayStr = getTodayString();

  // Membuka modal peminjaman dan mengatur tanggal awal
  const handleOpenBorrowModal = (item) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const formatDate = (date) => date.toISOString().split("T")[0];

    setStartDate(formatDate(today));
    setEndDate(formatDate(tomorrow));
    setErrorMessage("");
    setSelectedItem(item);
  };

  // Fungsi konfirmasi dengan validasi ketat
  const handleConfirmBorrow = () => {
    if (!startDate || !endDate) {
      setErrorMessage("Silakan pilih tanggal mulai dan selesai sewa!");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date(todayStr);

    // 1. Cek apakah tanggal mulai sudah lewat
    if (start < today) {
      setErrorMessage("Tanggal sewa tidak boleh tanggal yang sudah lewat!");
      return;
    }

    // Hitung selisih hari
    const timeDiff = end.getTime() - start.getTime();
    const dayDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

    // 2. Cek jika tanggal selesai kurang dari tanggal mulai
    if (end < start) {
      setErrorMessage("Tanggal selesai sewa tidak boleh sebelum tanggal mulai!");
      return;
    }

    // 3. Cek jika peminjaman kurang dari 1 hari (misal tanggal mulai == tanggal selesai)
    if (dayDiff < 1) {
      setErrorMessage("Peminjaman tidak boleh kurang dari sehari (minimal 1 hari)!");
      return;
    }

    // Jika lolos validasi
    setErrorMessage("");
    alert(`Pengajuan peminjaman untuk "${selectedItem.name}" selama ${dayDiff} hari berhasil dikirim!`);
    setSelectedItem(null);
  };

  return (
    <div className="p-4 sm:p-8 bg-slate-50 min-h-screen text-slate-800">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto mb-10 text-center sm:text-left">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
          Katalog Peminjaman Alat Piknik
        </h1>
        <p className="text-slate-600 text-base sm:text-lg">
          Pilih paket bundle hemat atau peralatan satuan berkualitas untuk liburan seru Anda.
        </p>
      </div>

      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section 1: Paket Bundle */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b pb-3 border-slate-200">
            <Package className="text-emerald-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900">Paket Bundle Hemat</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {initialItems
              .filter((i) => i.category === "Bundle")
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col overflow-hidden group"
                >
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
                      {item.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                      Stok: {item.available}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-600 text-sm mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between gap-1 overflow-hidden">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] text-slate-400 block leading-none mb-1">Sewa / Hari</span>
                        <span className="font-extrabold text-emerald-600 text-xs sm:text-sm whitespace-nowrap tracking-tight block">
                          Rp {item.pricePerDay.toLocaleString("id-ID")}
                        </span>
                      </div>
                      {!isAdmin ? (
                        <button
                          onClick={() => handleOpenBorrowModal(item)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2 py-1.5 rounded-lg text-[11px] transition-colors shadow-sm shrink-0 whitespace-nowrap"
                        >
                          Pinjam Paket
                        </button>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                          Mode Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* Section 2: Barang Satuan */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b pb-3 border-slate-200">
            <ShoppingBag className="text-emerald-600 w-6 h-6" />
            <h2 className="text-2xl font-bold text-slate-900">Barang Satuan Camping & Piknik</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {initialItems
              .filter((i) => i.category === "Satuan")
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 flex flex-col overflow-hidden group"
                >
                  <div className="relative h-40 w-full overflow-hidden bg-slate-100 shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-slate-800/80 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm">
                      {item.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-slate-700 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-200">
                      Stok: {item.available}
                    </span>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center gap-1.5">
                      <div className="shrink-0">
                        <span className="text-[10px] text-slate-400 block leading-tight">Sewa / Hari</span>
                        <span className="font-bold text-emerald-600 text-xs sm:text-sm whitespace-nowrap">
                          Rp {item.pricePerDay.toLocaleString("id-ID")}
                        </span>
                      </div>
                      {!isAdmin ? (
                        <button
                          onClick={() => handleOpenBorrowModal(item)}
                          className="bg-slate-900 hover:bg-emerald-600 text-white font-medium px-2.5 py-1.5 rounded-lg text-xs transition-colors active:scale-95 duration-150 shrink-0 whitespace-nowrap"
                        >
                          Pinjam
                        </button>
                      ) : (
                        <span className="text-[10px] bg-slate-100 text-slate-500 font-semibold px-2.5 py-1 rounded-lg border border-slate-200 shrink-0">
                          Mode Admin
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>
      </div>

      {/* Modal Popup Pinjam */}
      {selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div>
              <span className="text-xs font-semibold tracking-wider text-emerald-600 uppercase bg-emerald-50 px-2.5 py-1 rounded-full">
                Formulir Peminjaman
              </span>
              <h3 className="font-bold text-xl text-slate-900 mt-2">{selectedItem.name}</h3>
              <p className="text-sm text-slate-500 mt-1">
                Harga Sewa:{" "}
                <strong className="text-emerald-600 font-semibold whitespace-nowrap">
                  Rp {selectedItem.pricePerDay.toLocaleString("id-ID")}
                </strong>{" "}
                / hari
              </p>
            </div>

            {/* Pesan Error Validasi */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Date Pickers */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Tanggal Mulai Sewa
                </label>
                <input
                  type="date"
                  min={todayStr}
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-emerald-600" /> Tanggal Selesai Sewa
                </label>
                <input
                  type="date"
                  min={startDate || todayStr}
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setErrorMessage("");
                  }}
                  className="w-full border border-slate-200 rounded-xl p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedItem(null)}
                className="w-1/2 py-2.5 border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmBorrow}
                className="w-1/2 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" /> Konfirmasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}