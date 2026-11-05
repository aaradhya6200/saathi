"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> };

type W = Window & { __saathiInstall?: InstallEvent | null };
let deferred: InstallEvent | null = null;
const listeners = new Set<() => void>();
if (typeof window !== "undefined") {
  // The root layout's inline script catches the event early and stores it here.
  deferred = (window as W).__saathiInstall ?? null;
  window.addEventListener("saathi-install", () => {
    deferred = (window as W).__saathiInstall ?? null;
    listeners.forEach((l) => l());
  });
  window.addEventListener("appinstalled", () => {
    deferred = null;
    listeners.forEach((l) => l());
  });
}

type Platform = "installed" | "inapp" | "android" | "ios" | "other";

function detect(): Platform {
  const standalone =
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true;
  if (standalone) return "installed";
  const ua = navigator.userAgent;
  // WhatsApp, Instagram, Facebook etc. open links in their own browser, which cannot install apps.
  if (/WhatsApp|Instagram|FBAN|FBAV|FB_IAB|Line\/|Snapchat|LinkedInApp|Twitter|; wv\)/i.test(ua)) return "inapp";
  if (/iPhone|iPad|iPod/.test(ua) || (ua.includes("Macintosh") && navigator.maxTouchPoints > 1)) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

/** Install state shared by the banner and the /app page. */
export function useInstall() {
  const [platform, setPlatform] = useState<Platform | null>(null);
  const [canPrompt, setCanPrompt] = useState(false);
  useEffect(() => {
    const update = () => {
      setPlatform(detect());
      setCanPrompt(!!deferred);
    };
    update();
    listeners.add(update);
    return () => void listeners.delete(update);
  }, []);
  async function install() {
    if (!deferred) return false;
    await deferred.prompt();
    const { outcome } = await deferred.userChoice;
    deferred = null;
    setCanPrompt(false);
    return outcome === "accepted";
  }
  return { platform, canPrompt, install };
}

/** Registers the service worker (offline screen + installability). */
export function ServiceWorker() {
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  return null;
}

const DISMISS_KEY = "saathi-install-dismissed-v2";

/** Small bar at the bottom of phone screens: "Get the Saathi app". */
export function InstallBanner() {
  const { platform, canPrompt, install } = useInstall();
  const [hidden, setHidden] = useState(true);
  useEffect(() => {
    let dismissed = false;
    try { dismissed = localStorage.getItem(DISMISS_KEY) === "1"; } catch {}
    setHidden(dismissed);
  }, []);
  if (hidden || !platform || platform === "installed" || platform === "other") return null;

  function close() {
    try { localStorage.setItem(DISMISS_KEY, "1"); } catch {}
    setHidden(true);
  }

  return (
    <div className="install-bar" role="region" aria-label="Install the Saathi app">
      <img src="/app-icon/192" alt="" width={40} height={40} />
      <div className="install-text">
        <strong>Get the Saathi app</strong>
        <span>Book and track from your home screen</span>
      </div>
      {platform === "android" && canPrompt ? (
        <button className="btn primary" onClick={async () => { if (await install()) close(); }}>Install</button>
      ) : (
        <Link className="btn primary" href="/app">Install</Link>
      )}
      <button className="install-close" onClick={close} aria-label="Not now">×</button>
    </div>
  );
}

/** Install button + step-by-step help, for the /app page. */
export function InstallPanel() {
  const { platform, canPrompt, install } = useInstall();
  const [done, setDone] = useState(false);

  if (platform === "installed" || done) {
    return <p className="install-ok">✓ The Saathi app is installed. Open it from your home screen.</p>;
  }
  return (
    <div className="install-panel">
      {platform === "inapp" && <InAppNotice />}
      {canPrompt && (
        <button className="btn primary big" onClick={async () => setDone(await install())}>Install the Saathi app</button>
      )}
      <div className="install-steps">
        <section className={platform === "android" ? "here" : ""}>
          <h2>Android (Chrome)</h2>
          <ol>
            <li>Open this page in <b>Chrome</b>.</li>
            <li>Tap the <b>⋮</b> menu (top right).</li>
            <li>Tap <b>Install app</b> or <b>Add to Home screen</b>, then <b>Install</b>.</li>
            <li>Saathi appears on your home screen.</li>
          </ol>
        </section>
        <section className={platform === "ios" ? "here" : ""}>
          <h2>iPhone (Safari)</h2>
          <ol>
            <li>Open this page in <b>Safari</b>.</li>
            <li>Tap the <b>Share</b> button (square with an arrow ↑).</li>
            <li>Scroll down and tap <b>Add to Home Screen</b>, then <b>Add</b>.</li>
          </ol>
        </section>
      </div>
    </div>
  );
}

/** Shown inside WhatsApp/Instagram/Facebook browsers, which cannot install apps. */
function InAppNotice() {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(location.origin + "/app");
      setCopied(true);
    } catch {}
  }
  return (
    <div className="inapp-notice">
      <strong>Open this page in Chrome or Safari to install.</strong>
      <span>
        You opened the link inside another app (like WhatsApp). Tap the <b>⋮</b> or <b>…</b> menu and choose
        <b> Open in browser</b>, or copy the link and paste it into Chrome (Android) or Safari (iPhone).
      </span>
      <button className="btn ghost" onClick={copy}>{copied ? "Link copied ✓" : "Copy link"}</button>
    </div>
  );
}
