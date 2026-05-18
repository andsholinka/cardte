"use client";

import { useEffect, useState } from "react";
import { SavedCard } from "@/lib/storage";
import { findCatalog } from "@/data/catalog";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toast";
import { Copy, Pencil, ChevronRight, ChevronLeft } from "lucide-react";
import { useT } from "@/lib/i18n";

type Props = {
  cards: SavedCard[];
  onEdit: (card: SavedCard) => void;
  onOpen: (card: SavedCard) => void;
};

export function HeroCard({ cards, onEdit, onOpen }: Props) {
  const { t } = useT();
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (idx >= cards.length) setIdx(Math.max(0, cards.length - 1));
  }, [cards.length, idx]);

  if (cards.length === 0) return null;
  const active = cards[idx];
  const tile = pickTile(active);

  const onCopy = async () => {
    if (!active.number) {
      toast(t("toast.no_number"));
      onEdit(active);
      return;
    }
    const ok = await copyText(active.number);
    toast(ok ? t("toast.copied", { name: active.name }) : t("toast.copy_failed"));
  };

  const prev = () => setIdx((i) => (i - 1 + cards.length) % cards.length);
  const next = () => setIdx((i) => (i + 1) % cards.length);

  return (
    <section className="relative px-5">
      {/* Mono glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-12 top-4 h-40 rounded-[40px] bg-white/[0.03] blur-2xl"
      />

      {/* Card container with border */}
      <div className="relative overflow-hidden rounded-[24px] border border-white/[0.08] bg-[#0a0a0a]">
        <div className="shine relative p-5">
          {/* Top row */}
          <div className="relative z-10 flex items-start justify-end">
            <button
              onClick={() => onEdit(active)}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 active:scale-95"
              aria-label={t("detail.edit")}
            >
              <Pencil size={13} />
            </button>
          </div>

          {/* Brand visual */}
          <button
            onClick={onCopy}
            onContextMenu={(e) => {
              e.preventDefault();
              onOpen(active);
            }}
            className="relative z-10 mt-4 block w-full overflow-hidden rounded-2xl text-left active:scale-[0.99]"
          >
            <div
              className="flex h-28 items-center justify-center border border-white/[0.06]"
              style={{
                background: `linear-gradient(140deg, #262626 0%, #000000 100%)`,
                color: "#ffffff",
              }}
            >
              {tile.logo ? (
                <img
                  src={tile.logo}
                  alt={tile.label}
                  className={`h-full w-full max-h-[60%] max-w-[80%] object-contain drop-shadow-md ${
                    tile.logoWhite ? "brightness-0 invert" : ""
                  } ${tile.logoClass || ""}`}
                />
              ) : (
                <span className="text-3xl font-bold tracking-tight">
                  {tile.label.split("\n").join(" ")}
                </span>
              )}
            </div>
          </button>

          {/* Number + copy */}
          <div className="relative z-10 mt-5 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
                {t("hero.card_number")}
              </p>
              <p className="mt-1.5 truncate font-mono text-xl font-semibold tracking-wider text-white/90">
                {displayNumber(active) || "•••• •••• •••• ••••"}
              </p>
              {active.holder && (
                <p className="mt-1 text-xs text-white/40">
                  {t("hero.holder_prefix")} {active.holder}
                </p>
              )}
            </div>
            <button
              onClick={onCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-full border border-white/15 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-black active:scale-95"
            >
              <Copy size={12} /> {t("hero.copy")}
            </button>
          </div>
        </div>
      </div>

      {/* Pager */}
      {cards.length > 1 && (
        <div className="mt-3 flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            {cards.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={t("hero.dot_aria", { n: i + 1 })}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx
                    ? "w-5 bg-white"
                    : "w-1.5 bg-white/20 active:bg-white/30"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              aria-label={t("hero.prev")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 active:bg-white/5"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              aria-label={t("hero.next")}
              className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 text-white/50 active:bg-white/5"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function pickTile(card: SavedCard) {
  const c = findCatalog(card.catalogId);
  if (c) return c;
  return {
    bg: card.custom?.bg ?? "#222",
    fg: card.custom?.fg ?? "#fff",
    label: card.custom?.label ?? card.name,
    style: "wordmark" as const,
    sub: undefined,
    logo: undefined,
    logoWhite: undefined,
    logoClass: undefined,
  };
}

function formatNumber(n?: string) {
  if (!n) return "";
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
}

/**
 * For bank cards: mask all but last 4 digits (e.g. •••• •••• •••• 2323).
 * For member cards: show full number with spacing.
 */
function displayNumber(card: SavedCard) {
  if (!card.number) return "";
  const cat = findCatalog(card.catalogId);
  const isBank = cat?.category === "bank";
  if (isBank && card.number.length > 4) {
    const last4 = card.number.slice(-4);
    const masked = card.number.slice(0, -4).replace(/\d/g, "•");
    const full = masked + last4;
    return full.replace(/(.{4})(?=.)/g, "$1 ");
  }
  return formatNumber(card.number);
}

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
