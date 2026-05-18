"use client";

import { useEffect, useState, useCallback } from "react";

/* ----------------------------- storage keys ----------------------------- */

const KEY_PIN = "cardte:lock:pin:v1"; // { salt, hash }
const KEY_WEBAUTHN = "cardte:lock:webauthn:v1"; // { credId: base64url }
const KEY_LAST_ACTIVE = "cardte:lock:last_active:v1"; // number (ms)
const KEY_AUTOLOCK = "cardte:lock:autolock:v1"; // seconds (0 = immediate, default 30s)
const KEY_SORT = "cardte:sort:v1"; // "name" | "recent"

/** Maximum idle time (ms) before app is considered locked again. */
const DEFAULT_AUTOLOCK_S = 30;

/* ----------------------------- types ----------------------------- */

export type SortMode = "name" | "recent";
export type LayoutMode = "grid" | "stack";

type PinRecord = { salt: string; hash: string };
type WebAuthnRecord = { credId: string };

/* ----------------------------- utils ----------------------------- */

function bufToB64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let bin = "";
  for (let i = 0; i < bytes.byteLength; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64UrlToBuf(s: string): ArrayBuffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes.buffer;
}

function randomSalt(): string {
  const a = new Uint8Array(16);
  crypto.getRandomValues(a);
  return bufToB64Url(a.buffer);
}

async function hashPin(pin: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`${salt}:${pin}`);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return bufToB64Url(buf);
}

/* ----------------------------- PIN API ----------------------------- */

export function hasPin(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(KEY_PIN);
}

export async function setPin(pin: string): Promise<void> {
  const salt = randomSalt();
  const hash = await hashPin(pin, salt);
  const rec: PinRecord = { salt, hash };
  localStorage.setItem(KEY_PIN, JSON.stringify(rec));
}

export async function verifyPin(pin: string): Promise<boolean> {
  const raw = localStorage.getItem(KEY_PIN);
  if (!raw) return false;
  try {
    const rec: PinRecord = JSON.parse(raw);
    const hash = await hashPin(pin, rec.salt);
    return hash === rec.hash;
  } catch {
    return false;
  }
}

export function clearPin(): void {
  localStorage.removeItem(KEY_PIN);
  localStorage.removeItem(KEY_WEBAUTHN);
}

/* ----------------------------- WebAuthn API ----------------------------- */

export function isWebAuthnSupported(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window.PublicKeyCredential && navigator.credentials);
}

export async function isPlatformAuthenticatorAvailable(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  } catch {
    return false;
  }
}

export function hasBiometric(): boolean {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem(KEY_WEBAUTHN);
}

/**
 * Register a platform authenticator (Face ID / Touch ID / Windows Hello).
 * Returns true on success.
 */
export async function registerBiometric(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  try {
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);
    const userId = new Uint8Array(16);
    crypto.getRandomValues(userId);

    const cred = (await navigator.credentials.create({
      publicKey: {
        challenge,
        rp: { name: "Cardte", id: window.location.hostname },
        user: {
          id: userId,
          name: "cardte-user",
          displayName: "Cardte",
        },
        pubKeyCredParams: [
          { type: "public-key", alg: -7 },
          { type: "public-key", alg: -257 },
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred",
        },
        timeout: 60_000,
        attestation: "none",
      },
    })) as PublicKeyCredential | null;

    if (!cred) return false;
    const rec: WebAuthnRecord = { credId: bufToB64Url(cred.rawId) };
    localStorage.setItem(KEY_WEBAUTHN, JSON.stringify(rec));
    return true;
  } catch {
    return false;
  }
}

/**
 * Verify with the registered platform authenticator. Returns true on success.
 */
export async function verifyBiometric(): Promise<boolean> {
  if (!isWebAuthnSupported()) return false;
  const raw = localStorage.getItem(KEY_WEBAUTHN);
  if (!raw) return false;
  try {
    const rec: WebAuthnRecord = JSON.parse(raw);
    const challenge = new Uint8Array(32);
    crypto.getRandomValues(challenge);

    const assertion = (await navigator.credentials.get({
      publicKey: {
        challenge,
        allowCredentials: [
          {
            id: b64UrlToBuf(rec.credId),
            type: "public-key",
            transports: ["internal"],
          },
        ],
        userVerification: "required",
        timeout: 60_000,
      },
    })) as PublicKeyCredential | null;

    return !!assertion;
  } catch {
    return false;
  }
}

export function disableBiometric(): void {
  localStorage.removeItem(KEY_WEBAUTHN);
}

/* ----------------------------- Auto-lock state ----------------------------- */

export function getAutolockSeconds(): number {
  if (typeof window === "undefined") return DEFAULT_AUTOLOCK_S;
  const raw = localStorage.getItem(KEY_AUTOLOCK);
  if (!raw) return DEFAULT_AUTOLOCK_S;
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 ? n : DEFAULT_AUTOLOCK_S;
}

export function setAutolockSeconds(s: number): void {
  localStorage.setItem(KEY_AUTOLOCK, String(s));
}

function markActive() {
  try {
    localStorage.setItem(KEY_LAST_ACTIVE, String(Date.now()));
  } catch {
    /* ignore */
  }
}

function shouldLockNow(): boolean {
  if (!hasPin()) return false;
  const raw = localStorage.getItem(KEY_LAST_ACTIVE);
  if (!raw) return true;
  const last = parseInt(raw, 10);
  if (!Number.isFinite(last)) return true;
  const idle = Date.now() - last;
  return idle >= getAutolockSeconds() * 1000;
}

/* ----------------------------- Hooks ----------------------------- */

/**
 * Hook that drives the lock screen. Returns whether the app is currently
 * locked, plus an unlock callback.
 */
export function useAppLock() {
  const [locked, setLocked] = useState<boolean>(() => {
    // SSR safe initial value
    if (typeof window === "undefined") return false;
    return hasPin() && shouldLockNow();
  });

  // Re-evaluate after mount (handles cases where SSR returned false).
  useEffect(() => {
    if (hasPin() && shouldLockNow()) setLocked(true);
  }, []);

  // Track activity / visibility.
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        markActive(); // mark the moment we left
      } else {
        // returning to the app
        if (hasPin() && shouldLockNow()) setLocked(true);
        else markActive();
      }
    };
    const onPageHide = () => markActive();

    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    window.addEventListener("focus", onHide);

    // Periodically refresh "last active" while app is open.
    const tick = window.setInterval(() => {
      if (document.visibilityState === "visible") markActive();
    }, 5000);

    return () => {
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      window.removeEventListener("focus", onHide);
      window.clearInterval(tick);
    };
  }, []);

  const unlock = useCallback(() => {
    markActive();
    setLocked(false);
  }, []);

  // Re-lock helper used by Settings ("lock now" or after enabling).
  const lock = useCallback(() => {
    if (hasPin()) setLocked(true);
  }, []);

  return { locked, unlock, lock };
}

/* ----------------------------- Sort ----------------------------- */

export function getSortMode(): SortMode {
  if (typeof window === "undefined") return "recent";
  const raw = localStorage.getItem(KEY_SORT);
  return raw === "name" || raw === "recent" ? raw : "recent";
}

export function setSortMode(m: SortMode): void {
  localStorage.setItem(KEY_SORT, m);
  window.dispatchEvent(new CustomEvent("cardte:sort"));
}

export function useSortMode(): [SortMode, (m: SortMode) => void] {
  const [mode, setMode] = useState<SortMode>("recent");
  useEffect(() => {
    setMode(getSortMode());
    const onChange = () => setMode(getSortMode());
    window.addEventListener("cardte:sort", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cardte:sort", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const update = useCallback((m: SortMode) => {
    setSortMode(m);
    setMode(m);
  }, []);
  return [mode, update];
}

/* ----------------------------- Layout ----------------------------- */

const KEY_LAYOUT = "cardte:layout:v1";

export function getLayoutMode(): LayoutMode {
  if (typeof window === "undefined") return "grid";
  const raw = localStorage.getItem(KEY_LAYOUT);
  return raw === "grid" || raw === "stack" ? raw : "grid";
}

export function setLayoutMode(m: LayoutMode): void {
  localStorage.setItem(KEY_LAYOUT, m);
  window.dispatchEvent(new CustomEvent("cardte:layout"));
}

export function useLayoutMode(): [LayoutMode, (m: LayoutMode) => void] {
  const [mode, setMode] = useState<LayoutMode>("grid");
  useEffect(() => {
    setMode(getLayoutMode());
    const onChange = () => setMode(getLayoutMode());
    window.addEventListener("cardte:layout", onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener("cardte:layout", onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  const update = useCallback((m: LayoutMode) => {
    setLayoutMode(m);
    setMode(m);
  }, []);
  return [mode, update];
}
