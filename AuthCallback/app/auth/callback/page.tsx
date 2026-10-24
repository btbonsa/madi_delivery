"use client";

import { useEffect, useSyncExternalStore } from "react";

type ConfirmationState =
  | { status: "checking" }
  | { status: "confirmed" }
  | { status: "error"; message: string };

const checking: ConfirmationState = { status: "checking" };
const subscribe = () => () => {};
let cachedLocation: string | null = null;
let cachedConfirmation: ConfirmationState = checking;

function getConfirmationState(): ConfirmationState {
  const currentUrl = new URL(window.location.href);
  const locationKey = `${currentUrl.pathname}${currentUrl.search}`;
  if (cachedLocation === locationKey) return cachedConfirmation;

  const params = new URLSearchParams(currentUrl.hash.slice(1));
  const errorDescription =
    params.get("error_description") ??
    currentUrl.searchParams.get("error_description");

  cachedLocation = locationKey;
  cachedConfirmation = errorDescription
    ? { status: "error", message: errorDescription }
    : params.has("access_token")
      ? { status: "confirmed" }
      : {
          status: "error",
          message:
            "This link may have expired or already been used. Return to LocalBite to sign in, or request a new confirmation email.",
        };
  return cachedConfirmation;
}

export default function AuthCallbackPage() {
  const confirmation = useSyncExternalStore(
    subscribe,
    getConfirmationState,
    () => checking,
  );

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(
        null,
        "",
        `${window.location.pathname}${window.location.search}`,
      );
    }
  }, []);

  return (
    <main className="page-shell">
      <section className="card" aria-live="polite">
        <div className="brand-mark" aria-hidden="true">
          {confirmation.status === "confirmed" ? "✓" : "🍲"}
        </div>
        <p className="eyebrow">LOCALBITE</p>
        {confirmation.status === "checking" ? (
          <>
            <h1>Checking your email link…</h1>
            <p className="description">Please wait a moment.</p>
          </>
        ) : confirmation.status === "confirmed" ? (
          <>
            <h1>Email confirmed</h1>
            <p className="description">
              Your email address is verified. You can return to the LocalBite
              app and sign in.
            </p>
            <p className="hint">You can close this page after returning to the app.</p>
          </>
        ) : (
          <>
            <h1>We couldn’t confirm this link</h1>
            <p className="description">{confirmation.message}</p>
            <p className="hint">
              For your security, confirmation tokens are removed from the browser address bar.
            </p>
          </>
        )}
      </section>
    </main>
  );
}
