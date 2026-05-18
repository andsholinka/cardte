"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { useT } from "@/lib/i18n";
import { toast } from "@/components/Toast";
import {
  hasPin,
  setPin,
  clearPin,
  verifyPin,
  registerBiometric,
  isPlatformAuthenticatorAvailable,
  hasBiometric,
  disableBiometric,
} from "@/lib/lock";

const PIN_MIN = 6;
const PIN_MAX = 6;

export default function LockSetupPage() {
  const { t } = useT();
  const router = useRouter();

  const [enabled, setEnabled] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);
  const [bioOn, setBioOn] = useState(false);

  const [pin, setPinValue] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    setEnabled(hasPin());
    setBioOn(hasBiometric());
    void isPlatformAuthenticatorAvailable().then(setBioAvailable);
  }, []);

  const onlyDigits = (s: string) => s.replace(/\D/g, "").slice(0, 6);

  /* ---------- enable flow ---------- */
  const enableLock = async (withBio: boolean) => {
    setErr(null);
    if (pin.length < PIN_MIN) {
      setErr(t("lock.pin_too_short"));
      return;
    }
    if (pin !== confirm) {
      setErr(t("lock.pin_mismatch"));
      return;
    }
    setBusy(true);
    await setPin(pin);

    if (withBio) {
      const ok = await registerBiometric();
      if (!ok) {
        setBusy(false);
        setErr(t("lock.bio_failed"));
        // PIN is already saved, allow user to retry biometric or leave PIN-only.
        setEnabled(true);
        return;
      }
      setBioOn(true);
    }

    setBusy(false);
    setEnabled(true);
    setPinValue("");
    setConfirm("");
    toast(t("lock.enabled"));
  };

  /* ---------- disable flow ---------- */
  const [disablePin, setDisablePin] = useState("");
  const [disableErr, setDisableErr] = useState<string | null>(null);

  const disableLock = async () => {
    setDisableErr(null);
    if (disablePin.length < PIN_MIN) {
      setDisableErr(t("lock.pin_too_short"));
      return;
    }
    setBusy(true);
    const ok = await verifyPin(disablePin);
    setBusy(false);
    if (!ok) {
      setDisableErr(t("lock.wrong_pin"));
      return;
    }
    clearPin();
    disableBiometric();
    setEnabled(false);
    setBioOn(false);
    setDisablePin("");
    toast(t("lock.disabled"));
  };

  /* ---------- toggle bio on already-enabled lock ---------- */
  const toggleBio = async () => {
    if (bioOn) {
      disableBiometric();
      setBioOn(false);
      return;
    }
    setBusy(true);
    const ok = await registerBiometric();
    setBusy(false);
    if (ok) {
      setBioOn(true);
      toast(t("lock.enabled"));
    } else {
      toast(t("lock.bio_failed"));
    }
  };

  return (
    <main
      className="ambient-bg relative min-h-[100dvh] pb-24"
      style={{ paddingTop: "calc(env(safe-area-inset-top) + 8px)" }}
    >
      {/* Top bar */}
      <header className="relative z-10 flex items-center px-4 py-2">
        <button
          onClick={() => router.back()}
          aria-label="Back"
          className="flex h-10 w-10 items-center justify-center rounded-full text-white/90 active:bg-white/5"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="absolute left-1/2 -translate-x-1/2 text-base font-semibold tracking-tight">
          {t("lock.setup_title")}
        </h1>
      </header>

      <section className="relative z-10 px-6 pt-2">
        <p className="text-[13px] leading-relaxed text-white/60">
          {t("lock.setup_body")}
        </p>
      </section>

      {!enabled ? (
        /* ---------------- ENABLE FORM ---------------- */
        <section className="relative z-10 px-6 pt-6">
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("lock.pin_placeholder")}
            value={pin}
            onChange={(e) => setPinValue(onlyDigits(e.target.value))}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base tracking-[0.4em] text-white placeholder:tracking-normal placeholder:text-white/30 outline-none focus:border-white/30"
          />
          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("lock.confirm_label")}
            value={confirm}
            onChange={(e) => setConfirm(onlyDigits(e.target.value))}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base tracking-[0.4em] text-white placeholder:tracking-normal placeholder:text-white/30 outline-none focus:border-white/30"
          />

          {err && (
            <p className="mt-3 text-center text-[12px] text-red-400">{err}</p>
          )}

          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              type="button"
              disabled={busy || pin.length < PIN_MIN}
              onClick={() => enableLock(bioAvailable)}
              className="rounded-full bg-white px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-black transition active:scale-95 disabled:opacity-40"
            >
              {bioAvailable
                ? t("lock.enable_biometric")
                : t("lock.enable_pin_only")}
            </button>
            {!bioAvailable && (
              <p className="text-center text-[11px] text-white/40">
                {t("lock.bio_unsupported")}
              </p>
            )}
          </div>
        </section>
      ) : (
        /* ---------------- ALREADY ENABLED ---------------- */
        <section className="relative z-10 px-6 pt-6">
          {bioAvailable && (
            <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5">
              <div>
                <p className="text-[15px]">{t("lock.use_biometric")}</p>
                <p className="text-[12px] text-white/40">
                  {bioOn ? t("adv.lock_state_on") : t("adv.lock_state_off")}
                </p>
              </div>
              <button
                type="button"
                onClick={toggleBio}
                disabled={busy}
                className={`relative h-7 w-12 rounded-full transition ${
                  bioOn ? "bg-white" : "bg-white/15"
                }`}
                aria-label="Toggle biometrics"
              >
                <span
                  className={`absolute top-0.5 h-6 w-6 rounded-full transition ${
                    bioOn
                      ? "left-[22px] bg-black"
                      : "left-0.5 bg-white"
                  }`}
                />
              </button>
            </div>
          )}

          <p className="mt-2 text-[13px] text-white/60">
            {t("lock.disable_confirm")}
          </p>

          <input
            type="password"
            inputMode="numeric"
            autoComplete="off"
            placeholder={t("lock.pin_placeholder")}
            value={disablePin}
            onChange={(e) => setDisablePin(onlyDigits(e.target.value))}
            className="mt-3 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-base tracking-[0.4em] text-white placeholder:tracking-normal placeholder:text-white/30 outline-none focus:border-white/30"
          />

          {disableErr && (
            <p className="mt-3 text-center text-[12px] text-red-400">
              {disableErr}
            </p>
          )}

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={disableLock}
              disabled={busy || disablePin.length < PIN_MIN}
              className="rounded-full border border-red-500/40 bg-red-500/10 px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-red-300 transition active:scale-95 disabled:opacity-40"
            >
              {t("lock.disable")}
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
