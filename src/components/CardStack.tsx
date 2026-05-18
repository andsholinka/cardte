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
const CARD_HEIGHT = 200;
const PEEK = 50; // how much of each card below peeks out

/**
 * Apple Wallet-style stacked cards.
 * All cards overlap with only PEEK pixels showing for each subsequent card.
 * The whole stack is scrollable — as you scroll, the top card slides up
 * revealing the next card fully. Simple, clean, no weird 3D distortion.
 */
export function CardStack({ cards, onOpen }: Props) {
  const { t } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mounted, setMounted] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const didLongPress = useRef(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 30);
    return () => clearTimeout(t);
  }, []);

  const onScroll = () => {
    if (containerRef.current) {
      setScrollY(containerRef.current.scrollTop);
    }
  };

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

  // Total scrollable height: first card full + rest just PEEK each
  const totalHeight = CARD_HEIGHT + (cards.length - 1) * PEEK;

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="no-scrollbar relative mx-5 overflow-y-auto overscroll-contain rounded-3xl"
      style={{ height: `min(${totalHeight + 20}px, 70dvh)` }}
    >
      <div style={{ height: `${totalHeight}px`, position: "relative" }}>
        {cards.map((card, i) => {
          const tile = getTile(card);

          // Each card's resting position
          const restY = i * PEEK;

          // How much this card has been scrolled past
          const scrolled = Math.max(0, scrollY - restY);
          // The card "sticks" at its position until scrolled, then slides up
          const y = Math.max(restY, restY + scrollY * 0 /* stays put */);

          // Scale: cards further down are slightly smaller
          const depth = i / Math.max(1, cards.length - 1);
          const scale = 1 - depth * 0.03;

          // Entrance
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
              className="absolute left-0 right-0 cursor-pointer select-none overflow-hidden rounded-2xl"
              style={{
                top: `${restY}px`,
                height: `${CARD_HEIGHT}px`,
                transform: mounted
                  ? `scale(${scale})`
                  : `translateY(${40 + i * 15}px) scale(0.92)`,
                transformOrigin: "50% 0%",
                opacity: mounted ? 1 : 0,
                zIndex: cards.length - i,
                transition: mounted
                  ? "transform 0.2s ease, box-shadow 0.2s ease"
                  : `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${entranceDelay}ms,
                     opacity 0.4s ease ${entranceDelay}ms`,
                boxShadow: `0 ${2 + (cards.length - i) * 2}px ${8 + (cards.length - i) * 4}px rgba(0,0,0,0.4)`,
              }}
            >
              <CardTile card={tile} size="lg" />
            </div>
          );
        })}
      </div>
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
