import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { Disclosure } from "@/components/disclosure";
import { formattedPrice } from "@/config/site";
import { contentBlocks, tocAnnexes, tocIntro, tocModules } from "@/content/guia";

function TocLine({ label, title, page }: { label?: string; title: string; page: number }) {
  return (
    <span className="flex items-baseline gap-3">
      <span className="flex min-w-0 flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-3">
        {label ? <span className="tabular shrink-0 text-sm text-fg-3 sm:w-24">{label}</span> : null}
        <span className="font-medium leading-snug">{title}</span>
      </span>
      <span className="leader hidden sm:block" aria-hidden="true" />
      <span className="tabular ml-auto shrink-0 self-end text-sm text-fg-3 sm:ml-0 sm:self-auto">p. {page}</span>
    </span>
  );
}

export function Contents() {
  return (
    <section id="conteudo" aria-labelledby="conteudo-title" className="border-t border-line py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="conteudo-title" className="section-title lg:col-span-8" data-reveal>
            16 módulos, do cálculo da margem à campanha de Pesquisa no Google
          </h2>
          <p className="max-w-md leading-relaxed text-fg-2 lg:col-span-4" data-reveal>
            São 48 lições curtas, com passos numerados, atividades e critérios para você conferir se
            entendeu. O roteiro sugerido leva oito semanas, com seis a oito horas por semana, no seu ritmo.
          </p>
        </div>

        <ol className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-3 lg:gap-x-12">
          {contentBlocks.map((block, index) => (
            <li
              key={block.title}
              className="rule-top pb-10 pt-7 lg:pb-14"
              data-reveal
              style={{ ["--rv-d" as string]: `${(index % 3) * 70}ms` }}
            >
              <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em]">{block.title}</h3>
              <ul className="mt-5 space-y-3 text-[0.9375rem] leading-relaxed text-fg-2">
                {block.topics.map((topic) => (
                  <li key={topic} className="flex gap-3">
                    <span aria-hidden="true" className="mt-[0.7em] h-px w-3 shrink-0 bg-fg-3" />
                    <span>{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="tabular mt-6 text-sm text-fg-3">{block.modules}</p>
            </li>
          ))}
        </ol>

        <div className="mt-20 grid gap-12 lg:mt-28 lg:grid-cols-12">
          <div className="self-start lg:sticky lg:top-24 lg:col-span-4" data-reveal>
            <h3 className="text-[1.75rem] font-bold leading-tight tracking-[-0.02em]">Sumário completo</h3>
            <p className="mt-3 max-w-sm leading-relaxed text-fg-2">
              O mesmo índice da página 2 do PDF. Abra um módulo para ver as três lições.
            </p>
            <div className="mt-8 hidden lg:block">
              <CheckoutCta location="contents" variant="ghost">
                Quero o guia por {formattedPrice}
                <ArrowIcon />
              </CheckoutCta>
            </div>
          </div>

          <div className="lg:col-span-8">
            <ul className="border-t border-line-strong">
              {tocIntro.map((item) => (
                <li key={item.title} className="border-b border-line py-5 text-fg-2 sm:py-6">
                  <TocLine title={item.title} page={item.page} />
                </li>
              ))}
            </ul>
            {tocModules.map((module) => (
              <Disclosure
                key={module.number}
                headingLevel={4}
                summary={<TocLine label={`Módulo ${module.number}`} title={module.title} page={module.page} />}
              >
                <ul className="space-y-2.5 text-fg-2 sm:pl-24">
                  {module.lessons.map((lesson) => (
                    <li key={lesson} className="leading-relaxed">
                      Lição {lesson}
                    </li>
                  ))}
                </ul>
              </Disclosure>
            ))}
            <Disclosure
              headingLevel={4}
              summary={<TocLine label="Anexos" title="Modelos, exercícios, checklist e glossário" page={37} />}
            >
              <ul className="space-y-2.5 text-fg-2 sm:pl-24">
                {tocAnnexes.map((annex) => (
                  <li key={annex.letter} className="flex items-baseline gap-3 leading-relaxed">
                    <span className="w-5 shrink-0 font-semibold text-fg">{annex.letter}</span>
                    <span>{annex.title}</span>
                    <span className="tabular ml-auto shrink-0 text-sm text-fg-3">p. {annex.page}</span>
                  </li>
                ))}
              </ul>
            </Disclosure>
          </div>
        </div>
      </div>
    </section>
  );
}
