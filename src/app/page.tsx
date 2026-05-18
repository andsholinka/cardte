"use client";

import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { Plus } from "lucide-react";
import { CardTile } from "@/components/CardTile";
import { BottomNav } from "@/components/BottomNav";
import { AddCardSheet } from "@/components/AddCardSheet";
import { CardGridItem } from "@/components/CardGridItem";
import { HeroCard } from "@/components/HeroCard";
import { SearchInput } from "@/components/SearchInput";
import { CardStack } from "@/components/CardStack";
import { toast } from "@/components/Toast";
import { useSavedCards, SavedCard } from "@/lib/storage";
import { findCatalog, CatalogCard } from "@/data/catalog";
import { useT } from "@/lib/i18n";
import { useSortMode, useLayoutMode } from "@/lib/lock";

const CardDetailSheet = dynamic(
  () => import("@/components/CardDetailSheet").then((m) => m.CardDetailSheet),
  { ssr: false }
);
const CustomCardSheet = dynamic(
  () => import("@/components/CustomCardSheet").then((m) => m.CustomCardSheet),
  { ssr: false }
);
const BarcodeScanSheet = dynamic(
  () => import("@/components/BarcodeScanSheet").then((m) => m.BarcodeScanSheet),
  { ssr: false }
);

type Filter = "all" | "bank" | "member";

export default function HomePage() {
  const { t } = useT();
  const { cards, loaded, add } = useSavedCards();
  const [addOpen, setAddOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [selected, setSelected] = useState<SavedCard | null>(null);
  const [openInEdit, setOpenInEdit] = useState(false);
  const [scanCard, setScanCard] = useState<CatalogCard | null>(null);

  // Handle ?pick= param from GlobalAddCard (when user picks from another page).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const pick = params.get("pick");
    if (!pick) return;
    // Clean up the URL immediately.
    window.history.replaceState({}, "", "/");
    if (pick === "custom") {
      setCustomOpen(true);
    } else {
      const cat = findCatalog(pick);
      if (cat) {
        if (cat.category === "member") {
          setScanCard(cat);
        } else {
          openDetailFor(cat);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [sort] = useSortMode();
  const [layout] = useLayoutMode();

  const openDetailFor = (
    item: CatalogCard,
    extras?: { number?: string; barcode?: string; barcodeFormat?: string }
  ) => {
    const draftCard: SavedCard = {
      uid: "NEW_CARD",
      catalogId: item.id,
      name: item.name,
      number: extras?.number,
      barcode: extras?.barcode,
      barcodeFormat: extras?.barcodeFormat,
      createdAt: Date.now(),
    };
    setSelected(draftCard);
    setOpenInEdit(true);
  };

  const onPick = (item: CatalogCard | "custom") => {
    if (item === "custom") {
      setAddOpen(false);
      setCustomOpen(true);
      return;
    }
    setAddOpen(false);
    if (item.category === "member") {
      // Stocard-style: scan the barcode first.
      setScanCard(item);
      return;
    }
    openDetailFor(item);
  };

  const closeDetail = () => {
    setSelected(null);
    setOpenInEdit(false);
  };

  const stats = useMemo(() => {
    let bank = 0;
    let member = 0;
    for (const c of cards) {
      const cat = findCatalog(c.catalogId);
      if (cat?.category === "bank") bank++;
      else member++;
    }
    return { total: cards.length, bank, member };
  }, [cards]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    const list = cards.filter((c) => {
      const cat = findCatalog(c.catalogId);
      const isBank = cat?.category === "bank";
      if (filter === "bank" && !isBank) return false;
      if (filter === "member" && isBank) return false;
      if (!term) return true;
      return (
        c.name.toLowerCase().includes(term) ||
        c.number?.toLowerCase().includes(term) ||
        c.holder?.toLowerCase().includes(term)
      );
    });

    if (sort === "name") {
      return [...list].sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
      );
    }
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }, [cards, q, filter, sort]);

  const heroCards = useMemo(() => {
    if (cards.length === 0) return [];
    const hero = cards.find((c) => c.isHero);
    return hero ? [hero] : [cards[0]];
  }, [cards]);

  return (
    <main
      className="ambient-bg relative min-h-[100dvh] pb-32"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      {loaded && cards.length > 0 && layout === "grid" && (
        <div className="relative z-10">
          <HeroCard
            cards={heroCards}
            onEdit={(c) => {
              setSelected(c);
              setOpenInEdit(true);
            }}
            onOpen={(c) => {
              setSelected(c);
              setOpenInEdit(false);
            }}
          />
        </div>
      )}

      {loaded && cards.length > 0 && (
        <section className={`relative z-10 px-5 ${layout === "stack" ? "mt-2" : "mt-5"}`}>
          <SearchInput
            value={q}
            onChange={setQ}
            placeholder={t("home.search_placeholder")}
          />
          <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              {t("filter.all")} · {stats.total}
            </Chip>
            <Chip active={filter === "bank"} onClick={() => setFilter("bank")}>
              {t("filter.bank")} · {stats.bank}
            </Chip>
            <Chip
              active={filter === "member"}
              onClick={() => setFilter("member")}
            >
              {t("filter.member")} · {stats.member}
            </Chip>
          </div>
        </section>
      )}

      {loaded && cards.length === 0 && (
        <EmptyState onAdd={() => setAddOpen(true)} onPick={onPick} />
      )}

      {loaded && cards.length > 0 && (
        <section className="relative z-10 mt-5">
          <div className="mb-3 flex items-end justify-between px-5">
            <h2 className="text-base font-semibold tracking-tight">
              {t("home.all_cards")}
            </h2>
            <span className="text-[11px] text-white/40">
              {t("home.x_of_y", { x: filtered.length, y: cards.length })}
            </span>
          </div>
          {filtered.length === 0 ? (
            <p className="mt-4 text-center text-sm text-muted">
              {t("home.no_match")}
            </p>
          ) : layout === "grid" ? (
            <div className="grid grid-cols-3 gap-3 px-5">
              {filtered.map((c) => (
                <CardGridItem
                  key={c.uid}
                  card={c}
                  onOpen={(card) => {
                    setSelected(card);
                    setOpenInEdit(false);
                  }}
                  onEdit={(card) => {
                    setSelected(card);
                    setOpenInEdit(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <CardStack
              cards={filtered}
              onOpen={(card) => {
                setSelected(card);
                setOpenInEdit(false);
              }}
              onEdit={(card) => {
                setSelected(card);
                setOpenInEdit(true);
              }}
            />
          )}
        </section>
      )}

      <AddCardSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onPick={onPick}
      />
      <BarcodeScanSheet
        open={!!scanCard}
        card={scanCard}
        onClose={() => setScanCard(null)}
        onResult={(r) => {
          const c = scanCard;
          setScanCard(null);
          if (c) {
            const onlyDigits = r.value.replace(/\D+/g, "");
            const isNumericFormat =
              !r.format ||
              r.format === "ean_13" ||
              r.format === "ean_8" ||
              r.format === "upc_a" ||
              r.format === "upc_e" ||
              r.format === "itf";
            openDetailFor(c, {
              number: isNumericFormat && onlyDigits ? onlyDigits : r.value,
              barcode: r.value,
              barcodeFormat: r.format,
            });
            toast(t("scan.scanned"));
          }
        }}
        onManual={() => {
          const c = scanCard;
          setScanCard(null);
          if (c) openDetailFor(c);
        }}
      />
      <CustomCardSheet open={customOpen} onClose={() => setCustomOpen(false)} />
      <CardDetailSheet
        open={!!selected}
        card={selected}
        onClose={closeDetail}
        initialEdit={openInEdit}
      />

      <BottomNav onAdd={() => setAddOpen(true)} />
    </main>
  );
}

/* ----------------------- subcomponents ----------------------- */

function Chip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition active:scale-95 ${
        active
          ? "bg-white text-black"
          : "border border-white/10 bg-white/5 text-white/85"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({
  onAdd,
  onPick,
}: {
  onAdd: () => void;
  onPick: (c: CatalogCard) => void;
}) {
  const { t } = useT();
  const previews = [
    "bca",
    "bni",
    "bri",
    "starbucks",
    "adidas",
    "alfamart",
  ];

  return (
    <section className="relative z-10 mt-8 px-5">
      <div className="glass relative overflow-hidden rounded-3xl p-6 text-center">
        <h3 className="relative text-xl font-bold">{t("empty.title")}</h3>
        <p className="relative mt-1 text-sm text-white/40">
          {t("empty.subtitle")}
        </p>
        <button
          onClick={onAdd}
          className="relative mt-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white px-5 py-2.5 text-sm font-semibold text-black active:scale-95"
        >
          <Plus size={16} /> {t("empty.cta")}
        </button>

        <div className="relative mt-6 grid grid-cols-3 gap-2 opacity-90">
          {previews.map((id) => {
            const c = findCatalog(id);
            if (!c) return null;
            return (
              <button
                key={id}
                onClick={() => onPick(c)}
                className="overflow-hidden rounded-xl active:scale-[0.97]"
              >
                <CardTile card={c} size="sm" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
