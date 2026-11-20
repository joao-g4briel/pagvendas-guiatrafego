import { situations } from "@/content/guia";

export function Problems() {
  return (
    <section aria-labelledby="planeje-title" className="py-20 sm:py-24 lg:py-28">
      <div className="shell">
        <div className="grid gap-5 lg:grid-cols-12 lg:items-end">
          <h2 id="planeje-title" className="section-title lg:col-span-7" data-reveal>
            Planeje antes de investir.
          </h2>
          <p className="max-w-md text-lg leading-relaxed text-fg-2 lg:col-span-5 lg:justify-self-end" data-reveal>
            Situações comuns de quem começa a anunciar, e a parte do guia que trata de cada uma.
          </p>
        </div>

        <ul className="mt-12 grid border-t border-line-strong sm:grid-cols-2 lg:mt-16">
          {situations.map((item, index) => (
            <li
              key={item.question}
              className={`border-b border-line py-7 sm:py-9 ${index % 2 === 1 ? "sm:border-l sm:pl-10" : "sm:pr-10"}`}
              data-reveal
              style={{ ["--rv-d" as string]: `${(index % 2) * 70}ms` }}
            >
              <h3 className="text-xl font-bold leading-snug tracking-[-0.015em] sm:text-2xl">{item.question}</h3>
              <p className="mt-3 max-w-[46ch] leading-relaxed text-fg-2">{item.answer}</p>
              <p className="tabular mt-4 text-sm font-medium text-fg-3">{item.where}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
