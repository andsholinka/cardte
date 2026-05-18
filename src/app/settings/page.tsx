"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  Lock,
  SlidersHorizontal,
} from "lucide-react";
import { useT } from "@/lib/i18n";
import { useSavedCards } from "@/lib/storage";
import {
  hasPin,
  clearPin,
  getSortMode,
  setSortMode,
  type SortMode,
} from "@/lib/lock";
import { toast } from "@/components/Toast";

export default function AdvancedSettingsPage() {
  const { t } = useT();
  const router = useRouter();
  const { clearAll } = useSavedCards();

  const [lockOn, setLockOn] = useState(false);
  const [sort, setSort] = useState<SortMode>("recent");
  const [sortOpen, setSortOpen] = useState(false);

  // Refresh state when returning to this screen.
  useEffect(() => {
    const refresh = () => {
      setLockOn(hasPin());
      setSort(getSortMode());
    };
    refresh();
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const onWipe = () => {
    if (!confirm(t("adv.danger_confirm"))) return;
    clearAll();
    clearPin();
    try {
      localStorage.removeItem("cardte:sort:v1");
      localStorage.removeItem("cardte:lock:last_active:v1");
      localStorage.removeItem("cardte:lock:autolock:v1");
    } catch {
      /* ignore */
    }
    toast(t("account.cleared"));
    router.replace("/account");
  };

  const pickSort = (m: SortMode) => {
    setSortMode(m);
    setSort(m);
    setSortOpen(false);
  };

  const sortLabel =
    sort === "name" ? t("adv.sort_name") : t("adv.sort_recent");

  return (
    <main
      className="ambient-bg relative min-h-[100dvh] pb-16"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      {/* Top bar */}
      <header className="relative z-10 flex items-center px-4 py-2">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 active:bg-white/5"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold tracking-tight">
          {t("adv.title")}
        </h1>
      </header>

      {/* Settings card */}
      <section className="relative z-10 mx-5 mt-3 overflow-hidden rounded-2xl glass">
        <Link
          href="/settings/lock"
          className="flex w-full items-center justify-between px-4 py-3.5 active:bg-white/5"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
              <Lock size={18} />
            </span>
            <span className="flex flex-col items-start">
              <span className="text-[15px]">{t("adv.lock_title")}</span>
              <span className="text-[12px] text-white/40">
                {lockOn ? t("adv.lock_state_on") : t("adv.lock_state_off")}
              </span>
            </span>
          </span>
          <ChevronRight size={18} className="text-white/40" />
        </Link>

        <div className="mx-4 h-px bg-white/5" />

        <button
          onClick={() => setSortOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 active:bg-white/5"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
              <SlidersHorizontal size={18} />
            </span>
            <span className="flex flex-col items-start">
              <span className="text-[15px]">{t("adv.sort_title")}</span>
              <span className="text-[12px] text-white/40">{sortLabel}</span>
            </span>
          </span>
          <ChevronRight
            size={18}
            className={`text-white/40 transition ${sortOpen ? "rotate-90" : ""}`}
          />
        </button>

        {sortOpen && (
          <div className="border-t border-white/5">
            <SortRow
              title={t("sort.by_recent")}
              caption={t("sort.by_recent_caption")}
              selected={sort === "recent"}
              onClick={() => pickSort("recent")}
            />
            <div className="mx-4 h-px bg-white/5" />
            <SortRow
              title={t("sort.by_name")}
              caption={t("sort.by_name_caption")}
              selected={sort === "name"}
              onClick={() => pickSort("name")}
            />
          </div>
        )}
      </section>

      {/* Danger zone */}
      <section className="relative z-10 mx-5 mt-10 text-center">
        <p className="text-[13px] text-white/50">{t("adv.danger_question")}</p>
        <button
          onClick={onWipe}
          className="mt-1 text-[13px] font-medium text-white underline underline-offset-4 active:opacity-70"
        >
          {t("adv.danger_action")}
        </button>
      </section>
    </main>
  );
}

function SortRow({
  title,
  caption,
  selected,
  onClick,
}: {
  title: string;
  caption: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between px-4 py-3 active:bg-white/5"
    >
      <span className="flex flex-col items-start">
        <span className="text-sm">{title}</span>
        <span className="text-[11px] text-white/40">{caption}</span>
      </span>
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border ${
          selected ? "border-white bg-white" : "border-white/20"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-black" />}
      </span>
    </button>
  );
}
