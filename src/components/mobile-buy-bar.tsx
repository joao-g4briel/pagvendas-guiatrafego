"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, LazyMotion, domAnimation, m } from "motion/react";
import { CheckoutCta } from "@/components/checkout-cta";
import { feeShortNote, formattedPrice, siteConfig } from "@/config/site";

/** Seções que, visíveis, tornam a barra desnecessária (já têm compra ou são o fim da página). */
const HIDE_WHEN_VISIBLE = ["oferta", "compra-final"];

/**
 * Barra de compra do celular. Aparece depois que o bloco de compra do hero sai da tela
 * e some quando a oferta ou o CTA final estão visíveis. Só reage a cruzamentos
 * (IntersectionObserver), nunca a cada pixel de scroll.
 */
export function MobileBuyBar() {
  const [pastHero, setPastHero] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [consentOpen, setConsentOpen] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero-compra");
    const blockers = HIDE_WHEN_VISIBLE.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    const visibleBlockers = new Set<Element>();

    const heroObserver = new IntersectionObserver(([entry]) => {
      if (entry) setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0);
    });
    const blockObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visibleBlockers.add(entry.target);
        else visibleBlockers.delete(entry.target);
      }
      setBlocked(visibleBlockers.size > 0);
    });

    if (hero) heroObserver.observe(hero);
    blockers.forEach((el) => blockObserver.observe(el));

    const root = document.documentElement;
    const syncConsent = () => setConsentOpen(root.hasAttribute("data-consent-open"));
    syncConsent();
    const attrObserver = new MutationObserver(syncConsent);
    attrObserver.observe(root, { attributes: true, attributeFilter: ["data-consent-open"] });

    return () => {
      heroObserver.disconnect();
      blockObserver.disconnect();
      attrObserver.disconnect();
    };
  }, []);

  const visible = pastHero && !blocked && !consentOpen;

  return (
    <LazyMotion features={domAnimation} strict>
      <AnimatePresence>
        {visible ? (
          <m.div
            key="buy-bar"
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            exit={{ y: "110%" }}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 bottom-0 z-50 border-t border-line-strong bg-ink/95 lg:hidden"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
          >
            <div className="shell flex items-center justify-between gap-4 pt-3">
              <p className="min-w-0 leading-tight">
                <span className="block truncate text-sm text-fg-2">{siteConfig.product.name}</span>
                <span className="tabular text-lg font-bold">{formattedPrice}</span>
                {feeShortNote ? <span className="block text-xs text-fg-2">{feeShortNote}</span> : null}
              </p>
              <CheckoutCta location="mobile_bar" size="compact" className="shrink-0">
                Comprar guia
              </CheckoutCta>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
