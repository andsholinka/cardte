"use client";

import { useEffect, useState } from "react";
import { X, RotateCw } from "lucide-react";
import { Barcode } from "./Barcode";
import { useT } from "@/lib/i18n";

type Props = {
  open: boolean;
  value: string;
  format?: string;
  /** Card display name shown above the barcode. */
  title?: string;
  onClose: () => void;
};

/**
 * Full-screen, high-contrast barcode for a cashier scanner.
 * - Forces the wallpaper white and pumps brightness perception via pure white bg.
 * - Holds a screen wake-lock so the screen doesn't dim while scanning.
 * - User can tap "Rotate" to toggle landscape (90° rotation in software,
 *   useful when the cashier scanner expects a horizontal long code).
 */
export function BarcodePresenter({
  open,
  value,
  format,
  title,
  onClose,
}: Props) {
  const { t } = useT();
  const [rotated, setRotated] = useState(false);
  const [wakelockOk, setWakelockOk] = useState<boolean>(true);

  // Disable scrolling under the overlay
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Wake lock to keep the screen on during scanning.
  useEffect(() => {
    if (!open) return;
    let lock: any = null;
    let cancelled = false;

    const acquire = async () => {
      const nav: any = navigator;
      if (!nav.wakeLock || typeof nav.wakeLock.request !== "function") {
        setWakelockOk(false);
        return;
      }
      try {
        lock = await nav.wakeLock.request("screen");
        if (cancelled && lock) {
          lock.release?.();
          lock = null;
        }
      } catch {
        setWakelockOk(false);
      }
    };

    void acquire();

    const onVis = () => {
      if (document.visibilityState === "visible" && open) void acquire();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVis);
      if (lock) {
        try {
          lock.release?.();
        } catch {
          /* ignore */
        }
      }
    };
  }, [open]);

  if (!open || !value) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex flex-col bg-white"
      role="dialog"
      aria-modal="true"
    >
      {/* top bar */}
      <header
        className="relative flex items-center justify-between px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
      >
        <button
          onClick={onClose}
          aria-label={t("barcode.present_close")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-black active:bg-black/5"
        >
          <X size={22} />
        </button>
        {title && (
          <p className="text-sm font-semibold tracking-tight text-black">
            {title}
          </p>
        )}
        <button
          onClick={() => setRotated((v) => !v)}
          aria-label={t("barcode.present_rotate")}
          className="flex h-10 w-10 items-center justify-center rounded-full text-black active:bg-black/5"
        >
          <RotateCw size={20} />
        </button>
      </header>

      {/* barcode area */}
      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6">
        <div
          className="flex w-full max-w-[640px] items-center justify-center transition-transform"
          style={{
            transform: rotated ? "rotate(90deg) scale(1.6)" : "none",
          }}
        >
          <Barcode
            value={value}
            format={format}
            scale={5}
            height={36}
            includeText
            className="!p-0 !bg-white shadow-none"
          />
        </div>
      </div>

      {/* footer */}
      <footer
        className="px-6 text-center text-[12px] text-black/50"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 16px)" }}
      >
        <p className="break-all font-mono text-[14px] text-black">{value}</p>
        {!wakelockOk && (
          <p className="mt-2 text-[11px] text-black/40">
            {t("barcode.no_wakelock")}
          </p>
        )}
      </footer>
    </div>
  );
}
