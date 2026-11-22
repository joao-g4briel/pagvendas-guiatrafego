"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Play, Volume2, X } from "lucide-react";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { formattedPrice, paymentMethodsShort, siteConfig } from "@/config/site";
import { trackVideoGate } from "@/lib/analytics";

const { src, poster, storageKey } = siteConfig.introVideo;

const NOTE = [
  `Aula grátis de amostra. O guia completo é em ${siteConfig.product.format}`,
  paymentMethodsShort || null,
  `${siteConfig.refund.legalDays} dias de garantia.`,
]
  .filter(Boolean)
  .join(" · ");

function readSeen(): boolean {
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function saveSeen(): void {
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Armazenamento bloqueado: o vídeo volta a abrir na próxima visita.
  }
}

/** O localStorage e a hidratação não avisam mudanças; o valor é relido a cada renderização. */
const subscribeNothing = () => () => {};

/**
 * Vídeo de entrada da página de vendas.
 *
 * No primeiro acesso, abre por cima da página e começa mudo. O botão de compra, "Ver a página
 * completa", o X e o Esc funcionam desde o início. Ao fechar, a visita fica marcada no
 * localStorage: quem volta vê só o botão "Ver a aula grátis", que reabre o vídeo.
 *
 * O HTML do servidor já vem com o vídeo aberto, então a página não pisca antes dele.
 * Para quem já fechou, o script do <head> (layout.tsx) marca o <html> antes da primeira pintura
 * e o CSS esconde o vídeo até este componente fechá-lo. Não mexe no histórico nem no botão voltar.
 */
export function VideoGate() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const soundRef = useRef(false);
  const reopenedRef = useRef(false);

  /** false no HTML do servidor e durante a hidratação; true logo depois. */
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  /** Já fechou o vídeo (nesta ou em outra visita). No servidor e na hidratação vale false: o vídeo sai aberto. */
  const seen = useSyncExternalStore(subscribeNothing, readSeen, () => false);
  /** Abrir ou fechar pedido pelo visitante; null segue o padrão (aberto só para quem ainda não fechou). */
  const [openOverride, setOpenOverride] = useState<boolean | null>(null);
  /** Depois de visto, o vídeo fica montado (oculto) e retoma de onde parou ao reabrir. */
  const [keepMounted, setKeepMounted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [paused, setPaused] = useState(false);

  const open = openOverride ?? !seen;
  /** Quem já fechou e não reabriu não monta o vídeo nem baixa o arquivo à toa. */
  const mounted = open || keepMounted;

  // Aberto: trava a rolagem, leva o foco para o diálogo e toca o vídeo.
  useEffect(() => {
    if (!hydrated || !open) return;
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    const video = videoRef.current;
    if (video) {
      // O React não escreve o atributo `muted` no HTML; sem a propriedade, o navegador barra o autoplay.
      if (!soundRef.current) video.muted = true;
      video.preload = "auto";
      video.play().catch(() => setPaused(true));
    }
    return () => {
      root.style.overflow = previousOverflow;
    };
  }, [hydrated, open]);

  const close = useCallback(() => {
    videoRef.current?.pause();
    saveSeen();
    setKeepMounted(true);
    setOpenOverride(false);
    if (reopenedRef.current) requestAnimationFrame(() => reopenRef.current?.focus());
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, close]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPaused(true));
    else video.pause();
  };

  // Liga o som e recomeça do 0:00.
  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    soundRef.current = true;
    video.muted = false;
    video.currentTime = 0;
    video.play().catch(() => setPaused(true));
    setSoundOn(true);
    trackVideoGate("AulaSomAtivado");
  };

  const reopen = () => {
    reopenedRef.current = true;
    setOpenOverride(true);
  };

  // Tab circula só entre os controles do diálogo enquanto ele está aberto.
  const keepFocusInside = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Tab") return;
    const focusable = Array.from(
      event.currentTarget.querySelectorAll<HTMLElement>("a[href], button:not(:disabled)"),
    );
    const first = focusable[0];
    const last = focusable.at(-1);
    if (!first || !last) return;
    const active = document.activeElement;
    if (event.shiftKey && (active === first || active === event.currentTarget)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <>
      {mounted ? (
        <div
          ref={dialogRef}
          className="aula-gate"
          role="dialog"
          aria-modal="true"
          aria-labelledby="aula-titulo"
          tabIndex={-1}
          hidden={!open}
          data-boot={hydrated ? undefined : ""}
          onKeyDown={keepFocusInside}
        >
          <div className="aula-box">
            <h2
              id="aula-titulo"
              className="mb-4 mr-14 text-[clamp(1.25rem,3.2vw,1.875rem)] font-extrabold leading-[1.1] tracking-[-0.02em]"
            >
              Antes de continuar: veja como criar sua primeira campanha.
            </h2>
            <button
              type="button"
              onClick={close}
              className="absolute -top-1.5 right-0 grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg transition-colors hover:border-fg"
              aria-label="Fechar o vídeo e ver a página"
            >
              <X aria-hidden="true" className="size-5" strokeWidth={2} />
            </button>

            <div className="relative aspect-video overflow-hidden rounded-[14px] border border-[#2a2a2a] bg-black">
              <video
                ref={videoRef}
                src={src}
                poster={poster ?? undefined}
                muted
                playsInline
                preload="metadata"
                className="block size-full cursor-pointer object-cover"
                onClick={togglePlay}
                onPlay={() => setPaused(false)}
                onPause={(event) => {
                  if (!event.currentTarget.ended) setPaused(true);
                }}
              >
                Seu navegador não reproduz este vídeo.
              </video>
              {!soundOn ? (
                <button
                  type="button"
                  onClick={enableSound}
                  className="aula-som absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full bg-fg px-5 py-3 text-[0.9375rem] font-bold text-ink shadow-[0_8px_30px_rgb(0_0_0/0.45)] max-sm:bottom-2.5 max-sm:gap-2 max-sm:px-3.5 max-sm:py-2 max-sm:text-[0.8125rem]"
                >
                  <Volume2 aria-hidden="true" className="size-5 max-sm:size-4" strokeWidth={2.25} />
                  Toque para ativar o som
                </button>
              ) : null}
              {paused ? (
                <button
                  type="button"
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto grid size-21 place-items-center rounded-full bg-fg text-ink"
                  aria-label="Continuar o vídeo"
                >
                  <Play aria-hidden="true" className="ml-1 size-8 fill-current" />
                </button>
              ) : null}
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              <CheckoutCta location="aula" onClick={() => trackVideoGate("AulaCliqueCompra")}>
                Quero o guia por {formattedPrice}
                <ArrowIcon />
              </CheckoutCta>
              <button type="button" onClick={close} className="btn btn-ghost">
                Ver a página completa
              </button>
            </div>
            <p className="mt-3.5 text-[0.8125rem] text-fg-3">{NOTE}</p>
          </div>
        </div>
      ) : null}

      {hydrated && !open ? (
        <button
          ref={reopenRef}
          type="button"
          onClick={reopen}
          className="aula-reopen fixed right-4 z-40 inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong bg-surface px-4.5 text-sm font-semibold text-fg shadow-[0_8px_30px_rgb(0_0_0/0.5)] hover:border-fg"
        >
          <Play aria-hidden="true" className="size-3.5 fill-current" />
          Ver a aula grátis
        </button>
      ) : null}
    </>
  );
}
