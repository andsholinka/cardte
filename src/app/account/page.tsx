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
      {/* Privacy hero */}
      <section className="relative z-10 mx-5 mt-4">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.07] to-transparent p-5 shadow-2xl backdrop-blur-xl">
          {/* Subtle background glow */}
          <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-emerald-500/20 blur-[40px] pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-teal-500/10 blur-[40px] pointer-events-none" />

          <div className="relative flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-emerald-600/5 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
              <ShieldCheck size={24} strokeWidth={2} />
            </div>
            <div className="flex-1 pt-0.5">
              <h3 className="text-[15px] font-bold tracking-tight text-white">
                {t("account.privacy_title")}
              </h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">
                {t("account.privacy_body")}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* Language */}
      <section className="relative z-10 mx-5 mt-3 overflow-hidden rounded-2xl glass">
        <button
          onClick={() => setLangOpen((v) => !v)}
          className="flex w-full items-center justify-between px-4 py-3.5 active:bg-white/5"
        >
          <span className="flex items-center gap-3 text-sm">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5">
              <Languages size={18} />
            </span>
            {t("account.language")}
          </span>
          <span className="flex items-center gap-2 text-sm text-white/40">
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
