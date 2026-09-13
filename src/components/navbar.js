import { getlanding } from "@/lib/apii";

export default async function Navbar() {
  const info = await getlanding();

  return (
    <header className="sticky top-0 z-10 border-b bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <img src={info.logo} alt={info.nama} className="h-8 w-8 rounded object-cover" />
          <span className="text-lg font-bold">{info.nama}</span>
        </div>
        <nav className="hidden gap-6 text-sm md:flex">
          <a href="#kendaraan">Kendaraan</a>
          <a href="#tentang">Tentang</a>
          <a href="#testimoni">Testimoni</a>
          <a href="#kontak">Kontak</a>
        </nav>
      </div>
    </header>
  );
}