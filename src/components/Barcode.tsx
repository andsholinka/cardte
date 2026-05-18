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
  // Numeric-only checks
  if (/^\d+$/.test(v)) {
    if (v.length === 13) return "ean13";
    if (v.length === 12) return "upca";
    if (v.length === 8) return "ean8";
    if (v.length === 6) return "upce";
    if (v.length % 2 === 0) return "interleaved2of5";
    return "code128";
  }
  // CODE39 charset (uppercase + a few symbols)
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
  /** Saved BarcodeDetector format (e.g. "code_128"). Optional. */
  format?: string;
  className?: string;
  /** Pixel scale passed to bwip-js. Higher = sharper. */
  scale?: number;
  /** Bar height for 1D codes. */
  height?: number;
  /** Show human-readable text under the bars. */
  includeText?: boolean;
};

/**
 * Renders a real, scannable barcode into a <canvas>. Falls back to a
 * styled placeholder if the value can't be encoded with the chosen
 * symbology (e.g. EAN-13 expects exactly 13 digits).
 */
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
      // Lazy import keeps the 250kB encoder out of the home page bundle.
      const mod = await import("bwip-js/browser");
      if (cancelled) return;
      const bwipjs = (mod as any).default ?? mod;

      const detected = format ? FORMAT_MAP[format] : undefined;
      const candidates = [
        detected,
        guessBcid(value),
        "code128", // last-resort, accepts almost anything
      ].filter(Boolean) as string[];

      let lastErr: unknown = null;
      let rendered = false;
      for (const bcid of candidates) {
        try {
          bwipjs.toCanvas(canvas, {
            bcid,
            text: value,
            scale,
            height: is2D(bcid) ? 30 : height,
            width: is2D(bcid) ? 30 : undefined,
            includetext: includeText && !is2D(bcid),
            textxalign: "center",
            backgroundcolor: "FFFFFF",
            paddingwidth: 6,
            paddingheight: 6,
          });
          rendered = true;
          setError(null);
          break;
        } catch (e) {
          lastErr = e;
        }
      }
      if (!rendered && !cancelled) {
        setError(lastErr instanceof Error ? lastErr.message : "render failed");
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
        <p className="mt-1 text-[11px] text-red-500">Unable to render barcode</p>
      )}
    </div>
  );
}
