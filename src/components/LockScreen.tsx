"use client";

import { useEffect, useState, useCallback } from "react";
import { Lock, Fingerprint, Delete } from "lucide-react";
import { useT } from "@/lib/i18n";
import {
  hasBiometric,
  verifyBiometric,
  verifyPin,
  isWebAuthnSupported,
} from "@/lib/lock";

type Props = {
  onUnlock: () => void;
};

const PIN_MAX = 6;
const PIN_MIN = 6;

export function LockScreen({ onUnlock }: Props) {
  const { t } = useT();
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const bio = hasBiometric() && isWebAuthnSupported();

  const tryUnlockBio = useCallback(async () => {
    if (!bio || busy) return;
    setBusy(true);
    setError(null);
    const ok = await verifyBiometric();
    setBusy(false);
    if (ok) {
      onUnlock();
    } else {
      setError(t("lock.bio_failed"));
    }
  }, [bio, busy, onUnlock, t]);

  // Auto-prompt biometric on mount if registered.
  useEffect(() => {
    if (bio) tryUnlockBio();
    // run once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const submit = useCallback(
    async (value: string) => {
      if (busy) return;
      if (value.length < PIN_MIN) return;
      setBusy(true);
      const ok = await verifyPin(value);
      setBusy(false);
      if (ok) {
        onUnlock();
      } else {
        setError(t("lock.wrong_pin"));
        setShake(true);
        setPin("");
        window.setTimeout(() => setShake(false), 350);
      }
    },
    [busy, onUnlock, t]
  );

  const press = (d: string) => {
    setError(null);
    setPin((p) => {
      if (p.length >= PIN_MAX) return p;
      const next = p + d;
      if (next.length === 6) {
        void submit(next);
      }
      return next;
    });
  };

  const back = () => {
    setError(null);
    setPin((p) => p.slice(0, -1));
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black"
      style={{
        paddingTop: "calc(env(safe-area-inset-top) + 24px)",
        paddingBottom: "calc(env(safe-area-inset-bottom) + 24px)",
      }}
    >
      {/* ambient */}
      <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-white/[0.04] blur-3xl" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-between px-6">
        {/* top */}
        <div className="flex flex-col items-center pt-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
            <Lock size={26} strokeWidth={2} />
          </div>
          <h1 className="mt-4 text-lg font-semibold tracking-tight">
            {t("lock.unlock_title")}
          </h1>
          <p className="mt-1 text-center text-[13px] text-white/50">
            {t("lock.unlock_subtitle")}
          </p>
        </div>

        {/* dots */}
        <div className="flex flex-col items-center">
          <div
            className={`flex gap-3 ${shake ? "animate-[shake_0.35s_ease]" : ""}`}
          >
            {Array.from({ length: 6 }).map((_, i) => {
              const filled = i < pin.length;
              return (
                <span
                  key={i}
                  className={`h-2.5 w-2.5 rounded-full transition ${
                    filled ? "bg-white" : "bg-white/15"
                  }`}
                />
              );
            })}
          </div>
          <p
            className={`mt-3 h-4 text-[12px] ${
              error ? "text-red-400" : "text-transparent"
            }`}
          >
            {error ?? "."}
          </p>
        </div>

        {/* keypad */}
        <div className="w-full max-w-[280px]">
          <div className="grid grid-cols-3 gap-3">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
              <KeypadKey key={d} onPress={() => press(d)}>
                {d}
              </KeypadKey>
            ))}
            <button
              type="button"
              onClick={tryUnlockBio}
              disabled={!bio || busy}
              className="flex h-16 items-center justify-center rounded-2xl text-white/70 transition active:scale-95 disabled:opacity-25"
              aria-label={t("lock.use_biometric")}
            >
              <Fingerprint size={26} />
            </button>
            <KeypadKey onPress={() => press("0")}>0</KeypadKey>
            <button
              type="button"
              onClick={back}
              disabled={pin.length === 0}
              className="flex h-16 items-center justify-center rounded-2xl text-white/70 transition active:scale-95 disabled:opacity-25"
              aria-label="Backspace"
            >
              <Delete size={22} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

function KeypadKey({
  children,
  onPress,
}: {
  children: React.ReactNode;
  onPress: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-2xl font-light text-white transition active:scale-95 active:bg-white/10"
    >
      {children}
    </button>
  );
}
