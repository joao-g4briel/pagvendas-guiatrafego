import Link from "next/link";
import { CookiePreferencesButton } from "@/components/analytics/cookie-preferences-button";
import { hasTracking, siteConfig, supportWhatsappUrl } from "@/config/site";

export function SiteFooter() {
  const { seller, support } = siteConfig;
  const whatsapp = supportWhatsappUrl();
  const sellerLine = [seller.legalName, seller.document].filter(Boolean).join(" · ");

  return (
    <footer className="border-t border-line pb-32 pt-14 lg:pb-14">
      <div className="shell grid gap-10 text-[0.9375rem] lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="font-bold uppercase tracking-[0.12em]" translate="no">
            Metodaria
          </p>
          <p className="mt-3 max-w-sm leading-relaxed text-fg-2">
            Guia de Tráfego Pago. Material educacional independente em PDF.
          </p>
          {sellerLine || seller.address ? (
            <address className="mt-5 not-italic leading-relaxed text-fg-3">
              {sellerLine ? <span className="block">Vendedor: {sellerLine}</span> : null}
              {seller.address ? <span className="block">{seller.address}</span> : null}
            </address>
          ) : null}
        </div>

        <div className="lg:col-span-3">
          <p className="font-semibold">Contato</p>
          <ul className="mt-2 text-fg-2">
            {support.email ? (
              <li>
                <a href={`mailto:${support.email}`} className="inline-flex min-h-10 items-center hover:text-fg">
                  {support.email}
                </a>
              </li>
            ) : null}
            {whatsapp ? (
              <li>
                <a href={whatsapp} className="inline-flex min-h-10 items-center hover:text-fg" rel="noopener">
                  WhatsApp
                </a>
              </li>
            ) : null}
            {!support.email && !whatsapp ? <li>Canal de contato em definição.</li> : null}
          </ul>
        </div>

        <nav aria-label="Documentos" className="lg:col-span-4">
          <p className="font-semibold">Documentos</p>
          <ul className="mt-2 text-fg-2">
            <li>
              <Link href="/termos" className="inline-flex min-h-10 items-center hover:text-fg">
                Termos de uso e compra
              </Link>
            </li>
            <li>
              <Link href="/privacidade" className="inline-flex min-h-10 items-center hover:text-fg">
                Política de privacidade
              </Link>
            </li>
            {hasTracking ? (
              <li>
                <CookiePreferencesButton />
              </li>
            ) : null}
          </ul>
        </nav>

        <p className="border-t border-line pt-6 text-sm leading-relaxed text-fg-3 lg:col-span-12">
          Meta, Facebook, Instagram, WhatsApp e Google Ads são marcas de seus respectivos titulares. Este guia não
          tem vínculo com essas empresas nem é endossado por elas. © 2026 Metodaria.
        </p>
      </div>
    </footer>
  );
}
