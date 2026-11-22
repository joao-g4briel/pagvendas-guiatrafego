"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Play, Volume2, X } from "lucide-react";
import { ArrowIcon, CheckoutCta } from "@/components/checkout-cta";
import { formattedPrice, paymentMethodsShort, siteConfig } from "@/config/site";
import { trackVideoGate } from "@/lib/analytics";

/** Segundos realmente assistidos para aparecer o botão de compra. */
const COMPRA = 30;
/** Segundos realmente assistidos para liberar a página ("Ver a página completa", X e Esc). */
const SAIDA = 60;
/** Maior avanço entre dois `timeupdate` que ainda conta como assistido. Acima disso é pulo. */
const PASSO_MAXIMO = 2.5;
/** Duração usada para posicionar as marcas até o navegador ler a do arquivo. */
const DURACAO_PROVISORIA = 120;

const { src, poster, storageKey } = siteConfig.introVideo;

const MARKS = [
  { label: "Compra", seconds: COMPRA },
  { label: "Página", seconds: SAIDA },
];

const NOTE = [
  `Aula grátis de amostra. O guia completo é em ${siteConfig.product.format}`,
  paymentMethodsShort || null,
  `${siteConfig.refund.legalDays} dias de garantia.`,
]
  .filter(Boolean)
  .join(" · ");

/** 27.2 → "0:28" (arredonda para cima: o contador nunca mostra 0:00 antes da hora). */
function mmss(seconds: number): string {
  const total = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function readUnlocked(): boolean {
  try {
    return window.localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function saveUnlocked(): void {
  try {
    window.localStorage.setItem(storageKey, "1");
  } catch {
    // Armazenamento bloqueado: a página fica liberada só nesta visita.
  }
}

/** O localStorage e a hidratação não avisam mudanças; o valor é relido a cada renderização. */
const subscribeNothing = () => () => {};

/**
 * Vídeo de entrada da página de vendas.
 *
 * No primeiro acesso, abre por cima da página, começa mudo e conta só o tempo realmente
 * assistido: COMPRA segundos mostram o botão de compra; SAIDA segundos (ou o fim do vídeo)
 * liberam a página. Quem já liberou não é bloqueado de novo e vê só o botão "Ver a aula grátis",
 * que reabre o vídeo sem trava.
 *
 * O HTML do servidor já vem com o bloqueio aberto, então a página não pisca antes dele.
 * Para quem já liberou, o script do <head> (layout.tsx) marca o <html> antes da primeira pintura
 * e o CSS esconde o bloqueio até este componente fechá-lo. Não mexe no histórico nem no botão voltar.
 */
export function VideoGate() {
  const dialogRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reopenRef = useRef<HTMLButtonElement>(null);
  const watchedRef = useRef(0);
  const lastTimeRef = useRef(0);
  const soundRef = useRef(false);
  const buyTrackedRef = useRef(false);
  const unlockTrackedRef = useRef(false);
  const reopenedRef = useRef(false);

  /** false no HTML do servidor e durante a hidratação; true logo depois. */
  const hydrated = useSyncExternalStore(subscribeNothing, () => true, () => false);
  /** Já liberou (nesta ou em outra visita). No servidor e na hidratação vale false: o bloqueio sai aberto. */
  const stored = useSyncExternalStore(subscribeNothing, readUnlocked, () => false);
  /** Liberado nesta visita, para quando o localStorage está bloqueado. */
  const [sessionUnlocked, setSessionUnlocked] = useState(false);
  /** Abrir ou fechar pedido pelo visitante; null segue o padrão (aberto só para quem não liberou). */
  const [openOverride, setOpenOverride] = useState<boolean | null>(null);
  /** Depois de visto, o vídeo fica montado (oculto) e retoma de onde parou ao reabrir. */
  const [keepMounted, setKeepMounted] = useState(false);
  const [watched, setWatched] = useState(0);
  const [duration, setDuration] = useState(0);
  const [soundOn, setSoundOn] = useState(false);
  const [paused, setPaused] = useState(false);

  const unlocked = stored || sessionUnlocked;
  const open = openOverride ?? !stored;
  /** Quem já liberou e não reabriu não monta o vídeo nem baixa o arquivo à toa. */
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
    if (!unlocked) return;
    videoRef.current?.pause();
    setKeepMounted(true);
    setOpenOverride(false);
    if (reopenedRef.current) requestAnimationFrame(() => reopenRef.current?.focus());
  }, [unlocked]);

  // Esc só fecha depois de liberado.
  useEffect(() => {
    if (!open || !unlocked) return;
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, unlocked, close]);

  const registerWatched = (value: number) => {
    watchedRef.current = value;
    setWatched(value);
    if (unlocked) return;
    if (value >= COMPRA && !buyTrackedRef.current) {
      buyTrackedRef.current = true;
      trackVideoGate("AulaCompraLiberada");
    }
    if (value >= SAIDA && !unlockTrackedRef.current) {
      unlockTrackedRef.current = true;
      setSessionUnlocked(true);
      setOpenOverride(true); // continua aberto até o visitante fechar
      saveUnlocked();
      trackVideoGate("AulaPaginaLiberada");
    }
  };

  // Soma só o avanço contínuo do vídeo: pausado não gera timeupdate e pulos ficam de fora.
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;
    const step = video.currentTime - lastTimeRef.current;
    lastTimeRef.current = video.currentTime;
    if (step > 0 && step < PASSO_MAXIMO) registerWatched(watchedRef.current + step);
  };

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => setPaused(true));
    else video.pause();
  };

  // Liga o som e recomeça do 0:00, sem zerar o tempo já assistido.
  const enableSound = () => {
    const video = videoRef.current;
    if (!video) return;
    soundRef.current = true;
    video.muted = false;
    video.currentTime = 0;
    lastTimeRef.current = 0;
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

  const buyVisible = unlocked || watched >= COMPRA;
  const total = duration > 0 ? duration : DURACAO_PROVISORIA;
  const at = (seconds: number) => Math.min(100, (seconds / total) * 100);
  const announcement = unlocked ? "A página foi liberada." : buyVisible ? "O botão de compra foi liberado." : "";

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
            {unlocked ? (
              <button
                type="button"
                onClick={close}
                className="aula-fade absolute -top-1.5 right-0 grid size-11 place-items-center rounded-full border border-line-strong bg-surface text-fg transition-colors hover:border-fg"
                aria-label="Fechar o vídeo e ver a página"
              >
                <X aria-hidden="true" className="size-5" strokeWidth={2} />
              </button>
            ) : null}

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
                onTimeUpdate={handleTimeUpdate}
                onSeeking={(event) => {
                  lastTimeRef.current = event.currentTarget.currentTime;
                }}
                onEnded={() => registerWatched(Math.max(watchedRef.current, SAIDA, duration))}
                onPlay={() => setPaused(false)}
                onPause={(event) => {
                  if (!event.currentTarget.ended) setPaused(true);
                }}
                onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
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

            {/* Progresso do tempo assistido, só visual: o estado vai nos textos dos botões. */}
            <div aria-hidden="true">
              <div className="relative mt-4.5 h-1.5 rounded-full bg-line">
                <div
                  className="aula-fill absolute inset-y-0 left-0 rounded-full bg-fg"
                  style={{ width: `${at(watched)}%` }}
                />
                {MARKS.map((mark) => (
                  <i
                    key={mark.label}
                    className={`absolute -top-1 h-3.5 w-0.5 -translate-x-1/2 ${
                      unlocked || watched >= mark.seconds ? "bg-fg" : "bg-[#6a6a6a]"
                    }`}
                    style={{ left: `${at(mark.seconds)}%` }}
                  />
                ))}
              </div>
              <div className="relative mt-2 h-4.5 text-xs text-fg-3">
                {MARKS.map((mark) => (
                  <span
                    key={mark.label}
                    className="absolute -translate-x-1/2 whitespace-nowrap"
                    style={{ left: `${at(mark.seconds)}%` }}
                  >
                    {mark.label}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4.5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
              {buyVisible ? (
                <CheckoutCta location="aula" onClick={() => trackVideoGate("AulaCliqueCompra")} className="aula-rise">
                  Quero o guia por {formattedPrice}
                  <ArrowIcon />
                </CheckoutCta>
              ) : (
                <p className="tabular flex min-h-13 items-center justify-center rounded-lg border border-dashed border-line-strong px-4.5 text-[0.9375rem] text-fg-2">
                  O botão de compra aparece em {mmss(COMPRA - watched)}
                </p>
              )}
              <button type="button" onClick={close} disabled={!unlocked} className="btn btn-ghost tabular min-h-13">
                {unlocked ? "Ver a página completa" : `Ver a página em ${mmss(SAIDA - watched)}`}
              </button>
            </div>
            <p className="mt-3.5 text-[0.8125rem] text-fg-3">{NOTE}</p>
            <p className="sr-only" aria-live="polite">
              {announcement}
            </p>
          </div>
        </div>
      ) : null}

      {hydrated && unlocked && !open ? (
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
