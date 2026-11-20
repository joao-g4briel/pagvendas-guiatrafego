"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LazyMotion, domAnimation, m, useMotionValue, useSpring, useTransform } from "motion/react";

type TabletMockupProps = {
  src: string;
  width: number;
  height: number;
  alt: string;
  sizes: string;
  preload?: boolean;
  /** Inclinação em repouso (graus). Use 0 para o tablet de frente. */
  restTilt?: number;
  /** Ativa inclinação e flutuação com o ponteiro (só no desktop). */
  interactive?: boolean;
};

const SPRING = { stiffness: 110, damping: 18, mass: 0.7 };
const INTERACTIVE_QUERY = "(min-width: 64rem) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

/**
 * Tablet desenhado em CSS em volta da capa real (o texto da capa vem da imagem, nunca redesenhado).
 * No desktop, com o ponteiro sobre a área marcada com data-tilt-zone, inclina até ~6° e flutua 6 px.
 */
export function TabletMockup({
  src,
  width,
  height,
  alt,
  sizes,
  preload = false,
  restTilt = -12,
  interactive = false,
}: TabletMockupProps) {
  const zoneRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [restTilt - 6, restTilt + 6]), SPRING);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [5, -3]), SPRING);

  useEffect(() => {
    if (!interactive) return;
    const query = window.matchMedia(INTERACTIVE_QUERY);
    const update = () => setEnabled(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, [interactive]);

  useEffect(() => {
    const zone = zoneRef.current?.closest<HTMLElement>("[data-tilt-zone]") ?? zoneRef.current;
    if (!enabled || !zone) {
      px.set(0);
      py.set(0);
      return;
    }
    const onEnter = (event: PointerEvent) => {
      if (event.pointerType === "mouse") setHovering(true);
    };
    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const rect = zone.getBoundingClientRect();
      px.set((event.clientX - rect.left) / rect.width - 0.5);
      py.set((event.clientY - rect.top) / rect.height - 0.5);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
      setHovering(false);
    };
    zone.addEventListener("pointerenter", onEnter);
    zone.addEventListener("pointermove", onMove, { passive: true });
    zone.addEventListener("pointerleave", onLeave);
    return () => {
      zone.removeEventListener("pointerenter", onEnter);
      zone.removeEventListener("pointermove", onMove);
      zone.removeEventListener("pointerleave", onLeave);
    };
  }, [enabled, px, py]);

  const floating = enabled && hovering;

  return (
    <LazyMotion features={domAnimation} strict>
      <div ref={zoneRef} className="relative">
        {/* luz no piso, sob o tablet */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-[7%] left-1/2 h-[12%] w-[90%] -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgb(255_255_255/0.16),transparent)] blur-md"
        />
        <m.div className="relative will-change-transform" style={{ rotateX, rotateY, transformPerspective: 1500 }}>
          <m.div
            animate={floating ? { y: [0, -6, 0] } : { y: 0 }}
            transition={floating ? { duration: 5, ease: "easeInOut", repeat: Infinity } : { duration: 0.6 }}
          >
            <div className="relative rounded-[9%/6%] bg-[linear-gradient(145deg,#3a3a3d_0%,#141416_38%,#0a0a0b_100%)] p-[3.4%] shadow-[0_50px_80px_-30px_rgb(0_0_0/0.95),0_20px_34px_-20px_rgb(0_0_0/0.9),inset_0_0_0_1px_rgb(255_255_255/0.14)]">
              {/* câmera */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-[1.5%] size-[1.4%] min-h-1 min-w-1 -translate-x-1/2 rounded-full bg-[#2b2b2e]"
              />
              <div className="relative overflow-hidden rounded-[6%/4%] bg-black ring-1 ring-black">
                <Image
                  src={src}
                  width={width}
                  height={height}
                  alt={alt}
                  sizes={sizes}
                  preload={preload}
                  quality={85}
                  className="block h-auto w-full"
                />
                {/* reflexo do vidro */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-[linear-gradient(118deg,rgb(255_255_255/0.12)_0%,rgb(255_255_255/0.03)_30%,transparent_52%)]"
                />
              </div>
            </div>
          </m.div>
        </m.div>
      </div>
    </LazyMotion>
  );
}
