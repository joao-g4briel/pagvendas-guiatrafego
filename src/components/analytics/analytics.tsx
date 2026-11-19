"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { siteConfig } from "@/config/site";
import {
  CONSENT_EVENT,
  OPEN_CONSENT_EVENT,
  readConsent,
  trackProductViewGa4,
  trackProductViewMeta,
  writeConsent,
  type ConsentState,
} from "@/lib/analytics";

const { ga4Id, metaPixelId } = siteConfig.analytics;

/** "pending" no servidor e antes da hidratação: nada carrega e o banner não pisca. */
type ConsentSnapshot = ConsentState | "unset" | "pending";

function subscribe(onChange: () => void) {
  window.addEventListener(CONSENT_EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(CONSENT_EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

const getSnapshot = (): ConsentSnapshot => readConsent() ?? "unset";
const getServerSnapshot = (): ConsentSnapshot => "pending";

/**
 * Montado apenas quando há pelo menos um ID configurado (ver layout).
 * Nada de terceiros carrega antes de "Aceitar". "Recusar" mantém tudo desligado.
 */
export function Analytics() {
  const consent = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [reopened, setReopened] = useState(false);
  const tracked = useRef({ ga4: false, meta: false });

  useEffect(() => {
    const onOpen = () => setReopened(true);
    window.addEventListener(OPEN_CONSENT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, onOpen);
  }, []);

  const bannerOpen = consent === "unset" || reopened;

  // Sinaliza para a barra de compra móvel não disputar espaço com o banner.
  useEffect(() => {
    document.documentElement.toggleAttribute("data-consent-open", bannerOpen);
  }, [bannerOpen]);

  const granted = consent === "granted";

  const onGa4Ready = () => {
    if (tracked.current.ga4) return;
    tracked.current.ga4 = true;
    trackProductViewGa4();
  };

  const onMetaReady = () => {
    if (tracked.current.meta) return;
    tracked.current.meta = true;
    trackProductViewMeta();
  };

  const choose = (state: ConsentState) => {
    writeConsent(state);
    setReopened(false);
    // Revogar exige recarregar para descarregar scripts já executados.
    if (state === "denied" && consent === "granted") window.location.reload();
  };

  return (
    <>
      {granted && ga4Id ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive" onReady={onGa4Ready}>
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}');`}
          </Script>
        </>
      ) : null}

      {granted && metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive" onReady={onMetaReady}>
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      ) : null}

      {bannerOpen ? (
        <section
          aria-label="Preferências de cookies"
          className="fixed inset-x-3 bottom-3 z-60 mx-auto max-w-xl rounded border border-line-strong bg-surface p-5 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.95)] sm:inset-x-auto sm:left-6 sm:bottom-6"
          style={{ marginBottom: "env(safe-area-inset-bottom)" }}
        >
          <p className="text-[0.9375rem] leading-relaxed text-fg">
            Usamos cookies de medição (Google Analytics e Meta) para saber quais anúncios trazem visitas. Eles só
            são ativados se você aceitar.{" "}
            <Link href="/privacidade" className="underline hover:text-fg-2">
              Política de privacidade
            </Link>
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" className="btn btn-primary btn-compact" onClick={() => choose("granted")}>
              Aceitar medição
            </button>
            <button type="button" className="btn btn-ghost btn-compact" onClick={() => choose("denied")}>
              Recusar
            </button>
          </div>
        </section>
      ) : null}
    </>
  );
}
