"use client";

import { useEffect, useRef, useState } from "react";
import { SALES_CLOSED_EVENT } from "@/components/checkout-cta";

/** Mensagem exibida quando o checkout não está configurado e alguém tenta comprar. */
export function SalesClosedNotice() {
  const [visible, setVisible] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const show = () => {
      setVisible(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setVisible(false), 7000);
    };
    window.addEventListener(SALES_CLOSED_EVENT, show);
    return () => {
      window.removeEventListener(SALES_CLOSED_EVENT, show);
      window.clearTimeout(timer.current);
    };
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-4 z-70 flex justify-center px-4"
    >
      {visible ? (
        <p className="pointer-events-auto max-w-md rounded border border-line-strong bg-surface px-5 py-4 text-[0.9375rem] leading-snug text-fg shadow-[0_16px_40px_-16px_rgb(0_0_0/0.9)]">
          As vendas ainda não foram abertas. Você pode ler a página e a amostra; o botão de compra será ativado
          em breve.
        </p>
      ) : null}
    </div>
  );
}
