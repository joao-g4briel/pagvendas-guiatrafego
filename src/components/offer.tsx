import { Check } from "lucide-react";
import { CheckoutCta } from "@/components/checkout-cta";
import { TabletMockup } from "@/components/tablet-mockup";
import { feeNote, formattedPrice, paymentMethodLabels, siteConfig } from "@/config/site";
import { offerItems } from "@/content/guia";

function listFormat(items: string[]): string {
  return new Intl.ListFormat("pt-BR", { style: "long", type: "disjunction" }).format(items);
}

export function Offer() {
  const { product, price, checkout, refund } = siteConfig;
  const methods = checkout.paymentMethods.map((method) => paymentMethodLabels[method]);
  const paymentLine =
    methods.length > 0
      ? `Pagamento por ${listFormat(methods)} no checkout da ${checkout.provider}.`
      : `Pagamento no checkout da ${checkout.provider}.`;

  return (
    <section id="oferta" aria-labelledby="oferta-title" className="relative overflow-hidden border-t border-line py-20 sm:py-24 lg:py-28">
      <div className="shell relative">
        <h2 id="oferta-title" className="section-title mx-auto max-w-4xl text-center" data-reveal>
          Seu próximo anúncio começa com um plano.
        </h2>

        <div className="mt-12 grid items-center gap-12 lg:mt-16 lg:grid-cols-12 lg:gap-16">
          <div className="relative mx-auto w-[60%] max-w-[15rem] sm:max-w-[18rem] lg:col-span-5 lg:w-full lg:max-w-[22rem]" data-reveal>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-[40%] top-[10%] aspect-square w-[160%] rounded-full bg-[radial-gradient(circle_at_60%_30%,#262628_0%,#141415_48%,transparent_72%)]"
            />
            <div className="relative">
              <TabletMockup
                src={product.coverImage.src}
                width={product.coverImage.width}
                height={product.coverImage.height}
                alt={`Guia ${product.coverTitle} em um tablet`}
                sizes="(min-width: 64rem) 352px, (min-width: 40rem) 288px, 60vw"
                restTilt={0}
              />
            </div>
          </div>

          <div
            className="rounded-2xl border border-line-strong bg-surface p-6 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)] sm:p-10 lg:col-span-7"
            data-reveal
          >
            <h3 className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.02em] sm:text-4xl">{product.name}</h3>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-3">
              <span className="tabular text-[3.25rem] font-extrabold leading-none tracking-[-0.03em] sm:text-7xl">
                {formattedPrice}
              </span>
              <span className="text-lg text-fg-2">{price.terms}</span>
            </p>
            {feeNote ? <p className="mt-2 text-[0.9375rem] text-fg-2">{feeNote}, cobrada no checkout.</p> : null}

            <ul className="mt-8 grid gap-3.5 sm:grid-cols-2 sm:gap-x-8">
              {offerItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[1.0625rem] leading-snug">
                  <Check aria-hidden="true" className="mt-0.5 size-5 shrink-0" strokeWidth={2.5} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <CheckoutCta location="offer" className="btn-block mt-9 text-lg">
              Comprar por {formattedPrice}
            </CheckoutCta>
            <p className="mt-4 text-center text-[0.9375rem] text-fg-2">Acesso após a confirmação do pagamento.</p>

            <div className="mt-7 grid gap-2 border-t border-line pt-6 text-center text-sm leading-relaxed text-fg-2">
              <p>{paymentLine}</p>
              <p>
                Garantia de {refund.legalDays} dias: se não gostar, você desiste e recebe 100% do valor de volta.{" "}
                <a href="#duvidas" className="text-fg underline hover:text-white">
                  Como pedir
                </a>
              </p>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-14 max-w-3xl border-t border-line pt-8 text-center text-2xl font-bold tracking-[-0.02em] sm:text-3xl" data-reveal>
          Um material para estudar e aplicar no seu ritmo.
        </p>
      </div>
    </section>
  );
}
