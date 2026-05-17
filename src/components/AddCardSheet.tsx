"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ALL_CATALOG, BANKS, MEMBERS, CatalogCard } from "@/data/catalog";
import { CardTile } from "./CardTile";
import { Search, X, Plus } from "lucide-react";
import { useT } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onPick: (card: CatalogCard | "custom") => void;
};

const ALPHA = "ABCDEFGHIJKLMNOPRSTUVWXYZ#".split("");

export function AddCardSheet({ open, onClose, onPick }: Props) {
  const { t } = useT();
  const [q, setQ] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setQ("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const frequent = useMemo(
    () =>
      [
        "tiara-gatzu",
        "alfamart",
        "uniqlo",
        "matahari",
        "map",
        "starbucks",
        "tiara-dewata",
        "ace",
      ]
        .map((id) => ALL_CATALOG.find((c) => c.id === id))
        .filter(Boolean) as CatalogCard[],
    []
  );

  const grouped = useMemo(() => {
    const filter = q.trim().toLowerCase();
    const list = filter
      ? ALL_CATALOG.filter((c) => c.name.toLowerCase().includes(filter))
      : ALL_CATALOG;
    const map = new Map<string, CatalogCard[]>();
    for (const item of list) {
      const first = item.name[0]?.toUpperCase() ?? "#";
      const key = /[A-Z]/.test(first) ? first : "#";
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(item);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [q]);

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`alpha-${letter}`);
    if (el && containerRef.current) {
      containerRef.current.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth",
      });
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/60 transition-opacity ${
          open ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute inset-x-0 bottom-0 mx-auto max-w-md transform rounded-t-2xl bg-[#1c1c1e] transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          height: "92dvh",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="grid grid-cols-3 items-center px-4 py-3">
          <button
            onClick={onClose}
            className="text-left text-base text-white"
          >
            {t("add.cancel")}
          </button>
          <h2 className="text-center text-base font-semibold">
            {t("add.title")}
          </h2>
          <span />
        </div>

        <div className="px-4 pb-2">
          <label className="flex items-center gap-2 rounded-xl bg-[#2c2c2e] px-3 py-2.5">
            <Search size={18} className="text-muted" />
            <input
              autoFocus={false}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={t("add.search")}
              className="w-full bg-transparent text-sm placeholder:text-muted focus:outline-none"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label={t("common.close")}>
                <X size={16} className="text-muted" />
              </button>
            )}
          </label>
        </div>

        <div className="relative h-[calc(92dvh-120px)]">
          <div
            ref={containerRef}
            className="no-scrollbar h-full overflow-y-auto px-4 pb-24"
          >
            {!q && (
              <section className="mt-2">
                <h3 className="mb-2 text-sm font-semibold">
                  {t("add.frequent")}
                </h3>
                <ul className="overflow-hidden rounded-2xl bg-[#2c2c2e]">
                  {frequent.map((c, i) => (
                    <li key={c.id}>
                      <button
                        onClick={() => onPick(c)}
                        className="flex w-full items-center gap-3 px-3 py-2.5 active:bg-white/5"
                      >
                        <div className="w-16 shrink-0">
                          <CardTile card={c} size="sm" />
                        </div>
                        <span className="text-sm">{c.name}</span>
                      </button>
                      {i < frequent.length - 1 && (
                        <div className="ml-[5.25rem] h-px bg-white/5" />
                      )}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => onPick("custom")}
                  className="mt-3 flex w-full items-center gap-3 rounded-2xl bg-[#2c2c2e] px-3 py-3 active:bg-white/5"
                >
                  <div className="flex aspect-[16/10] w-16 items-center justify-center rounded-xl bg-[#3a3a3c]">
                    <Plus size={22} />
                  </div>
                  <span className="text-sm">{t("add.other")}</span>
                </button>
              </section>
            )}

            <section className="mt-4 space-y-4">
              {grouped.map(([letter, items]) => (
                <div key={letter} id={`alpha-${letter}`}>
                  <h4 className="mb-2 text-sm font-semibold">{letter}</h4>
                  <ul className="overflow-hidden rounded-2xl bg-[#2c2c2e]">
                    {items.map((c, i) => (
                      <li key={c.id}>
                        <button
                          onClick={() => onPick(c)}
                          className="flex w-full items-center gap-3 px-3 py-2.5 active:bg-white/5"
                        >
                          <div className="w-16 shrink-0">
                            <CardTile card={c} size="sm" />
                          </div>
                          <div className="flex flex-col items-start">
                            <span className="text-sm">{c.name}</span>
                            <span className="text-[11px] text-muted">
                              {c.category === "bank"
                                ? t("add.bank_label")
                                : t("add.member_label")}
                            </span>
                          </div>
                        </button>
                        {i < items.length - 1 && (
                          <div className="ml-[5.25rem] h-px bg-white/5" />
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
              {grouped.length === 0 && (
                <p className="py-8 text-center text-sm text-muted">
                  {t("add.no_results")}
                </p>
              )}
            </section>
          </div>

          {!q && (
            <div className="absolute right-1 top-1/2 -translate-y-1/2 select-none text-[10px] text-muted">
              <ul className="flex flex-col items-center gap-0.5">
                <li>★</li>
                {ALPHA.map((l) => (
                  <li key={l}>
                    <button
                      onClick={() => scrollToLetter(l)}
                      className="block px-1"
                    >
                      {l}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

void BANKS;
void MEMBERS;
