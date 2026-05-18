"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { WalletCards, Plus, Settings2 } from "lucide-react";
import { useT } from "@/lib/i18n";

type Props = {
  onAdd?: () => void;
};

export function BottomNav({ onAdd }: Props) {
  const { t } = useT();
  const pathname = usePathname();

  const isCards = pathname === "/";
  const isAccount = pathname?.startsWith("/account");

  return (
    <div
      className="fixed inset-x-0 bottom-6 z-30 mx-auto w-full max-w-[300px] px-4"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <nav className="relative flex h-[64px] w-full items-center justify-between rounded-full border border-white/20 bg-white/[0.12] px-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] backdrop-blur-xl saturate-[150%]">
        {/* Left: Cards */}
        <Link
          href="/"
          className={`flex w-16 h-full items-center justify-center transition active:scale-95 ${
            isCards ? "text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" : "text-white/40"
          }`}
          aria-label={t("nav.cards")}
        >
          <WalletCards size={24} strokeWidth={isCards ? 2.2 : 1.7} />
        </Link>

        {/* Center: Add Button */}
        <button
          onClick={onAdd}
          aria-label={t("home.add_card_aria")}
          className="flex h-[48px] w-[48px] items-center justify-center rounded-full bg-white text-black shadow-lg transition active:scale-95"
        >
          <Plus size={26} strokeWidth={2.5} />
        </button>

        {/* Right: Account */}
        <Link
          href="/account"
          className={`flex w-16 h-full items-center justify-center transition active:scale-95 ${
            isAccount ? "text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]" : "text-white/40"
          }`}
          aria-label={t("nav.account")}
        >
          <Settings2 size={24} strokeWidth={isAccount ? 2.2 : 1.7} />
        </Link>
      </nav>
    </div>
  );
}
