"use client";

import { Search, X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Cari kartu...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="glass flex items-center gap-2 rounded-2xl px-3.5 py-2.5">
      <Search size={16} className="text-muted" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm placeholder:text-muted focus:outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear">
          <X size={14} className="text-muted" />
        </button>
      )}
    </label>
  );
}
