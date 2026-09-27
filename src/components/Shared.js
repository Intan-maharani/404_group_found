
"use client";

import { C, headingFont, bodyFont } from "../lib/tokens";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export function GearTag({ children, tone = C.moss }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-full"
      style={{ ...bodyFont, backgroundColor: `${tone}1A`, color: tone, border: `1px solid ${tone}55` }}
    >
      {children}
    </span>
  );
}

export function StitchDivider() {
  return <div className="w-full my-6" style={{ height: 0, borderTop: `2px dashed ${C.canvasDeep}` }} />;
}

export function StitchDividerDark() {
  return <div className="w-full my-4" style={{ height: 0, borderTop: "1px dashed #4A5A4F" }} />;
}

export function SectionEyebrow({ index, total, title, desc }) {
  return (
    <div className="mb-8">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-sm font-semibold" style={{ ...bodyFont, color: C.amberDeep }}>
          Fitur {index} dari {total}
        </span>
      </div>
      <h2 className="text-3xl md:text-4xl font-bold mb-2" style={{ ...headingFont, color: C.forestDeep }}>
        {title}
      </h2>
      <p className="max-w-xl text-[15px] leading-relaxed" style={{ ...bodyFont, color: "#5C5548" }}>
        {desc}
      </p>
    </div>
  );
}

export function Field({ label, placeholder, type = "text", name, value, onChange, required = false, readOnly = false }) {
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const inputType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div>
      <label className="text-xs font-semibold block mb-1.5" style={{ ...bodyFont, color: "#5C5548" }}>
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          readOnly={readOnly}
          className="w-full px-4 py-2.5 rounded-xl text-sm outline-none"
          style={{
            ...bodyFont,
            backgroundColor: "#fff",
            border: `1px solid ${C.canvasDeep}`,
            color: C.ink,
            paddingRight: isPassword ? "2.75rem" : undefined,
          }}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            style={{ color: "#8A8272" }}
            tabIndex={-1}
            aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );
}