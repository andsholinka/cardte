"use client";

import { useState } from "react";
import { BottomNav } from "@/components/BottomNav";
import { useSavedCards } from "@/lib/storage";
import {
  Trash2,
  ShieldCheck,
  ChevronRight,
  Languages,
  Check,
} from "lucide-react";
import { useT, type Locale } from "@/lib/i18n";

export default function AccountPage() {
  const { t, locale, setLocale } = useT();
  const { cards, clearAll } = useSavedCards();
  const [msg, setMsg] = useState<string | null>(null);
  const [langOpen, setLangOpen] = useState(false);

  const onClear = () => {
    if (confirm(t("account.clear_confirm"))) {
      clearAll();
      setMsg(t("account.cleared"));
      setTimeout(() => setMsg(null), 3000);
    }
  };

  const langLabel =
    locale === "id" ? t("account.language_id") : t("account.language_en");

  const pickLang = (l: Locale) => {
    setLocale(l);
    setLangOpen(false);
  };

  return (
    <main
      className="ambient-bg relative min-h-[100dvh] pb-32"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      <header className="relative z-10 px-5 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          {t("account.kicker")}
        </p>
      </header>

      {/* Privacy hero */}
      <section className="relative z-10 mx-5 mt-4">
        <div className="glass relative overflow-hidden rounded-3xl p-5">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-emerald-400/30 blur-3xl"
          />
          <div className="relative flex items-start gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
              <ShieldCheck size={20} />
            </span>
            <div>
              <h3 className="text-sm font-semibold">
                {t("account.privacy_title")}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {t("account.privacy_body")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="relative z-10 mx-5 mt-3">
        <div className="glass flex items-center justify-between rounded-2xl px-4 py-4">
          <span className="text-sm text-muted">{t("account.saved_count")}</span>
          <span className="text-2xl font-bold tracking-tight">
            {cards.length}
          </span>
        </div>
      </section>

      {/* Language */}
      <section className="relative z-10 mx-5 mt-3 overflow-hidden rounded-2xl glass">
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 active:bg-white/5"
        >
          <span className="flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/8">
              <Languages size={18} />
            </span>
            {t("account.language")}
          </span>
          <span className="flex items-center gap-2 text-sm text-muted">
            {langLabel}
            <ChevronRight
              size={16}
              className={`transition ${langOpen ? "rotate-90" : ""}`}
            />
          </span>
        </button>

        {langOpen && (
          <div className="border-t border-white/5">
            <LangOption
              label={t("account.language_id")}
              caption="Bahasa Indonesia"
              selected={locale === "id"}
              onClick={() => pickLang("id")}
            />
            <Divider />
            <LangOption
              label={t("account.language_en")}
              caption="English"
              selected={locale === "en"}
              onClick={() => pickLang("en")}
            />
          </div>
        )}
      </section>

      {/* Actions */}
      <section className="relative z-10 mx-5 mt-3 overflow-hidden rounded-2xl glass">
        <button
          onClick={onClear}
          className="flex w-full items-center justify-between px-4 py-3.5 text-red-400 active:bg-white/5"
        >
          <span className="flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/15">
              <Trash2 size={18} />
            </span>
            {t("account.clear")}
          </span>
          <ChevronRight size={16} className="opacity-60" />
        </button>
      </section>

      {msg && (
        <p className="relative z-10 mx-5 mt-3 rounded-xl bg-white/5 px-4 py-2 text-center text-xs text-muted">
          {msg}
        </p>
      )}

      <p className="relative z-10 mt-8 text-center text-[11px] text-muted">
        Cardte {t("account.footer")}
      </p>

      <BottomNav />
    </main>
  );
}

function LangOption({
  label,
  caption,
  selected,
  onClick,
}: {
  label: string;
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
        <span className="text-sm">{label}</span>
        <span className="text-[11px] text-muted">{caption}</span>
      </span>
      {selected && (
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-black">
          <Check size={14} strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

function Divider() {
  return <div className="h-px bg-white/5" />;
}
