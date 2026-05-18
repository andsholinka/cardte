"use client";

import { useEffect, useRef, useState } from "react";

/* ----------------------- format detection ----------------------- */

/** BarcodeDetector format string → bwip-js bcid */
const FORMAT_MAP: Record<string, string> = {
  code_128: "code128",
  code_39: "code39",
  code_93: "code93",
  codabar: "rationalizedCodabar",
  ean_13: "ean13",
  ean_8: "ean8",
  itf: "interleaved2of5",
  upc_a: "upca",
  upc_e: "upce",
  qr_code: "qrcode",
  data_matrix: "datamatrix",
  pdf417: "pdf417",
  aztec: "azteccode",
};

/** Heuristically guess a 1D format when none is stored. */
function guessBcid(value: string): string {
  const v = value.trim();
  if (!v) return "code128";
  if (/^\d+$/.test(v)) {
    if (v.length === 13) return "ean13";
    if (v.length === 12) return "upca";
    if (v.length === 8) return "ean8";
    return "code128";
  }
  if (/^[A-Z0-9\-. $/+%]+$/.test(v)) return "code39";
  return "code128";
}

/** Returns true for 2D symbologies which should render as a square. */
function is2D(bcid: string): boolean {
  return (
    bcid === "qrcode" ||
    bcid === "datamatrix" ||
    bcid === "azteccode" ||
    bcid === "pdf417"
  );
}

/* ----------------------- component ----------------------- */

type Props = {
  value: string;
  format?: string;
  className?: string;
  scale?: number;
  height?: number;
  includeText?: boolean;
};

export function Barcode({
  value,
  format,
  className,
  scale = 3,
  height = 18,
  includeText = false,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !value) return;
    let cancelled = false;

    const render = async () => {
      let toCanvas: ((canvas: HTMLCanvasElement, opts: any) => void) | null = null;
      try {
        const mod: any = await import("bwip-js/browser");
        // bwip-js exports both `toCanvas` named and as a property on the default
        if (typeof mod.toCanvas === "function") {
          toCanvas = mod.toCanvas;
        } else if (mod.default && typeof mod.default.toCanvas === "function") {
          toCanvas = mod.default.toCanvas;
        } else {
          throw new Error("bwip-js toCanvas not found in module shape");
        }
      } catch (e) {
        if (!cancelled) {
          setError("Failed to load barcode library");
          console.error("[Barcode] import failed", e);
        }
        return;
      }
      if (cancelled || !toCanvas) return;

      const detected = format ? FORMAT_MAP[format] : undefined;
      // Always end with code128 as the universal fallback
      const candidates = Array.from(
        new Set(
          [detected, guessBcid(value), "code128"].filter(Boolean) as string[]
        )
      );

      let lastErr: unknown = null;
      let rendered = false;

      for (const bcid of candidates) {
        try {
          const opts: Record<string, unknown> = {
            bcid,
            text: value,
            scale,
            includetext: includeText && !is2D(bcid),
            textxalign: "center",
            backgroundcolor: "FFFFFF",
          };
          if (is2D(bcid)) {
            opts.height = 30;
            opts.width = 30;
          } else {
            opts.height = height;
          }

          toCanvas(canvas, opts);
          rendered = true;
          if (!cancelled) setError(null);
          break;
        } catch (e) {
          lastErr = e;
          console.warn(`[Barcode] ${bcid} failed:`, e);
        }
      }
      if (!rendered && !cancelled) {
        const msg =
          lastErr instanceof Error ? lastErr.message : String(lastErr);
        setError(msg);
        console.error("[Barcode] all encoders failed for value:", value);
      }
    };

    void render();
    return () => {
      cancelled = true;
    };
  }, [value, format, scale, height, includeText]);

  if (!value) return null;

  return (
    <div
      className={
        "flex w-full flex-col items-center rounded-xl bg-white p-3 " +
        (className ?? "")
      }
    >
      <canvas ref={canvasRef} className="block max-w-full" />
      {error && (
        <p className="mt-1 text-[11px] text-red-500">
          Unable to render barcode
        </p>
      )}
    </div>
  );
}
