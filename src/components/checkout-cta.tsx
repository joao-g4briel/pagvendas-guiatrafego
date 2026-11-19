"use client";

import type { ReactNode } from "react";
import { siteConfig } from "@/config/site";
import { trackCheckoutClick, type CtaLocation } from "@/lib/analytics";

export const SALES_CLOSED_EVENT = "metodaria:sales-closed";

type CheckoutCtaProps = {
  location: CtaLocation;
  children: ReactNode;
  variant?: "primary" | "ghost";
  size?: "default" | "compact";
  className?: string;
};

const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];

/** Acrescenta à URL do checkout os utm_* presentes na página, sem sobrescrever o que já existe. */
function withPageUtm(checkoutUrl: string): string {
  const page = new URLSearchParams(window.location.search);
  const target = new URL(checkoutUrl);
  for (const key of UTM_KEYS) {
    const value = page.get(key);
    if (value && !target.searchParams.has(key)) target.searchParams.set(key, value);
  }
  return target.toString();
}

/**
 * Único componente de compra da página. Todos os botões (cabeçalho, menu, hero,
 * oferta, CTA final e barra móvel) passam por aqui e usam `siteConfig.checkout.url`.
 */
export function CheckoutCta({
  location,
  children,
  variant = "primary",
  size = "default",
  className = "",
}: CheckoutCtaProps) {
  const url = siteConfig.checkout.url;
  const classes = `btn ${variant === "primary" ? "btn-primary" : "btn-ghost"} ${
    size === "compact" ? "btn-compact" : ""
  } ${className}`;

  if (!url) {
    return (
      <button
        type="button"
        className={classes}
        onClick={() => window.dispatchEvent(new CustomEvent(SALES_CLOSED_EVENT))}
      >
        {children}
      </button>
    );
  }

  return (
    <a
      href={url}
      className={classes}
      data-checkout-cta={location}
      onClick={(event) => {
        trackCheckoutClick(location);
        if (siteConfig.checkout.forwardUtm) event.currentTarget.href = withPageUtm(url);
      }}
    >
      {children}
    </a>
  );
}

export function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`btn-arrow ${className}`}
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      aria-hidden="true"
    >
      <path d="M3 9h11M10 4.5 14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" />
    </svg>
  );
}
