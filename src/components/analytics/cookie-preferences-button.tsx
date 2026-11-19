"use client";

import { OPEN_CONSENT_EVENT } from "@/lib/analytics";

export function CookiePreferencesButton() {
  return (
    <button
      type="button"
      className="inline-flex min-h-10 items-center text-left hover:text-fg"
      onClick={() => window.dispatchEvent(new CustomEvent(OPEN_CONSENT_EVENT))}
    >
      Preferências de cookies
    </button>
  );
}
