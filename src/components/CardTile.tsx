"use client";

import { CatalogCard } from "@/data/catalog";
import { readableTextColor } from "@/lib/utils";

type Props = {
  card: Pick<CatalogCard, "bg" | "fg" | "label" | "sub" | "style" | "logo" | "logoWhite" | "logoClass">;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

/**
 * Card tile — keeps brand color on the card face itself.
 * Surrounding UI is mono black/white.
 */
export function CardTile({ card, size = "md", className }: Props) {
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
          : "text-sm";

  const imgSize =
    size === "sm"
      ? "max-h-[50%] max-w-[75%]"
      : size === "xl"
        ? "max-h-[40%] max-w-[70%]"
        : size === "lg"
          ? "max-h-[45%] max-w-[75%]"
          : "max-h-[45%] max-w-[75%]";

  const isBlock = card.style === "block";
  const labelLines = card.label.split("\n");

  return (
    <div
      className={`relative flex aspect-[16/10] w-full select-none items-center justify-center overflow-hidden rounded-xl ${padding} ${className ?? ""}`}
      style={{
        backgroundColor: card.bg,
        color: fg,
      }}
    >
      {/* Subtle inner highlight */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl"
        style={{
          boxShadow:
            "inset 0 1px 0 0 rgba(255,255,255,0.12), inset 0 -1px 0 0 rgba(0,0,0,0.2)",
        }}
      />

      <div
        className={`relative z-10 flex h-full w-full flex-col items-center justify-center text-center font-bold leading-tight tracking-tight ${fontSize} ${
          isBlock ? "uppercase" : ""
        }`}
      >
        {card.logo ? (
          <img
            src={card.logo}
            alt={card.label}
            className={`h-full w-full object-contain drop-shadow-md ${imgSize} ${
              card.logoWhite ? "brightness-0 invert" : ""
            } ${card.logoClass || ""}`}
          />
        ) : (
          <>
            {labelLines.map((l, i) => (
              <span key={i} className="block">
                {l}
              </span>
            ))}
            {card.sub && (
              <span className="mt-0.5 text-[9px] font-medium opacity-80">
                {card.sub}
              </span>
            )}
          </>
        )}
      </div>
    </div>
  );
}
