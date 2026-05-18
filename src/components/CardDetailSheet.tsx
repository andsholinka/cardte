"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { SavedCard, useSavedCards } from "@/lib/storage";
import { findCatalog } from "@/data/catalog";
import { CardTile } from "./CardTile";
import { copyText } from "@/lib/clipboard";
import { toast } from "./Toast";
import { Copy, Pencil, Trash2, X, Check, EyeOff, Maximize2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { Barcode } from "./Barcode";

const BarcodePresenter = dynamic(
  () =>
    import("./BarcodePresenter").then((m) => m.BarcodePresenter),
  { ssr: false }
);

type Props = {
  open: boolean;
  card: SavedCard | null;
  onClose: () => void;
  initialEdit?: boolean;
};

export function CardDetailSheet({ open, card, onClose, initialEdit }: Props) {
  const { t } = useT();
  const { update, remove, add } = useSavedCards();
  const [editing, setEditing] = useState(false);

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [holder, setHolder] = useState("");
  const [note, setNote] = useState("");
  const [isHero, setIsHero] = useState(false);
  const [hideBarcode, setHideBarcode] = useState(false);
  const [presenterOpen, setPresenterOpen] = useState(false);

  useEffect(() => {
    if (card) {
      const catalog = findCatalog(card.catalogId);
      const isBank = catalog?.category === "bank";
      setName(card.name);
      setNumber(card.number ?? "");
      setHolder(card.holder ?? "");
      setNote(card.note ?? "");
      setIsHero(card.isHero ?? false);
      // Bank cards default to hideBarcode=true for new cards
      setHideBarcode(
        card.hideBarcode ?? (card.uid === "NEW_CARD" && isBank ? true : false)
      );
      setEditing(!!initialEdit);
    }
  }, [card, initialEdit]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!card) return null;

  const catalog = findCatalog(card.catalogId);
  const tile = catalog ?? {
    bg: card.custom?.bg ?? "#2c2c2e",
    fg: card.custom?.fg,
    label: card.custom?.label ?? card.name,
    style: "wordmark" as const,
    sub: undefined,
  };

  const onCopy = async () => {
    if (!card.number) {
      toast(t("toast.no_number"));
      return;
    }
    const ok = await copyText(card.number);
    toast(ok ? t("toast.copied", { name: card.name }) : t("toast.copy_failed"));
  };

  const save = () => {
    if (!card) return;
    if (card.uid === "NEW_CARD") {
      add({
        catalogId: card.catalogId,
        name: name.trim() || card.name,
        number: number.trim(),
        holder: holder.trim(),
        note: note.trim(),
        isHero,
        hideBarcode,
        barcode: card.barcode,
        barcodeFormat: card.barcodeFormat,
        custom: card.custom,
      });
    } else {
      update(card.uid, {
        name: name.trim() || card.name,
        number: number.trim(),
        holder: holder.trim(),
        note: note.trim(),
        isHero,
        hideBarcode,
      });
    }
    onClose();
    toast(t("toast.saved"));
  };

  const onDelete = () => {
    if (confirm(t("detail.delete_confirm"))) {
      remove(card.uid);
      onClose();
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
            {editing ? t("detail.edit_title") : card.name}
          </h2>
          {editing ? (
            <button
              onClick={save}
              className="flex items-center justify-end gap-1 text-right text-sm font-semibold"
            >
              <Check size={16} /> {t("detail.save")}
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-end gap-1 text-right text-sm font-medium text-muted active:text-white"
              aria-label={t("detail.edit")}
            >
              <Pencil size={16} /> {t("detail.edit")}
            </button>
          )}
        </div>

        <div className="no-scrollbar flex-1 overflow-y-auto px-4 pb-10">
          {!editing ? (
            <ViewMode
              tile={tile}
              card={card}
              onCopy={onCopy}
              onPresent={() => setPresenterOpen(true)}
            />
          ) : (
            <EditMode
              tile={tile}
              card={card}
              name={name}
              number={number}
              holder={holder}
              note={note}
              isHero={isHero}
              hideBarcode={hideBarcode}
              setName={setName}
              setNumber={setNumber}
              setHolder={setHolder}
              setNote={setNote}
              setIsHero={setIsHero}
              setHideBarcode={setHideBarcode}
              onDelete={onDelete}
              isNew={card.uid === "NEW_CARD"}
            />
          )}
        </div>
      </div>

      <BarcodePresenter
        open={presenterOpen}
        value={card.barcode || card.number || ""}
        format={card.barcodeFormat}
        title={card.name}
        onClose={() => setPresenterOpen(false)}
      />
    </div>
  );
}

function ViewMode({
  tile,
  card,
  onCopy,
  onPresent,
}: {
  tile: any;
  card: SavedCard;
  onCopy: () => void;
  onPresent: () => void;
}) {
  const { t } = useT();
  const showBarcode =
    !card.hideBarcode && !!(card.barcode || card.number);

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-xs">
        <CardTile card={tile} size="lg" />
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="mt-4 block w-full rounded-2xl bg-[#1f1f21] p-5 text-left active:bg-[#26262a]"
      >
        <div className="mb-3">
          <CompactLogo tile={tile} />
        </div>

        <p className="font-mono text-2xl font-bold tracking-wide">
          {card.number || "——————"}
        </p>

        {card.holder && (
          <p className="mt-1 text-sm text-muted">
            {t("hero.holder_prefix")} {card.holder}
          </p>
        )}

        <span className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wider">
          <Copy size={14} /> {t("hero.copy")}
        </span>
      </button>

      {showBarcode && (
        <div className="mx-auto mt-4 w-full max-w-xs">
          <button
            type="button"
            onClick={onPresent}
            className="group relative block w-full overflow-hidden rounded-xl bg-white shadow-lg transition active:scale-[0.99]"
            aria-label={t("barcode.tap_hint")}
          >
            <Barcode
              value={card.barcode || card.number || ""}
              format={card.barcodeFormat}
              includeText
              className="!shadow-none"
            />
            <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white">
              <Maximize2 size={14} />
            </span>
          </button>
          <p className="mt-2 text-center text-[11px] text-white/40">
            {t("barcode.tap_hint")}
          </p>
        </div>
      )}

      {card.note && (
        <div className="mt-4 rounded-2xl bg-[#1f1f21] p-4">
          <span className="block text-[11px] uppercase tracking-wide text-muted">
            {t("field.note")}
          </span>
          <p className="mt-1 whitespace-pre-wrap text-sm">{card.note}</p>
        </div>
      )}

      <p className="mt-6 text-center text-xs text-muted">
        {t("detail.copy_hint")}
      </p>
    </>
  );
}

function EditMode(props: {
  tile: any;
  card: SavedCard;
  name: string;
  number: string;
  holder: string;
  note: string;
  isHero: boolean;
  hideBarcode: boolean;
  setName: (v: string) => void;
  setNumber: (v: string) => void;
  setHolder: (v: string) => void;
  setNote: (v: string) => void;
  setIsHero: (v: boolean) => void;
  setHideBarcode: (v: boolean) => void;
  onDelete: () => void;
  isNew?: boolean;
}) {
  const { t } = useT();
  const {
    tile,
    card,
    name,
    number,
    holder,
    note,
    isHero,
    hideBarcode,
    setName,
    setNumber,
    setHolder,
    setNote,
    setIsHero,
    setHideBarcode,
    onDelete,
    isNew,
  } = props;

  const hasBarcode = !!(card.barcode || number);

  return (
    <>
      <div className="mx-auto mt-4 w-full max-w-xs">
        <CardTile card={tile} size="lg" />
      </div>

      <div className="mt-8 space-y-4">
        <Field label={t("field.name")}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-transparent text-base font-medium text-white placeholder:text-white/30 focus:outline-none"
          />
        </Field>
        <Field label={t("field.number")}>
          <input
            value={number}
            onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            inputMode="numeric"
            pattern="[0-9]*"
            placeholder={t("field.number_placeholder")}
            className="w-full bg-transparent text-base font-medium text-white placeholder:text-white/30 focus:outline-none"
          />
        </Field>
        <Field label={t("field.holder")}>
          <input
            value={holder}
            onChange={(e) => setHolder(e.target.value)}
            placeholder={t("field.holder_placeholder")}
            className="w-full bg-transparent text-base font-medium text-white placeholder:text-white/30 focus:outline-none"
          />
        </Field>
        <Field label={t("field.note")}>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder={t("field.note_placeholder")}
            className="w-full resize-none bg-transparent text-base font-medium text-white placeholder:text-white/30 focus:outline-none"
          />
        </Field>

        <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4 transition-colors focus-within:border-white/20">
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-wide text-white/90">{t("hero.toggle_title")}</span>
            <span className="text-[11px] text-white/50">{t("hero.toggle_caption")}</span>
          </div>
          <button
            onClick={() => setIsHero(!isHero)}
            className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
              isHero ? "bg-white" : "bg-white/20"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                isHero ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {hasBarcode && (
          <div className="flex items-center justify-between rounded-2xl border border-white/[0.08] bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5">
                <EyeOff size={16} />
              </span>
              <div className="flex flex-col">
                <span className="text-sm font-bold tracking-wide text-white/90">
                  {t("barcode.hide_label")}
                </span>
                <span className="text-[11px] text-white/50">
                  {t("barcode.hide_caption")}
                </span>
              </div>
            </div>
            <button
              onClick={() => setHideBarcode(!hideBarcode)}
              className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                hideBarcode ? "bg-white" : "bg-white/20"
              }`}
              aria-label={t("barcode.hide_label")}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-black transition-transform ${
                  hideBarcode ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        )}
      </div>

      {!isNew && (
        <button
          onClick={onDelete}
          className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 py-3.5 text-sm font-bold text-red-400 transition active:scale-95 active:bg-red-500/20"
        >
          <Trash2 size={16} strokeWidth={2.5} /> {t("detail.delete")}
        </button>
      )}
    </>
  );
}

function CompactLogo({ tile }: { tile: any }) {
  return (
    <div className="inline-flex h-8 max-w-[180px] items-center overflow-hidden rounded-md">
      {tile.logo ? (
        <div
          className="flex h-8 w-full items-center justify-center px-3"
          style={{ backgroundColor: tile.bg }}
        >
          <img
            src={tile.logo}
            alt={tile.label}
            className={`h-full w-full max-h-[65%] max-w-[80%] object-contain drop-shadow-sm ${
              tile.logoWhite ? "brightness-0 invert" : ""
            } ${tile.logoClass || ""}`}
          />
        </div>
      ) : (
        <div
          className="flex h-8 items-center justify-center px-2 text-sm font-extrabold tracking-tight"
          style={{ backgroundColor: tile.bg, color: tile.fg ?? "#fff" }}
        >
          {String(tile.label).split("\n").join(" ")}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 transition-colors focus-within:border-white/20 focus-within:bg-white/[0.08]">
      <span className="block text-[11px] font-bold uppercase tracking-wider text-white/50">
        {label}
      </span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
