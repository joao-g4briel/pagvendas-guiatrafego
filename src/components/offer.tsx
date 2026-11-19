import Image from "next/image";
import { CoverArcs } from "@/components/arcs";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { formattedPrice, paymentMethodLabels, siteConfig } from "@/config/site";
import { offerItems } from "@/content/guia";

function listFormat(items: string[]): string {
  return new Intl.ListFormat("pt-BR", { style: "long", type: "disjunction" }).format(items);
}

export function Offer() {
  const { product, price, checkout, refund } = siteConfig;
  const methods = checkout.paymentMethods.map((method) => paymentMethodLabels[method]);

  return (
    <section id="oferta" aria-labelledby="oferta-title" className="py-20 sm:py-28 lg:py-32">
      <div className="shell">
        <div className="relative overflow-hidden rounded border border-line bg-surface" data-reveal>
          <CoverArcs className="pointer-events-none absolute -bottom-[40%] -left-[45%] w-[120%] max-w-none opacity-80 lg:-bottom-[70%] lg:-left-[18%] lg:w-[70%]" />

          <div className="relative grid gap-12 p-6 sm:p-10 lg:grid-cols-12 lg:gap-16 lg:p-16">
            <div className="mx-auto w-[56%] max-w-[15rem] sm:max-w-[17rem] lg:col-span-4 lg:mx-0 lg:w-full lg:max-w-none">
              <div className="overflow-hidden rounded-[3px] shadow-[0_36px_60px_-28px_rgb(0_0_0/0.95)] ring-1 ring-white/12">
                <Image
                  src={product.coverImage.src}
                  width={product.coverImage.width}
                  height={product.coverImage.height}
                  alt={`Capa do guia ${product.coverTitle}`}
                  sizes="(min-width: 64rem) 340px, (min-width: 40rem) 272px, 56vw"
                  quality={85}
                  className="block h-auto w-full"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <h2 id="oferta-title" className="section-title">
                {product.name}
              </h2>
              <p className="mt-3 text-lg text-fg-2 sm:text-xl">{product.subtitle}</p>

              <ul className="mt-9 grid gap-x-10 border-t border-line-strong sm:grid-cols-2">
                {offerItems.map((item) => (
                  <li key={item} className="flex gap-4 border-b border-line py-4 leading-snug">
                    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                      <path d="m3 8.4 3 3 7-7" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p>
                  <span className="tabular block text-[3.5rem] font-bold leading-none tracking-[-0.03em] sm:text-7xl">
                    {formattedPrice}
                  </span>
                  <span className="mt-2 block text-fg-2">
                    {price.terms}
                    {methods.length > 0 ? ` · ${listFormat(methods)}` : ""}
                  </span>
                </p>
                <CheckoutCta location="offer" className="sm:min-w-[16rem]">
                  Quero acessar o guia
                  <ArrowIcon />
                </CheckoutCta>
              </div>

              <div className="mt-10 grid gap-4 border-t border-line pt-6 text-[0.9375rem] leading-relaxed text-fg-2 sm:grid-cols-2 sm:gap-10">
                <p>{checkout.delivery}</p>
                <p>
                  Você pode desistir em até {refund.legalDays} dias após a compra, com devolução do valor pago,
                  conforme o art. 49 do Código de Defesa do Consumidor.{" "}
                  <a href="#duvidas" className="text-fg underline hover:text-white">
                    Como pedir
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
