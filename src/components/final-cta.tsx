import { CoverArcs } from "@/components/arcs";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { formattedPrice, siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section
      id="compra-final"
      aria-labelledby="final-title"
      className="relative overflow-hidden border-t border-line py-24 sm:py-32 lg:py-40"
    >
      <CoverArcs className="pointer-events-none absolute -bottom-[30%] -right-[70%] w-[150%] max-w-none sm:-right-[30%] sm:w-[95%] lg:-bottom-[48%] lg:-right-[10%] lg:w-[52%]" />
      <div className="shell relative">
        <h2 id="final-title" className="display max-w-5xl !text-[clamp(2.25rem,1rem+4.2vw,4.75rem)]" data-reveal>
          Antes do próximo impulsionamento, calcule quanto pode pagar por uma venda.
        </h2>
        <p className="mt-8 max-w-xl text-lg leading-relaxed text-fg-2" data-reveal>
          O guia começa por essa conta e segue até a leitura dos resultados, em {siteConfig.product.pages} páginas.
        </p>
        <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-8" data-reveal>
          <CheckoutCta location="final">
            Quero acessar o guia
            <ArrowIcon />
          </CheckoutCta>
          <p className="text-fg-2">
            <span className="tabular font-semibold text-fg">{formattedPrice}</span> · {siteConfig.price.terms}
          </p>
        </div>
      </div>
    </section>
  );
}
