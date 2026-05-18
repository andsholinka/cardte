"use client";

import { Search, X } from "lucide-react";

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-white/[0.06] bg-white/[0.03] px-3.5 py-2.5">
      <Search size={16} className="text-white/30" />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
      />
      {value && (
        <button onClick={() => onChange("")} aria-label="Clear">
          <X size={14} className="text-white/30" />
        </button>
      )}
    </label>
  );
}
