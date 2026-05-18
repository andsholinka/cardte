"use client";

import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { CardTile } from "@/components/CardTile";
import { BottomNav } from "@/components/BottomNav";
import { AddCardSheet } from "@/components/AddCardSheet";
import { CardDetailSheet } from "@/components/CardDetailSheet";
import { CustomCardSheet } from "@/components/CustomCardSheet";
import { CardGridItem } from "@/components/CardGridItem";
import { HeroCard } from "@/components/HeroCard";
import { SearchInput } from "@/components/SearchInput";
import { useSavedCards, SavedCard } from "@/lib/storage";
import { findCatalog, CatalogCard } from "@/data/catalog";
import { useT } from "@/lib/i18n";

type Filter = "all" | "bank" | "member";

export default function HomePage() {
  const { t } = useT();
  const { cards, loaded, add } = useSavedCards();
  const [addOpen, setAddOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [selected, setSelected] = useState<SavedCard | null>(null);
  const [openInEdit, setOpenInEdit] = useState(false);

  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const onPick = (item: CatalogCard | "custom") => {
    if (item === "custom") {
      setAddOpen(false);
      setCustomOpen(true);
      return;
    }
    const draftCard: SavedCard = {
      uid: "NEW_CARD",
      catalogId: item.id,
      name: item.name,
      createdAt: Date.now(),
    };
    setAddOpen(false);
    setSelected(draftCard);
    setOpenInEdit(true);
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
    return cards.filter((c) => {
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
  }, [cards, q, filter]);

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
      {loaded && cards.length > 0 && (
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
        <section className="relative z-10 mt-5 px-5">
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
          <SectionTitle
            title={t("home.all_cards")}
            subtitle={t("home.x_of_y", { x: filtered.length, y: cards.length })}
          />
          {filtered.length === 0 ? (
            <p className="mt-4 text-center text-sm text-muted">
              {t("home.no_match")}
            </p>
          ) : (
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
          )}
        </section>
      )}

      <AddCardSheet
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onPick={onPick}
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

function SectionTitle({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-3 flex items-end justify-between px-5">
      <h2 className="text-base font-semibold tracking-tight">{title}</h2>
      {subtitle && <span className="text-[11px] text-white/40">{subtitle}</span>}
    </div>
  );
}

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
