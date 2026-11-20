import { BarChart3, Image as ImageIcon, MessageCircle, Search, Target, Users, type LucideIcon } from "lucide-react";
import { Disclosure } from "@/components/disclosure";
import { learnItems, tocAnnexes, tocModules, type LearnIcon } from "@/content/guia";

const icons: Record<LearnIcon, LucideIcon> = {
  target: Target,
  chat: MessageCircle,
  users: Users,
  chart: BarChart3,
  image: ImageIcon,
  search: Search,
};

export function Contents() {
  return (
    <section id="conteudo" aria-labelledby="conteudo-title" className="relative overflow-hidden border-t border-line py-20 sm:py-24 lg:py-28">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-[30%] -top-[20%] aspect-square w-[70%] rounded-full bg-[radial-gradient(circle_at_30%_30%,#1f1f21_0%,#111112_50%,transparent_72%)] max-lg:hidden"
      />
      <div className="shell relative">
        <h2 id="conteudo-title" className="section-title" data-reveal>
          O que você vai aprender.
        </h2>
        <p className="mt-4 max-w-xl text-lg leading-relaxed text-fg-2 sm:text-xl" data-reveal>
          16 módulos organizados para você começar com clareza.
        </p>

        <ul className="mt-12 grid border-t border-line-strong sm:grid-cols-2 lg:mt-14">
          {learnItems.map((item, index) => {
            const Icon = icons[item.icon];
            return (
              <li
                key={item.title}
                className={`flex gap-5 border-b border-line py-7 sm:gap-6 sm:py-8 ${
                  index % 2 === 1 ? "sm:border-l sm:pl-10" : "sm:pr-10"
                }`}
                data-reveal
                style={{ ["--rv-d" as string]: `${(index % 2) * 70}ms` }}
              >
                <Icon aria-hidden="true" className="mt-0.5 size-10 shrink-0 sm:size-12" strokeWidth={1.4} />
                <div className="min-w-0">
                  <h3 className="text-xl font-bold leading-snug tracking-[-0.015em] sm:text-2xl">{item.title}</h3>
                  <p className="mt-1.5 leading-relaxed text-fg-2">{item.description}</p>
                  <p className="tabular mt-2 text-sm font-medium text-fg-3">{item.modules}</p>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="mt-2">
          <Disclosure
            summary={<span className="text-lg font-semibold">Ver o sumário completo: 16 módulos e anexos A a J</span>}
          >
            <div className="grid gap-x-12 gap-y-1 text-[0.9375rem] text-fg-2 md:grid-cols-2">
              {tocModules.map((module) => (
                <p key={module.number} className="flex items-baseline gap-3 py-1">
                  <span className="tabular w-7 shrink-0 font-semibold text-fg">{module.number}</span>
                  <span>{module.title}</span>
                  <span className="leader hidden sm:block" aria-hidden="true" />
                  <span className="tabular ml-auto shrink-0 text-fg-3 sm:ml-0">p. {module.page}</span>
                </p>
              ))}
              {tocAnnexes.map((annex) => (
                <p key={annex.letter} className="flex items-baseline gap-3 py-1">
                  <span className="w-7 shrink-0 font-semibold text-fg">{annex.letter}</span>
                  <span>{annex.title}</span>
                  <span className="leader hidden sm:block" aria-hidden="true" />
                  <span className="tabular ml-auto shrink-0 text-fg-3 sm:ml-0">p. {annex.page}</span>
                </p>
              ))}
            </div>
          </Disclosure>
        </div>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between" data-reveal>
          <p className="max-w-2xl text-2xl font-bold leading-snug tracking-[-0.02em] sm:text-3xl">
            Para pequenos negócios, autônomos e iniciantes.
          </p>
          <a href="#previa" className="btn btn-ghost shrink-0">
            Ver uma prévia
          </a>
        </div>
      </div>
    </section>
  );
}
