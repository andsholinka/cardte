"use client";

import { useEffect, useState } from "react";

let pushFn: ((msg: string) => void) | null = null;

export function toast(msg: string) {
  pushFn?.(msg);
}

export function ToastHost() {
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    pushFn = (m: string) => {
      setMsg(m);
      window.clearTimeout((pushFn as any)._t);
      (pushFn as any)._t = window.setTimeout(() => setMsg(null), 1800);
    };
    return () => {
      pushFn = null;
    };
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 z-[60] mx-auto flex max-w-md justify-center"
      style={{ bottom: "calc(env(safe-area-inset-bottom) + 88px)" }}
      aria-live="polite"
    >
      <div
        className={`pointer-events-none rounded-full bg-white/95 px-4 py-2 text-sm font-medium text-black shadow-xl transition-all duration-200 ${
          msg ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
        }`}
      >
        {msg ?? ""}
      </div>
    </div>
  );
}
