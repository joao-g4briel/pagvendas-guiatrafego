/**
 * Medição opcional (GA4 e Meta Pixel), sempre condicionada ao consentimento.
 *
 * Esta página mede apenas intenção: visualização do produto e clique para o checkout.
 * A compra (Purchase) acontece no domínio da Cakto e deve ser registrada pela integração
 * do próprio checkout, após confirmação do pagamento. Nada aqui dispara Purchase.
 *
 * Nenhum evento leva dados pessoais.
 */

import { pageview } from "@vercel/analytics";
import { siteConfig } from "@/config/site";

export type CtaLocation = "header" | "menu" | "hero" | "preview" | "offer" | "final" | "mobile_bar";

/** Nome de cada botão no painel da Vercel: /clique-comprar/<nome>. */
const CLICK_PATH: Record<CtaLocation, string> = {
  header: "topo",
  menu: "menu",
  hero: "hero",
  preview: "previa",
  offer: "oferta",
  final: "final",
  mobile_bar: "barra-celular",
};

export type ConsentState = "granted" | "denied";

/** Chave versionada: ao mudar as finalidades de medição, troque para v2 e o banner volta a aparecer. */
const CONSENT_KEY = "metodaria:consent:v1";
export const CONSENT_EVENT = "metodaria:consent";

const PRODUCT_ID = "guia-trafego-pago";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function readConsent(): ConsentState | null {
  try {
    const value = window.localStorage.getItem(CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

export function writeConsent(state: ConsentState | null): void {
  try {
    if (state) window.localStorage.setItem(CONSENT_KEY, state);
    else window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    // Navegação privada ou armazenamento bloqueado: a escolha vale só para esta visita.
  }
  window.dispatchEvent(new CustomEvent<ConsentState | null>(CONSENT_EVENT, { detail: state }));
}

/** Pedido para reabrir o banner (link "Preferências de cookies" no rodapé). */
export const OPEN_CONSENT_EVENT = "metodaria:open-consent";

function productPayload() {
  return {
    currency: siteConfig.price.currency,
    value: siteConfig.price.amount,
  };
}

/** Visualização do produto no GA4. Chamado uma vez, quando o gtag fica pronto. */
export function trackProductViewGa4(): void {
  const { currency, value } = productPayload();
  window.gtag?.("event", "view_item", {
    currency,
    value,
    items: [{ item_id: PRODUCT_ID, item_name: siteConfig.product.name, price: value, quantity: 1 }],
  });
}

/** Visualização do produto no Meta. Chamado uma vez, quando o fbq fica pronto. */
export function trackProductViewMeta(): void {
  const { currency, value } = productPayload();
  window.fbq?.("track", "ViewContent", {
    content_ids: [PRODUCT_ID],
    content_name: siteConfig.product.name,
    content_type: "product",
    currency,
    value,
  });
}

/**
 * Conta o clique no Vercel Web Analytics como uma visualização virtual de
 * /clique-comprar/<botão>. O Web Analytics não usa cookies nem guarda dados pessoais,
 * por isso roda sem o consentimento; e o plano gratuito não tem eventos personalizados,
 * daí a visualização virtual. O envio usa fetch com keepalive e sobrevive à saída para o checkout.
 * Efeito no painel: cada clique soma uma visualização e tira o visitante da taxa de rejeição.
 */
function countClickOnVercel(location: CtaLocation): void {
  try {
    pageview({ route: "/clique-comprar/[botao]", path: `/clique-comprar/${CLICK_PATH[location]}` });
  } catch {
    // Script bloqueado: a compra segue normalmente.
  }
}

/**
 * Clique em um botão de compra. É intenção, não conversão:
 * - Vercel: visualização virtual em /clique-comprar/<botão>, sempre;
 * - GA4: evento próprio `checkout_click` (não marcar como evento principal para lances).
 * - Meta: evento personalizado `CheckoutClick`, para não duplicar o InitiateCheckout
 *   que a integração da Cakto pode disparar no próprio checkout.
 */
export function trackCheckoutClick(location: CtaLocation): void {
  countClickOnVercel(location);
  if (readConsent() !== "granted") return;
  const { currency, value } = productPayload();
  window.gtag?.("event", "checkout_click", {
    cta_location: location,
    currency,
    value,
    transport_type: "beacon",
  });
  window.fbq?.("trackCustom", "CheckoutClick", { cta_location: location, currency, value });
}
