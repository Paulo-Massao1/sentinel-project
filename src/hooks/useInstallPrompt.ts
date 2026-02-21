import { useState, useEffect } from "react";

const DISMISS_KEY = "sentinel-install-dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/** Manages the PWA install prompt lifecycle (capture, display, dismiss). */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(() => {
    return localStorage.getItem(DISMISS_KEY) === "true";
  });

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const canInstall = deferredPrompt !== null && !dismissed;

  async function promptInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted" || outcome === "dismissed") {
      localStorage.setItem(DISMISS_KEY, "true");
      setDismissed(true);
    }
    setDeferredPrompt(null);
  }

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "true");
    setDismissed(true);
  }

  return { canInstall, promptInstall, dismiss };
}

const IOS_DISMISS_KEY = "sentinel-ios-hint-dismissed";

/** Detects iOS browsers and manages the "Add to Home Screen" hint. */
export function useIosInstallHint() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(IOS_DISMISS_KEY) === "true") return;

    const ua = navigator.userAgent;
    const isIos = /iPhone|iPad/.test(ua);
    const isStandalone = "standalone" in navigator && (navigator as Navigator & { standalone?: boolean }).standalone;

    if (isIos && !isStandalone) {
      setShow(true);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(IOS_DISMISS_KEY, "true");
    setShow(false);
  }

  return { showIosHint: show, dismissIosHint: dismiss };
}
