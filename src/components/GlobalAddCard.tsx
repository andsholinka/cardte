"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AddCardSheet } from "./AddCardSheet";
import { onOpenAddCard } from "@/lib/events";
import { CatalogCard } from "@/data/catalog";

/**
 * Mounted in the root layout. Listens for the global "open add card" event
 * and renders the AddCardSheet as an overlay — no page navigation needed.
 *
 * When a card is picked, it navigates to home with the selection encoded
 * so the home page can open the scan/detail flow.
 */
export function GlobalAddCard() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    return onOpenAddCard(() => setOpen(true));
  }, []);

  const onPick = (item: CatalogCard | "custom") => {
    setOpen(false);
    if (item === "custom") {
      router.push("/?pick=custom");
    } else {
      router.push(`/?pick=${encodeURIComponent(item.id)}`);
    }
  };

  return (
    <AddCardSheet open={open} onClose={() => setOpen(false)} onPick={onPick} />
  );
}
