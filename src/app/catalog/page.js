"use client";

import React, { useState } from "react";
import { Package, ShoppingBag, Tent } from "lucide-react";

export const initialItems = [
  // Paket Bundle (>1 Paket)
  {
    id: "b1",
    name: "Bundle Hemat Ceria (2 Orang)",
    category: "Bundle",
    pricePerDay: 75000,
    available: 5,
    image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=400",
    description: "Tenda Kapasitas 2P + 2 Matras Foam + 1 Lampu Tenda + Kompor Stove",
  },
  {
    id: "b2",
    name: "Bundle Petualang (4-5 Orang)",
    category: "Bundle",
    pricePerDay: 150000,
    available: 4,
    image: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=400",
    description: "Tenda 4-5P + 4 Sleeping Bag + Kompor Portable + Nesting Set + Flysheet",
  },
  {
    id: "b3",
    name: "Bundle Piknik Santai Family",
    category: "Bundle",
    pricePerDay: 110000,
    available: 3,
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=400",
    description: "Kursi Lipat 4x + Meja Lipat + Cooler Box 15L + Flysheet Estetik",
  },

  // Barang Satuan (>5 Barang)
  {
    id: "s1",
    name: "Tenda Dome 4 Person",
    category: "Satuan",
    pricePerDay: 45000,
    available: 10,
    image: "https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&q=80&w=400",
    description: "Tenda waterproof double layer kapasitas 4 orang.",
  },
  {
    id: "s2",
    name: "Sleeping Bag Bulu Angsa",
    category: "Satuan",
    pricePerDay: 15000,
    available: 20,
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400",
    description: "Menjaga suhu tubuh tetap hangat hingga 5°C.",
  },
  {
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
  },
  {
    id: "s7",
    name: "Carrier Bag 60 Liter",
    category: "Satuan",
    pricePerDay: 25000,
    available: 8,
    image: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=400",
    description: "Tas gunung dengan air back system untuk kenyamanan ekstra.",
  },
];

export default function CatalogPage() {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-2">Katalog Peminjaman Alat</h1>
      <p className="text-slate-500 mb-8">Pilih paket bundle hemat atau peralatan satuan sesuai kebutuhan.</p>

      {/* Bagian Bundle */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Package className="text-emerald-600" /> Paket Bundle Hemat
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {initialItems.filter(i => i.category === "Bundle").map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <img src={item.image} alt={item.name} className="h-40 w-full object-cover rounded-lg mb-3" />
            <div>
              <span className="bg-emerald-100 text-emerald-700 text-xs px-2 py-1 rounded font-bold">{item.category}</span>
              <h3 className="font-bold text-lg mt-2">{item.name}</h3>
              <p className="text-slate-500 text-sm mt-1">{item.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="font-bold text-emerald-600">Rp {item.pricePerDay.toLocaleString("id-ID")}/hari</span>
              <button onClick={() => setSelectedItem(item)} className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm">Pinjam</button>
            </div>
          </div>
        ))}
      </div>

      {/* Bagian Satuan */}
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ShoppingBag className="text-emerald-600" /> Barang Satuan Camping
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {initialItems.filter(i => i.category === "Satuan").map((item) => (
          <div key={item.id} className="bg-white rounded-xl shadow p-4 flex flex-col justify-between">
            <img src={item.image} alt={item.name} className="h-32 w-full object-cover rounded-lg mb-3" />
            <div>
              <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded font-bold">{item.category}</span>
              <h3 className="font-bold text-base mt-2">{item.name}</h3>
              <p className="text-slate-500 text-xs mt-1">{item.description}</p>
            </div>
            <div className="mt-4 pt-3 border-t flex justify-between items-center">
              <span className="font-bold text-emerald-600 text-sm">Rp {item.pricePerDay.toLocaleString("id-ID")}/hari</span>
              <button onClick={() => setSelectedItem(item)} className="bg-emerald-500 text-white px-3 py-1 rounded text-xs">Pinjam</button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Pinjam */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-xl max-w-sm w-full space-y-4">
            <h3 className="font-bold text-lg">Pinjam: {selectedItem.name}</h3>
            <p className="text-sm text-slate-500">Harga: Rp {selectedItem.pricePerDay.toLocaleString("id-ID")} / hari</p>
            <input type="date" className="w-full border p-2 rounded" />
            <input type="date" className="w-full border p-2 rounded" />
            <div className="flex justify-end gap-2">
              <button onClick={() => setSelectedItem(null)} className="px-4 py-2 border rounded">Batal</button>
              <button onClick={() => { alert("Pengajuan Terkirim!"); setSelectedItem(null); }} className="px-4 py-2 bg-emerald-500 text-white rounded">Kirim</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}