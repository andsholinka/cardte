"use client";

import { BottomNav } from "@/components/BottomNav";
import { Sparkles } from "lucide-react";
import { useT } from "@/lib/i18n";

export default function OffersPage() {
  const { t } = useT();

  return (
    <main
      className="ambient-bg relative min-h-[100dvh] pb-32"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      <header className="relative z-10 px-5 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">
          {t("offers.kicker")}
        </p>
      </header>

      <section className="relative z-10 mx-5 mt-4">
        <div className="glass relative overflow-hidden rounded-3xl p-8 text-center">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-fuchsia-500/40 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-20 -left-12 h-44 w-44 rounded-full bg-indigo-500/40 blur-3xl"
          />
          <span className="relative mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
            <Sparkles size={22} />
          </span>
          <h3 className="relative mt-4 text-lg font-semibold">
            {t("offers.coming_soon")}
          </h3>
          <p className="relative mt-2 text-sm text-muted">
            {t("offers.coming_subtitle")}
          </p>
        </div>
      </section>

      <BottomNav />
    </main>
  );
}
