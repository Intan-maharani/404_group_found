"use client";

import React, { useState } from "react";

export default function AdminPage() {
  const [requests, setRequests] = useState([
    { id: "REQ-001", user: "Budi", item: "Bundle Hemat Ceria", status: "Pending" },
    { id: "REQ-002", user: "Siti", item: "Tenda Dome 4 Person", status: "Approved" },
  ]);

  const updateStatus = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="p-8 bg-slate-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Halaman Admin - Kelola Semua Akses & Peminjaman</h1>
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-4">ID</th>
              <th className="p-4">Peminjam</th>
              <th className="p-4">Barang</th>
              <th className="p-4">Status</th>
              <th className="p-4">Aksi Admin</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {requests.map((r) => (
              <tr key={r.id}>
                <td className="p-4 font-mono">{r.id}</td>
                <td className="p-4">{r.user}</td>
                <td className="p-4">{r.item}</td>
                <td className="p-4 font-bold">{r.status}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => updateStatus(r.id, "Approved")} className="bg-blue-600 text-white px-3 py-1 rounded text-xs">Setujui</button>
                  <button onClick={() => updateStatus(r.id, "Rejected")} className="bg-red-600 text-white px-3 py-1 rounded text-xs">Tolak</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}