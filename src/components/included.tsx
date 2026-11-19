import { checklistExcerpt, includedGroups } from "@/content/guia";

export function Included() {
  return (
    <section aria-labelledby="acompanha-title" className="py-20 sm:py-28 lg:py-36">
      <div className="shell">
        <h2 id="acompanha-title" className="section-title max-w-4xl" data-reveal>
          Exercícios, checklists e modelos dentro do próprio PDF
        </h2>
        <p className="mt-6 max-w-2xl leading-relaxed text-fg-2" data-reveal>
          Fazem parte do arquivo, nos anexos A a J. Você copia os modelos para um documento e adapta ao seu
          negócio ou aos projetos de clientes.
        </p>

        <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <figure className="rounded border border-line bg-surface p-6 sm:p-9 lg:col-span-5" data-reveal>
            <figcaption>
              <span className="flex items-baseline justify-between gap-4">
                <span className="text-2xl font-bold tracking-[-0.02em]">Checklist antes de publicar</span>
                <span className="tabular shrink-0 text-sm text-fg-3">Anexo D · p. 43</span>
              </span>
              <span className="mt-2 block leading-relaxed text-fg-2">
                25 itens em três revisões: negócio, conta e campanha, medição e operação. Alguns deles:
              </span>
            </figcaption>
            <ul className="mt-7 border-t border-line">
              {checklistExcerpt.map((item) => (
                <li key={item} className="flex gap-4 border-b border-line py-4 leading-snug">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-[3px] border border-fg-3"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="m2.5 6.2 2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-fg-3">
              13 dos 16 módulos terminam com três perguntas para aplicar no seu projeto.
            </p>
          </figure>

          <div className="grid gap-12 lg:col-span-7">
            {includedGroups.map((group) => (
              <div key={group.title} data-reveal>
                <h3 className="text-2xl font-bold tracking-[-0.02em]">{group.title}</h3>
                <dl className="mt-5 border-t border-line-strong">
                  {group.items.map((item) => (
                    <div key={item.label} className="grid gap-1 border-b border-line py-5 sm:grid-cols-[7rem_1fr] sm:gap-6">
                      <dt className="font-semibold">{item.label}</dt>
                      <dd className="leading-relaxed text-fg-2">{item.detail}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
