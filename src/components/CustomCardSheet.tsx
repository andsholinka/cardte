"use client";

import { useEffect, useState } from "react";
import { CardTile } from "./CardTile";
import { useSavedCards } from "@/lib/storage";
import { X } from "lucide-react";
import { useT } from "@/lib/i18n";

type Props = {
  open: boolean;
  onClose: () => void;
  onSaved?: () => void;
};

const PALETTE = [
  "#E30613", "#0060A8", "#0F9D58", "#F58220", "#5B2A86",
  "#FFC107", "#0FA6A6", "#9CB9A6", "#1F1F1F", "#7A2E20",
];

export function CustomCardSheet({ open, onClose, onSaved }: Props) {
  const { t } = useT();
  const { add } = useSavedCards();
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [bg, setBg] = useState(PALETTE[0]);

  useEffect(() => {
    if (open) {
      setName("");
      setNumber("");
      setBg(PALETTE[0]);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const save = () => {
    if (!name.trim()) return;
    add({
      catalogId: "custom",
      name: name.trim(),
      number: number.trim() || undefined,
      custom: { bg, label: name.trim() },
    });
    onSaved?.();
    onClose();
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
        className={`absolute inset-x-0 bottom-0 mx-auto flex max-w-md flex-col rounded-t-2xl bg-[#1c1c1e] transition-transform ${
          open ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ height: "92dvh", paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="grid grid-cols-3 items-center px-4 py-3">
          <button onClick={onClose} aria-label={t("common.close")}>
            <X />
          </button>
          <h2 className="text-center text-base font-semibold">
            {t("custom.title")}
          </h2>
          <button
            onClick={save}
            disabled={!name.trim()}
            className="text-right text-sm font-semibold text-white disabled:text-muted"
          >
            {t("detail.save")}
          </button>
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10">
          <div className="mx-auto mt-4 w-full max-w-xs">
            <CardTile
              card={{
                bg,
                label: name.trim() || t("custom.preview_default"),
                style: "wordmark",
              }}
              size="lg"
            />
          </div>

          <div className="mt-6 space-y-3">
            <label className="block rounded-xl bg-[#2c2c2e] px-3 py-2.5">
              <span className="block text-[11px] uppercase tracking-wide text-muted">
                {t("field.name")}
              </span>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("custom.name_placeholder")}
                className="mt-1 w-full bg-transparent text-sm placeholder:text-muted focus:outline-none"
              />
            </label>
            <label className="block rounded-xl bg-[#2c2c2e] px-3 py-2.5">
              <span className="block text-[11px] uppercase tracking-wide text-muted">
                {t("field.number_optional")}
              </span>
              <input
                value={number}
                onChange={(e) => setNumber(e.target.value.replace(/\D+/g, ""))}
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={t("field.number_placeholder")}
                className="mt-1 w-full bg-transparent text-sm placeholder:text-muted focus:outline-none"
              />
            </label>

            <div className="rounded-xl bg-[#2c2c2e] px-3 py-3">
              <span className="mb-2 block text-[11px] uppercase tracking-wide text-muted">
                {t("custom.color")}
              </span>
              <div className="flex flex-wrap gap-2">
                {PALETTE.map((c) => (
                  <button
                    key={c}
                    onClick={() => setBg(c)}
                    aria-label={t("custom.color_aria", { hex: c })}
                    className={`h-8 w-8 rounded-full ring-offset-2 ring-offset-[#2c2c2e] ${
                      bg === c ? "ring-2 ring-white" : ""
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
