"use client";

import { useEffect, useState, useCallback } from "react";

export type SavedCard = {
  /** unique uuid for this saved instance */
  uid: string;
  /** catalog id (e.g. "bca", "starbucks") or "custom" */
  catalogId: string;
  /** display name (defaults from catalog or custom) */
  name: string;
  /** card identifier shown to user (member id / card number, last4, etc.) */
  number?: string;
  /** card holder name ("a.n.") */
  holder?: string;
  /** optional barcode value */
  barcode?: string;
  /** detected barcode format (e.g. "code_128", "ean_13", "qr_code") */
  barcodeFormat?: string;
  /** when true, hide the barcode in the card detail view */
  hideBarcode?: boolean;
  /** optional pin/note */
  note?: string;
  /** whether this is the premium hero card */
  isHero?: boolean;
  /** custom card visual (used when catalogId === "custom") */
  custom?: {
    bg: string;
    fg?: string;
    label: string;
  };
  createdAt: number;
};

const KEY = "cardte:cards:v1";

function readAll(): SavedCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as SavedCard[];
  } catch {
    return [];
  }
}

function writeAll(cards: SavedCard[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(cards));
  // Notify other components
  window.dispatchEvent(new CustomEvent("cardte:update"));
}

export function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}

export function useSavedCards() {
  const [cards, setCards] = useState<SavedCard[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setCards(readAll());
    setLoaded(true);
    const onUpdate = () => setCards(readAll());
    window.addEventListener("cardte:update", onUpdate);
    window.addEventListener("storage", onUpdate);
    return () => {
      window.removeEventListener("cardte:update", onUpdate);
      window.removeEventListener("storage", onUpdate);
    };
  }, []);

  const add = useCallback((card: Omit<SavedCard, "uid" | "createdAt">) => {
    const next: SavedCard = { ...card, uid: uuid(), createdAt: Date.now() };
    const all = [next, ...readAll()];
    writeAll(all);
    return next;
  }, []);

  const update = useCallback((uid: string, patch: Partial<SavedCard>) => {
    let all = readAll();
    if (patch.isHero) {
      all = all.map((c) => ({ ...c, isHero: false }));
    }
    all = all.map((c) => (c.uid === uid ? { ...c, ...patch } : c));
    writeAll(all);
  }, []);

  const remove = useCallback((uid: string) => {
    const all = readAll().filter((c) => c.uid !== uid);
    writeAll(all);
  }, []);

  const clearAll = useCallback(() => {
    writeAll([]);
  }, []);

  return { cards, loaded, add, update, remove, clearAll };
}

export function exportCards(): string {
  return JSON.stringify(readAll(), null, 2);
}

export function importCards(json: string): { ok: boolean; count: number } {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return { ok: false, count: 0 };
    const valid = data.filter(
      (c) => c && typeof c.uid === "string" && typeof c.catalogId === "string"
    ) as SavedCard[];
    writeAll(valid);
    return { ok: true, count: valid.length };
  } catch {
    return { ok: false, count: 0 };
  }
}
