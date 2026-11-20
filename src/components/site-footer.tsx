import Link from "next/link";
import { CookiePreferencesButton } from "@/components/analytics/cookie-preferences-button";
import { hasTracking, siteConfig, supportWhatsappUrl } from "@/config/site";

export function SiteFooter() {
  const { seller, support } = siteConfig;
  const whatsapp = supportWhatsappUrl();
  const supportHref = support.email ? `mailto:${support.email}` : whatsapp;
  const sellerLine = [seller.legalName, seller.document, seller.address].filter(Boolean).join(" · ");
  const linkClass = "inline-flex min-h-11 items-center text-fg-2 transition-colors hover:text-fg";

  return (
    <footer className="border-t border-line pb-32 pt-10 lg:pb-12">
      <div className="shell">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xl font-extrabold tracking-[0.02em]" translate="no">
              METODARIA
            </p>
            <p className="mt-1 text-fg-2">Material educacional independente.</p>
          </div>
          <nav aria-label="Documentos">
            <ul className="flex flex-wrap gap-x-8 gap-y-1">
              <li>
                <Link href="/termos" className={linkClass}>
                  Termos
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className={linkClass}>
                  Privacidade
                </Link>
              </li>
              {supportHref ? (
                <li>
                  <a href={supportHref} className={linkClass} rel="noopener">
                    Suporte
                  </a>
                </li>
              ) : null}
              {hasTracking ? (
                <li>
                  <CookiePreferencesButton />
                </li>
              ) : null}
            </ul>
          </nav>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-sm leading-relaxed text-fg-3">
          {sellerLine ? <p>Vendedor: {sellerLine}</p> : null}
          <p className={sellerLine ? "mt-2" : ""}>
            Meta, Facebook, Instagram, WhatsApp e Google Ads são marcas de seus respectivos titulares. Este guia não
            tem vínculo com essas empresas. © 2026 Metodaria.
          </p>
        </div>
      </div>
    </footer>
  );
}
