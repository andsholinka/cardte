"use client";

import { useRef, useState, useCallback } from "react";
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
 * 3D perspective stacked card view.
 * - Tap = copy card number
 * - Long press = open detail/edit
 * - No overlay on cards — clean look
 */
export function CardStack({ cards, onOpen, onEdit }: Props) {
  const { t } = useT();
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const onScroll = () => {
    if (containerRef.current) {
      setScrollY(containerRef.current.scrollTop);
    }
  };

  const handlePointerDown = useCallback((card: SavedCard) => {
    didLongPress.current = false;
    pressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      onOpen(card);
    }, LONG_PRESS_MS);
  }, [onOpen]);

  const handlePointerUp = useCallback(async (card: SavedCard) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (didLongPress.current) return; // already handled
    // Short tap = copy
    if (!card.number) {
      toast(t("toast.no_number"));
      return;
    }
    const ok = await copyText(card.number);
    toast(ok ? t("toast.copied", { name: card.name }) : t("toast.copy_failed"));
  }, [t]);

  const handlePointerCancel = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
  }, []);

  const CARD_HEIGHT = 160;
  const VISIBLE_GAP = 60;
  const totalHeight = cards.length * VISIBLE_GAP + (CARD_HEIGHT - VISIBLE_GAP);

  return (
    <div
      ref={containerRef}
      onScroll={onScroll}
      className="no-scrollbar relative overflow-y-auto px-5"
      style={{
        height: `min(${totalHeight + 40}px, 65dvh)`,
        perspective: "1200px",
        perspectiveOrigin: "50% 25%",
      }}
    >
      <div
        className="relative"
        style={{ height: `${totalHeight}px` }}
      >
        {cards.map((card, i) => {
          const tile = getTile(card);
          const yOffset = i * VISIBLE_GAP;
          const distFromTop = yOffset - scrollY;
          const normalizedDist = Math.max(0, Math.min(1, distFromTop / 320));

          const rotateX = normalizedDist * 6;
          const scale = 1 - normalizedDist * 0.02;

          return (
            <div
              key={card.uid}
              onPointerDown={() => handlePointerDown(card)}
              onPointerUp={() => handlePointerUp(card)}
              onPointerLeave={handlePointerCancel}
              onPointerCancel={handlePointerCancel}
              onContextMenu={(e) => e.preventDefault()}
              className="absolute left-0 right-0 w-full cursor-pointer select-none overflow-hidden rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.5)] transition-transform duration-150 active:scale-[0.98]"
              style={{
                top: `${yOffset}px`,
                height: `${CARD_HEIGHT}px`,
                transform: `rotateX(${rotateX}deg) scale(${scale})`,
                transformOrigin: "50% 0%",
                zIndex: cards.length - i,
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
