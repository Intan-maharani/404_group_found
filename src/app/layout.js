import { Tent } from "lucide-react";
import Nav from "../components/Nav";
import { GearTag } from "../components/Shared";
import { C, headingFont } from "../lib/tokens";
import "./globals.css";

export const metadata = {
  title: "Chill Time — 404 Group Found",
  description: "Prototipe UI aplikasi penyewaan alat camping & piknik",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body style={{ backgroundColor: C.canvas, minHeight: "100vh", margin: 0 }}>
        <div className="max-w-6xl mx-auto px-5 md:px-8 py-8">
          <header className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: C.forestDeep }}
              >
                <Tent size={18} style={{ color: C.amber }} />
              </div>
              <div>
                <p className="font-bold text-sm leading-none" style={{ ...headingFont, color: C.forestDeep }}>
                  Chill Time
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#8A8272" }}>
                  404 Group Found
                </p>
              </div>
            </div>
            <GearTag tone={C.forest}>Next.js App Router · Prototipe UI</GearTag>
          </header>

          <div className="grid md:grid-cols-[220px_1fr] gap-8">
            <Nav />
            <main
              className="rounded-3xl p-6 md:p-10"
              style={{ backgroundColor: "#fff", border: `1px solid ${C.canvasDeep}` }}
            >
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
