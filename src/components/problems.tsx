import { PlanCalculator } from "@/components/plan-calculator";
import { problems } from "@/content/guia";

export function Problems() {
  return (
    <section aria-labelledby="problemas-title" className="border-t border-line py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12 lg:items-end">
          <h2 id="problemas-title" className="section-title lg:col-span-8" data-reveal>
            Onde o dinheiro dos primeiros anúncios costuma se perder
          </h2>
          <p className="max-w-md leading-relaxed text-fg-2 lg:col-span-4" data-reveal>
            Quatro situações comuns de quem está começando, ao lado da parte do guia que trata de cada uma. O guia
            mostra o raciocínio e as contas; a experiência vem de aplicar em um projeto seu.
          </p>
        </div>

        <div className="mt-14 lg:mt-20">
          <div
            aria-hidden="true"
            className="running-head hidden grid-cols-12 gap-8 pb-3 text-fg-3 lg:grid"
          >
            <span className="col-span-5">Situação</span>
            <span className="col-span-5">O que o guia ensina</span>
            <span className="col-span-2 text-right">No guia</span>
          </div>
          <ul className="border-b border-line">
            {problems.map((item, index) => (
              <li
                key={item.situation}
                className="rule-top grid gap-4 py-8 [--rule-color:var(--color-line)] lg:grid-cols-12 lg:gap-8 lg:py-10"
                data-reveal
                style={{ ["--rv-d" as string]: `${index * 60}ms` }}
              >
                <h3 className="text-[1.375rem] font-semibold leading-snug tracking-[-0.015em] lg:col-span-5 lg:text-2xl">
                  {item.situation}
                </h3>
                <p className="max-w-[60ch] leading-relaxed text-fg-2 lg:col-span-5">{item.answer}</p>
                <p className="tabular text-sm text-fg-3 lg:col-span-2 lg:text-right">{item.where}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16 lg:mt-24" data-reveal>
          <PlanCalculator />
        </div>
      </div>
    </section>
  );
}
