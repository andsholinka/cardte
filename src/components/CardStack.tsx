"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import { SavedCard } from "@/lib/storage";
import { findCatalog } from "@/data/catalog";
import { CardTile } from "./CardTile";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toast";
import { useT } from "@/lib/i18n";

type Props = {
  cards: SavedCard[];
  onOpen: (card: SavedCard) => void;
  onEdit: (card: SavedCard) => void;
};

const LONG_PRESS_MS = 500;

/**
 * Apple Wallet-style card stack using CSS sticky positioning.
 *
 * Each card is `position: sticky` with an increasing `top` value.
 * This creates the natural "stack and peel" effect:
 * - All cards overlap initially, each peeking below the previous
 * - As you scroll, the top card peels away revealing the next
 * - The next card "sticks" in place until you scroll further
 *
 * No JS scroll calculations needed — pure CSS does the heavy lifting.
 */
export function CardStack({ cards, onOpen }: Props) {
  const { t } = useT();
  const [mounted, setMounted] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const didLongPress = useRef(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(timer);
  }, []);

  const handlePointerDown = useCallback(
    (card: SavedCard, e: React.PointerEvent) => {
      didLongPress.current = false;
      pressStartPos.current = { x: e.clientX, y: e.clientY };
      pressTimer.current = setTimeout(() => {
        didLongPress.current = true;
        onOpen(card);
      }, LONG_PRESS_MS);
    },
    [onOpen]
  );

  const handlePointerUp = useCallback(
    async (card: SavedCard) => {
      if (pressTimer.current) {
        clearTimeout(pressTimer.current);
        pressTimer.current = null;
      }
      if (didLongPress.current) return;
      if (!card.number) {
        toast(t("toast.no_number"));
        return;
      }
      const ok = await copyText(card.number);
      toast(ok ? t("toast.copied", { name: card.name }) : t("toast.copy_failed"));
    },
    [t]
  );

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!pressTimer.current) return;
    const dx = Math.abs(e.clientX - pressStartPos.current.x);
    const dy = Math.abs(e.clientY - pressStartPos.current.y);
    if (dx > 8 || dy > 8) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const handlePointerCancel = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  return (
    <div
      className="no-scrollbar relative mx-5 overflow-y-auto overscroll-contain rounded-2xl"
      style={{ height: "min(500px, 65dvh)" }}
    >
      {cards.map((card, i) => {
        const tile = getTile(card);
        const entranceDelay = i * 70;

        return (
          <div
            key={card.uid}
            onPointerDown={(e) => handlePointerDown(card, e)}
            onPointerUp={() => handlePointerUp(card)}
            onPointerMove={handlePointerMove}
            onPointerLeave={handlePointerCancel}
            onPointerCancel={handlePointerCancel}
            onContextMenu={(e) => e.preventDefault()}
            className="card-stack-item sticky cursor-pointer select-none overflow-hidden rounded-2xl"
            style={{
              top: `${i * 16}px`,
              height: "160px",
              marginBottom: "-80px",
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : `translateY(${40 + i * 15}px)`,
              transition: mounted
                ? "transform 0.2s ease, opacity 0.2s ease"
                : `transform 0.55s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay}ms,
                   opacity 0.4s ease ${entranceDelay}ms`,
              zIndex: cards.length + 10 - i,
              boxShadow: "0 4px 20px rgba(0,0,0,0.5), 0 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            <CardTile card={tile} size="lg" />
            {/* Name label at bottom — only show if card has no logo (logo already identifies the card) */}
            {!tile.logo && (
              <div
                className="absolute inset-x-0 bottom-0 flex items-end justify-between px-4 pb-3 pt-10"
                style={{
                  background: `linear-gradient(to top, ${tile.bg}ee 30%, transparent)`,
                }}
              >
                <span
                  className="text-sm font-bold drop-shadow-sm"
                  style={{ color: tile.fg ?? "#fff" }}
                >
                  {card.name}
                </span>
                {card.number && (
                  <span
                    className="font-mono text-[11px] opacity-70"
                    style={{ color: tile.fg ?? "#fff" }}
                  >
                    •••• {card.number.slice(-4)}
                  </span>
                )}
              </div>
            )}
            {tile.logo && card.number && (
              <div className="absolute bottom-2 right-3">
                <span
                  className="font-mono text-[10px] opacity-60"
                  style={{ color: tile.fg ?? "#fff" }}
                >
                  •••• {card.number.slice(-4)}
                </span>
              </div>
            )}
          </div>
        );
      })}
      {/* Bottom spacer so last card can be scrolled into full view */}
      <div style={{ height: "120px", flexShrink: 0 }} />
    </div>
  );
}

function getTile(card: SavedCard) {
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
