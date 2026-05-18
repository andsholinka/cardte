"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { useT } from "@/lib/i18n";
import { CatalogCard } from "@/data/catalog";

declare global {
  interface Window {
    BarcodeDetector?: any;
  }
}

type ScanResult = {
  value: string;
  format?: string;
};

type Props = {
  open: boolean;
  card: CatalogCard | null;
  onClose: () => void;
  onResult: (r: ScanResult) => void;
  /** "Enter manually" → open detail sheet without barcode. */
  onManual: () => void;
};

const SUPPORTED_FORMATS = [
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "ean_13",
  "ean_8",
  "itf",
  "qr_code",
  "upc_a",
  "upc_e",
  "data_matrix",
  "pdf417",
  "aztec",
];

/**
 * Returns a BarcodeDetector instance — native if available, otherwise
 * the polyfill from `barcode-detector` (ZXing WASM).
 */
async function getDetector(): Promise<any> {
  if (typeof window !== "undefined" && "BarcodeDetector" in window) {
    try {
      return new window.BarcodeDetector!({ formats: SUPPORTED_FORMATS });
    } catch {
      /* fall through to polyfill */
    }
  }
  // Lazy-load the polyfill only when needed.
  const { BarcodeDetector: Polyfill } = await import("barcode-detector");
  return new Polyfill({ formats: SUPPORTED_FORMATS as any });
}

export function BarcodeScanSheet({
  open,
  card,
  onClose,
  onResult,
  onManual,
}: Props) {
  const { t } = useT();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const detectorRef = useRef<any>(null);
  const rafRef = useRef<number | null>(null);

  const [supported, setSupported] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  // ----- start / stop scanning -----
  useEffect(() => {
    if (!open || !card) return;
    let cancelled = false;

    const stop = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };

    const start = async () => {
      setError(null);
      setSupported(true);

      try {
        detectorRef.current = await getDetector();
      } catch {
        detectorRef.current = null;
        setSupported(false);
      }

      try {
        setStarting(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: "environment" },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => {});
        }
        setStarting(false);

        if (!detectorRef.current) return;

        const tick = async () => {
          if (cancelled || !videoRef.current || !detectorRef.current) return;
          if (videoRef.current.readyState >= 2) {
            try {
              const codes = await detectorRef.current.detect(videoRef.current);
              if (codes && codes.length > 0) {
                const first = codes[0];
                cancelled = true;
                stop();
                onResult({
                  value: String(first.rawValue ?? ""),
                  format: first.format,
                });
                return;
              }
            } catch {
              /* keep trying */
            }
          }
          rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      } catch {
        setStarting(false);
        setError(t("scan.camera_denied"));
      }
    };

    void start();
    return () => {
      cancelled = true;
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, card]);

  // ----- "Add from photo" -----
  const onPickPhoto = () => fileInputRef.current?.click();

  const onPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    try {
      const detector = detectorRef.current ?? (await getDetector());
      const bmp = await createImageBitmap(file);
      const codes = await detector.detect(bmp);
      if (typeof bmp.close === "function") bmp.close();
      if (codes && codes.length > 0) {
        onResult({
          value: String(codes[0].rawValue ?? ""),
          format: codes[0].format,
        });
        return;
      }
      setError(t("scan.no_code"));
    } catch {
      setError(t("scan.no_code"));
    }
  };

  if (!open || !card) return null;

  // Background pattern derived from the card color for visual flavor.
  const pattern = `radial-gradient(circle at 25% 30%, ${card.bg}33 0 18px, transparent 19px),
                   radial-gradient(circle at 75% 60%, ${card.bg}22 0 22px, transparent 23px),
                   radial-gradient(circle at 50% 90%, ${card.bg}26 0 14px, transparent 15px)`;

  return (
    <div
      className="fixed inset-0 z-[70] flex flex-col bg-black"
      role="dialog"
      aria-modal="true"
    >
      {/* tinted background */}
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundColor: "#000",
          backgroundImage: pattern,
          backgroundSize: "120px 120px, 160px 160px, 140px 140px",
        }}
      />

      {/* live camera preview behind decorations */}
      <video
        ref={videoRef}
        playsInline
        muted
        className="absolute inset-0 h-full w-full object-cover opacity-60"
      />
      <div className="pointer-events-none absolute inset-0 bg-black/40" />

      {/* top bar */}
      <header
        className="relative z-10 flex items-center px-4"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
      >
        <button
          onClick={onClose}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white active:bg-white/10"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold tracking-tight">
          {card.name}
        </h1>
      </header>

      {/* content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6 pb-10 pt-4">
        <div className="flex flex-col items-center pt-6 text-center">
          <p className="text-[15px] font-medium text-white">
            {t("scan.subtitle")}
          </p>
          <PhoneCheckIllustration />
        </div>

        {/* viewfinder */}
        <div className="relative w-full max-w-[320px]">
          <div className="aspect-[16/10] w-full rounded-3xl border border-white/70 bg-black/30">
            <div className="flex h-full w-full items-center justify-center">
              {starting ? (
                <Loader2 className="animate-spin text-white/70" size={28} />
              ) : (
                <div className="barcode-stripes h-14 w-[80%] opacity-90" />
              )}
            </div>
          </div>
          {!supported && (
            <p className="mt-3 text-center text-[12px] text-white/70">
              {t("scan.no_detector")}
            </p>
          )}
          {error && (
            <p className="mt-3 text-center text-[12px] text-red-300">
              {error}
            </p>
          )}
        </div>

        {/* fallbacks */}
        <div className="flex flex-col items-center gap-3">
          <p className="text-center text-[13px] text-white/70">
            {t("scan.cant_scan")}
          </p>
          <button
            type="button"
            onClick={onManual}
            className="rounded-full bg-white px-6 py-2.5 text-[14px] font-medium text-black transition active:scale-95"
          >
            {t("scan.enter_manually")}
          </button>
          <button
            type="button"
            onClick={onPickPhoto}
            className="text-[13px] font-medium text-white underline underline-offset-4 active:opacity-70"
          >
            {t("scan.add_from_photo")}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={onPhotoChange}
          />
        </div>
      </div>
    </div>
  );
}

function PhoneCheckIllustration() {
  return (
    <div className="mt-4 flex h-[120px] w-[72px] flex-col items-center justify-center rounded-[18px] border border-white/80 bg-black/30 shadow-[0_0_20px_rgba(255,255,255,0.05)]">
      <div className="mb-2 mt-1 h-1 w-6 rounded-full bg-white/80" />
      <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-white/90">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          className="text-white"
        >
          <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <div className="mt-2 h-1.5 w-1.5 rounded-full bg-white/90" />
    </div>
  );
}
