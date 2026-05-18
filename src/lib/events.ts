"use client";

/**
 * Global app events dispatched via window CustomEvent.
 * This avoids prop-drilling and page navigation for cross-page actions.
 */

const ADD_CARD_EVENT = "cardte:open-add-card";

export function emitOpenAddCard() {
  window.dispatchEvent(new CustomEvent(ADD_CARD_EVENT));
}

export function onOpenAddCard(cb: () => void): () => void {
  window.addEventListener(ADD_CARD_EVENT, cb);
  return () => window.removeEventListener(ADD_CARD_EVENT, cb);
}
