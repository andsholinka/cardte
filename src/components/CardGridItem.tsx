"use client";

import { Pencil } from "lucide-react";
import { CardTile } from "./CardTile";
import { SavedCard } from "@/lib/storage";
import { findCatalog } from "@/data/catalog";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toast";
import { useT } from "@/lib/i18n";

type Props = {
  card: SavedCard;
  onOpen: (card: SavedCard) => void;
  onEdit: (card: SavedCard) => void;
};

export function CardGridItem({ card, onOpen, onEdit }: Props) {
  const { t } = useT();
  const catalog = findCatalog(card.catalogId);
  const tile = catalog ?? {
    bg: card.custom?.bg ?? "#222",
    fg: card.custom?.fg,
    label: card.custom?.label ?? card.name,
    style: "wordmark" as const,
    sub: undefined,
  };

  const handleTileTap = async () => {
    if (card.number) {
      const ok = await copyText(card.number);
      toast(ok ? t("toast.copied", { name: card.name }) : t("toast.copy_failed"));
    } else {
      onOpen(card);
    }
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(card);
  };

  return (
    <div className="group relative">
      <button
        onClick={handleTileTap}
        onContextMenu={(e) => {
          e.preventDefault();
          onOpen(card);
        }}
        className="block w-full text-left"
        aria-label={t("grid.copy_aria", { name: card.name })}
      >
        <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] transition active:scale-[0.97]">
          <CardTile card={tile} />
        </div>
        <p className="mt-1.5 truncate text-[11px] font-medium text-white/80">
          {card.name}
        </p>
        {card.number ? (
          <p className="truncate font-mono text-[10px] text-white/35">
            •••• {card.number.slice(-4)}
          </p>
        ) : (
          <p className="text-[10px] text-white/30">{t("grid.no_number")}</p>
        )}
      </button>

      <button
        onClick={handleEdit}
        aria-label={t("grid.edit_aria", { name: card.name })}
        className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-black/70 text-white/80 backdrop-blur transition active:scale-90"
      >
        <Pencil size={10} />
      </button>
    </div>
  );
}
