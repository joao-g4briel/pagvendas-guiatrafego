import Link from "next/link";
import { CheckoutCta } from "@/components/checkout-cta";
import { MobileMenu } from "@/components/mobile-menu";

export const navLinks = [
  { href: "/#conteudo", label: "Conteúdo" },
  { href: "/#previa", label: "Prévia" },
  { href: "/#duvidas", label: "Dúvidas" },
] as const;

export function SiteHeader() {
  return (
    <header className="relative z-40 border-b border-line bg-ink lg:sticky lg:top-0">
      <a
        href="#principal"
        className="sr-only rounded bg-fg px-4 py-2 font-semibold text-ink focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50"
      >
        Pular para o conteúdo
      </a>
      <div className="shell flex h-16 items-center justify-between gap-6">
        <Link
          href="/"
          className="inline-flex min-h-11 items-center text-[0.9375rem] font-bold uppercase tracking-[0.12em] text-fg no-underline"
          aria-label="Metodaria, início"
          translate="no"
        >
          Metodaria
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-[0.9375rem] text-fg-2 no-underline transition-colors duration-150 hover:text-fg"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden lg:block">
          <CheckoutCta location="header" size="compact">
            Comprar guia
          </CheckoutCta>
        </div>

        <MobileMenu links={navLinks} />
      </div>
    </header>
  );
}
