"use client";

import { Plus } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type Pos = { x: number; y: number };
const STORAGE_KEY = "cardte:fab:pos";
const SIZE = 56;
const MARGIN = 12;
const NAV_RESERVE = 96; // ruang utk bottom nav (di-anchor dari bawah)

type Props = {
  onClick: () => void;
  ariaLabel?: string;
};

/**
 * Floating, draggable Add button. Posisinya di-persist ke localStorage.
 * Default: pojok kanan-bawah, melayang di atas semua konten (di bawah modal).
 */
export function FloatingAddButton({ onClick, ariaLabel }: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const [pos, setPos] = useState<Pos | null>(null);
  const drag = useRef<{
    startX: number;
    startY: number;
    origX: number;
    origY: number;
    moved: boolean;
    pointerId: number | null;
  } | null>(null);

  // Init position dari storage atau default kanan-bawah
  useEffect(() => {
    const init = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const p = JSON.parse(raw) as Pos;
          setPos(clampPos(p, vw, vh));
          return;
        }
      } catch {}
      setPos({
        x: vw - SIZE - MARGIN - 4,
        y: vh - SIZE - NAV_RESERVE - 24,
      });
    };
    init();
    const onResize = () => {
      setPos((p) =>
        p ? clampPos(p, window.innerWidth, window.innerHeight) : p
      );
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const onPointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!pos) return;
    const el = ref.current;
    if (!el) return;
    el.setPointerCapture(e.pointerId);
    drag.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: pos.x,
      origY: pos.y,
      moved: false,
      pointerId: e.pointerId,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    if (!d.moved && Math.hypot(dx, dy) > 6) {
      d.moved = true;
    }
    if (d.moved) {
      const next = clampPos(
        { x: d.origX + dx, y: d.origY + dy },
        window.innerWidth,
        window.innerHeight
      );
      setPos(next);
    }
  };

  const onPointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    const d = drag.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const wasDrag = d.moved;
    drag.current = null;
    try {
      ref.current?.releasePointerCapture(e.pointerId);
    } catch {}
    if (wasDrag) {
      // Snap ke sisi terdekat (kiri/kanan), tetap respect margin atas/bawah
      setPos((p) => {
        if (!p) return p;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        const snappedX =
          p.x + SIZE / 2 < vw / 2
            ? MARGIN + 4
            : vw - SIZE - MARGIN - 4;
        const snapped = clampPos({ x: snappedX, y: p.y }, vw, vh);
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(snapped));
        } catch {}
        return snapped;
      });
    } else {
      onClick();
    }
  };

  if (!pos) return null;

  return (
    <button
      ref={ref}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={ariaLabel ?? "Add"}
      className="fixed z-40 flex items-center justify-center rounded-full bg-gradient-to-br from-white to-white/75 text-black shadow-[0_18px_40px_-10px_rgba(255,255,255,0.35),0_8px_20px_-6px_rgba(0,0,0,0.6)] active:scale-95"
      style={{
        width: SIZE,
        height: SIZE,
        left: pos.x,
        top: pos.y,
        touchAction: "none",
        transition: drag.current ? "none" : "left 220ms ease, top 220ms ease",
      }}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 30% 25%, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0) 55%)",
          mixBlendMode: "screen",
        }}
      />
      <Plus size={26} strokeWidth={2.6} />
    </button>
  );
}

function clampPos(p: Pos, vw: number, vh: number): Pos {
  const minX = MARGIN;
  const minY = MARGIN + 8;
  const maxX = vw - SIZE - MARGIN;
  const maxY = vh - SIZE - MARGIN - NAV_RESERVE;
  return {
    x: Math.min(Math.max(p.x, minX), maxX),
    y: Math.min(Math.max(p.y, minY), Math.max(minY, maxY)),
  };
}
