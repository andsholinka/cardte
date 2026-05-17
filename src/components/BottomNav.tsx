"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, Tag, User } from "lucide-react";
import { useT } from "@/lib/i18n";

export function BottomNav() {
  const { t } = useT();
  const pathname = usePathname();

  const items = [
    { href: "/", label: t("nav.cards"), icon: CreditCard },
    { href: "/offers", label: t("nav.offers"), icon: Tag },
    { href: "/account", label: t("nav.account"), icon: User },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md px-4"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}
    >
      <ul className="glass relative flex items-center justify-around rounded-2xl px-2 py-1.5 shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname?.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={`relative flex flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-2 text-[11px] transition ${
                  active ? "text-white" : "text-muted"
                }`}
              >
                {active && (
                  <span
                    aria-hidden
                    className="absolute inset-x-3 -top-px h-0.5 rounded-full bg-white"
                  />
                )}
                <Icon size={20} strokeWidth={active ? 2.4 : 1.8} />
                <span className={active ? "font-semibold" : ""}>{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
