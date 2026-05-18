"use client";

import { useAppLock } from "@/lib/lock";
import { LockScreen } from "./LockScreen";

/**
 * Wraps the app and renders a full-screen LockScreen when the app is locked.
 * Children remain mounted underneath so state isn't lost.
 */
export function AppLockGate({ children }: { children: React.ReactNode }) {
  const { locked, unlock } = useAppLock();
  return (
    <>
      {children}
      {locked && <LockScreen onUnlock={unlock} />}
    </>
  );
}
