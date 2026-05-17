"use client";

import { CatalogCard } from "@/data/catalog";
import { readableTextColor } from "@/lib/utils";

type Props = {
  card: Pick<CatalogCard, "bg" | "fg" | "label" | "sub" | "style">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  /** Tampilkan efek gloss + glow premium */
  premium?: boolean;
};

/**
 * Render kartu pakai gradient + sheen agar terkesan glossy seperti kartu
 * fisik. Tetap CSS-only, tanpa aset eksternal.
 */
export function CardTile({ card, size = "md", className, premium = true }: Props) {
  const fg = card.fg ?? readableTextColor(card.bg);
  const padding =
    size === "sm" ? "p-2" : size === "xl" ? "p-7" : size === "lg" ? "p-5" : "p-3";
  const fontSize =
    size === "sm"
      ? "text-[11px]"
      : size === "xl"
        ? "text-3xl"
        : size === "lg"
          ? "text-2xl"
          : "text-base";

  const isBlock = card.style === "block";
  const labelLines = card.label.split("\n");

  // Gradient halus dari warna brand → versi lebih gelap
  const gradient = premium
    ? `linear-gradient(140deg, ${shade(card.bg, 22)} 0%, ${card.bg} 45%, ${shade(card.bg, -22)} 100%)`
    : card.bg;

  return (
    <div
      className={`relative isolate flex aspect-[16/10] w-full select-none items-center justify-center overflow-hidden rounded-xl ${padding} ${className ?? ""}`}
      style={{
        background: gradient,
        color: fg,
        boxShadow: premium
          ? "0 6px 18px -6px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(0,0,0,0.25)"
          : undefined,
      }}
    >
      {/* Sheen / gloss diagonal */}
      {premium && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-0 opacity-70"
          style={{
            background:
              "linear-gradient(120deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 35%, rgba(255,255,255,0) 65%, rgba(255,255,255,0.08) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      )}

      {/* Tiny noise overlay biar tidak datar */}
      {premium && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "3px 3px",
          }}
        />
      )}

      <div
        className={`relative z-10 flex flex-col items-center justify-center text-center font-extrabold leading-tight tracking-tight ${fontSize} ${
          isBlock ? "uppercase" : ""
        }`}
        style={{ textShadow: premium ? "0 1px 1px rgba(0,0,0,0.18)" : undefined }}
      >
        {labelLines.map((l, i) => (
          <span key={i} className="block">
            {l}
          </span>
        ))}
        {card.sub && (
          <span className="mt-0.5 text-[10px] font-medium opacity-90">
            {card.sub}
          </span>
        )}
      </div>
    </div>
  );
}

/* -------------------- helpers -------------------- */

/** Lighten/darken hex by percent (-100 .. 100). */
function shade(hex: string, pct: number) {
  const c = hex.replace("#", "");
  if (c.length !== 6) return hex;
  const num = parseInt(c, 16);
  const r = clamp((num >> 16) + Math.round((255 * pct) / 100));
  const g = clamp(((num >> 8) & 0xff) + Math.round((255 * pct) / 100));
  const b = clamp((num & 0xff) + Math.round((255 * pct) / 100));
  return `#${[r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}
function clamp(n: number) {
  return Math.max(0, Math.min(255, n));
}
