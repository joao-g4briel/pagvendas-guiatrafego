"use client";

import { useId, useState } from "react";

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const ratio = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/** Aceita "120", "120,50", "1.200,50" e "120.5". */
function parseMoney(raw: string): number | null {
  const compact = raw.replace(/\s|R\$/g, "");
  if (!compact) return null;
  const normalized = compact.includes(",") ? compact.replace(/\./g, "").replace(",", ".") : compact;
  const value = Number(normalized);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

type FieldProps = {
  id: string;
  name: string;
  label: string;
  hint: string;
  value: string;
  onChange: (value: string) => void;
  invalid: boolean;
};

function MoneyField({ id, name, label, hint, value, onChange, invalid }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-[0.9375rem] font-medium text-fg">
        {label}
      </label>
      <p id={`${id}-hint`} className="mt-1 text-sm text-fg-3">
        {hint}
      </p>
      <div className="relative mt-2.5">
        <span aria-hidden="true" className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-fg-3">
          R$
        </span>
        <input
          id={id}
          name={name}
          className="field"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          spellCheck={false}
          value={value}
          aria-describedby={`${id}-hint`}
          aria-invalid={invalid || undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </div>
    </div>
  );
}

/** A conta da Lição 1.3 (Módulo 01), com os valores do exemplo do guia como ponto de partida. */
export function PlanCalculator() {
  const baseId = useId();
  const [price, setPrice] = useState("120");
  const [costs, setCosts] = useState("78");
  const [reserve, setReserve] = useState("18");

  const p = parseMoney(price);
  const c = parseMoney(costs);
  const r = parseMoney(reserve);
  const valid = p !== null && p > 0 && c !== null && r !== null;

  const contribution = valid ? p - c : null;
  const target = valid && contribution !== null ? contribution - r : null;
  const noMargin = contribution !== null && contribution <= 0;
  const noRoom = !noMargin && target !== null && target <= 0;
  const roas = valid && target !== null && target > 0 ? p / target : null;

  const money = (value: number | null) => (value === null ? "—" : brl.format(value));

  let status: string;
  if (!valid) status = "Preencha o preço de venda e os custos para ver o resultado.";
  else if (noMargin) status = "Com esses valores não sobra margem para pagar anúncios.";
  else if (noRoom) status = "A reserva consome toda a contribuição: não sobra espaço para mídia.";
  else
    status = `Sobram ${money(contribution)} por venda antes da mídia. Para preservar a reserva, cada venda pode custar até ${money(target)} em anúncios.`;

  return (
    <div className="grid gap-10 rounded border border-line bg-surface p-6 sm:p-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16 lg:p-12">
      <div>
        <h3 className="text-2xl font-bold leading-tight tracking-[-0.02em] sm:text-[1.875rem]">
          Quanto você pode pagar por uma venda?
        </h3>
        <p className="mt-3 max-w-md leading-relaxed text-fg-2">
          É a primeira conta do guia, na Lição 1.3. Os campos começam com os valores do exemplo; troque pelos
          números do seu negócio.
        </p>
        <div className="mt-8 grid gap-6">
          <MoneyField
            id={`${baseId}-preco`}
            name="preco"
            label="Preço de venda"
            hint="Quanto o cliente paga por um pedido."
            value={price}
            onChange={setPrice}
            invalid={p === null || p <= 0}
          />
          <MoneyField
            id={`${baseId}-custos`}
            name="custos-variaveis"
            label="Custos variáveis por venda"
            hint="Produto, embalagem, taxas, comissão, tributos e entrega."
            value={costs}
            onChange={setCosts}
            invalid={c === null}
          />
          <MoneyField
            id={`${baseId}-reserva`}
            name="reserva"
            label="Reserva para custos fixos e lucro"
            hint="O que precisa sobrar de cada venda depois dos anúncios."
            value={reserve}
            onChange={setReserve}
            invalid={r === null}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <dl className="divide-y divide-line border-y border-line">
          <div className="grid gap-2 py-5 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="text-fg-2">
              Contribuição antes da mídia
              <span className="mt-0.5 block text-sm text-fg-3">preço menos custos variáveis</span>
            </dt>
            <dd className="tabular text-2xl font-semibold">{money(contribution)}</dd>
          </div>
          <div className="grid gap-2 py-5 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="text-fg-2">
              CPA máximo
              <span className="mt-0.5 block text-sm text-fg-3">neste valor, o anúncio consome toda a contribuição</span>
            </dt>
            <dd className="tabular text-2xl font-semibold">{noMargin ? "—" : money(contribution)}</dd>
          </div>
          <div className="grid gap-3 py-6 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="text-fg">
              <span className="font-semibold">CPA desejado</span>
              <span className="mt-0.5 block text-sm text-fg-3">custo de anúncio por venda que preserva a reserva</span>
            </dt>
            <dd className="tabular text-[2.5rem] font-bold leading-none tracking-[-0.02em] sm:text-5xl">
              <span key={noMargin || noRoom ? "vazio" : target} className="num-swap inline-block">
                {noMargin || noRoom ? "—" : money(target)}
              </span>
            </dd>
          </div>
          <div className="grid gap-2 py-5 sm:flex sm:items-baseline sm:justify-between sm:gap-6">
            <dt className="text-fg-2">
              ROAS necessário
              <span className="mt-0.5 block text-sm text-fg-3">receita por real investido em mídia</span>
            </dt>
            <dd className="tabular text-2xl font-semibold">{roas === null ? "—" : ratio.format(roas)}</dd>
          </div>
        </dl>

        <p aria-live="polite" className="mt-6 leading-relaxed text-fg">
          {status}
        </p>
        <p className="mt-auto pt-6 text-sm leading-relaxed text-fg-3">
          Simulação didática. O resultado ainda não é lucro líquido: o guia mostra como incluir custos fixos, a
          remuneração da gestão e o cenário em que o teste não vende.
        </p>
      </div>
    </div>
  );
}
