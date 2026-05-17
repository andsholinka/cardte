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
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-10 top-2 h-44 rounded-[40px] opacity-60 blur-2xl"
        style={{ background: tile.bg }}
      />

      <div
        className="relative overflow-hidden rounded-[28px] p-[1.5px]"
        style={{
          background: `linear-gradient(135deg, ${tile.bg}aa 0%, rgba(255,255,255,0.18) 50%, ${tile.bg}88 100%)`,
        }}
      >
        <div
          className="shine relative overflow-hidden rounded-[26px] p-5"
          style={{
            background:
              "linear-gradient(160deg, rgba(28,28,30,0.95) 0%, rgba(18,18,22,0.95) 100%)",
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-40 blur-2xl"
            style={{ background: tile.bg }}
          />

          <div className="relative z-10 flex items-start justify-between">
            <div
              className="rounded-full px-3 py-1 text-[11px] font-bold tracking-wide"
              style={{
                background: `${tile.bg}33`,
                color: "#fff",
                border: `1px solid ${tile.bg}66`,
              }}
            >
              {active.name}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => onEdit(active)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/90 active:scale-95"
                aria-label={t("detail.edit")}
              >
                <Pencil size={14} />
              </button>
            </div>
          </div>

          <button
            onClick={onCopy}
            onContextMenu={(e) => {
              e.preventDefault();
              onOpen(active);
            }}
            className="relative z-10 mt-4 block w-full overflow-hidden rounded-2xl text-left active:scale-[0.99]"
          >
            <div
              className="flex h-28 items-center justify-center"
              style={{
                background: `linear-gradient(140deg, ${shade(tile.bg, 25)} 0%, ${tile.bg} 50%, ${shade(tile.bg, -28)} 100%)`,
                color: tile.fg,
                boxShadow:
                  "inset 0 1px 0 0 rgba(255,255,255,0.18), inset 0 -1px 0 0 rgba(0,0,0,0.25)",
              }}
            >
              <span
                className="text-3xl font-extrabold tracking-tight"
                style={{ textShadow: "0 1px 1px rgba(0,0,0,0.2)" }}
              >
                {tile.label.split("\n").join(" ")}
              </span>
            </div>
          </button>

          <div className="relative z-10 mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted">
                {t("hero.card_number")}
              </p>
              <p className="mt-1 truncate font-mono text-xl font-bold tracking-wider">
                {formatNumber(active.number) || "•••• •••• •••• ••••"}
              </p>
              {active.holder && (
                <p className="mt-1 text-xs text-muted">
                  {t("hero.holder_prefix")} {active.holder}
                </p>
              )}
            </div>
            <button
              onClick={onCopy}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider text-black active:scale-95"
            >
              <Copy size={13} /> {t("hero.copy")}
            </button>
          </div>
        </div>
      </div>

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
                    : "w-1.5 bg-white/25 active:bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-muted">
            <button
              onClick={prev}
              aria-label={t("hero.prev")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
            >
              <ChevronLeft size={14} />
            </button>
            <button
              onClick={next}
              aria-label={t("hero.next")}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 active:bg-white/10"
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
    bg: card.custom?.bg ?? "#3a3a3c",
    fg: card.custom?.fg ?? "#fff",
    label: card.custom?.label ?? card.name,
    style: "wordmark" as const,
    sub: undefined,
  };
}

function formatNumber(n?: string) {
  if (!n) return "";
  return n.replace(/(\d{4})(?=\d)/g, "$1 ");
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
