import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { formattedPrice, siteConfig } from "@/config/site";

export function FinalCta() {
  return (
    <section id="compra-final" aria-labelledby="final-title" className="pb-20 sm:pb-24">
      <div className="shell">
        <div
          className="flex flex-col gap-7 rounded-2xl border border-line bg-surface px-6 py-9 sm:px-10 sm:py-12 lg:flex-row lg:items-center lg:justify-between lg:px-14"
          data-reveal
        >
          <div>
            <h2 id="final-title" className="text-[2rem] font-extrabold leading-tight tracking-[-0.03em] sm:text-5xl">
              Planeje. Anuncie. Analise.
            </h2>
            <p className="mt-3 text-lg text-fg-2 sm:text-xl">
              {siteConfig.product.name} · <span className="tabular font-bold text-fg">{formattedPrice}</span>,{" "}
              {siteConfig.price.terms}.
            </p>
          </div>
          <CheckoutCta location="final" className="shrink-0 sm:min-w-[17rem]">
            Quero acessar o guia
            <ArrowIcon />
          </CheckoutCta>
        </div>
      </div>
    </section>
  );
}
