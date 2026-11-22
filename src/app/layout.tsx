import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { Analytics } from "@/components/analytics/analytics";
import { DevPendingNotice } from "@/components/dev-pending-notice";
import { RevealObserver } from "@/components/reveal-observer";
import { SalesClosedNotice } from "@/components/sales-closed-notice";
import { hasTracking, siteConfig } from "@/config/site";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

const title = "Guia de Tráfego Pago em PDF | Metodaria";
const description =
  "Antes de impulsionar, tenha um plano. Guia em PDF para planejar anúncios, organizar o orçamento e acompanhar resultados: 53 páginas, 16 módulos, exercícios e checklists para pequenos negócios.";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: { default: title, template: "%s | Metodaria" },
  description,
  applicationName: "Metodaria",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: "Metodaria",
    title,
    description,
    url: "/",
  },
  twitter: { card: "summary_large_image", title, description },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#080808",
  colorScheme: "dark",
};

/**
 * Ativa a revelação de seções só quando há IntersectionObserver e o visitante não pediu
 * redução de movimento. Se o observador não confirmar em 2,5 s, tudo volta a aparecer.
 */
const revealBootstrap = `(function(){try{var d=document.documentElement;if(!('IntersectionObserver' in window)||matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('rv');setTimeout(function(){if(!d.classList.contains('rv-ready'))d.classList.remove('rv')},2500)}catch(e){}})();`;

/**
 * Vídeo de entrada: marca o <html> antes da primeira pintura. `data-js` mantém o bloqueio só para quem
 * roda JavaScript; `data-aula-liberada` esconde o bloqueio de quem já liberou a página, sem piscar.
 */
const videoGateBootstrap = `(function(){var d=document.documentElement;d.setAttribute('data-js','');try{if(localStorage.getItem(${JSON.stringify(siteConfig.introVideo.storageKey)})==='1')d.setAttribute('data-aula-liberada','')}catch(e){}})();`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={montserrat.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: revealBootstrap }} />
        <script dangerouslySetInnerHTML={{ __html: videoGateBootstrap }} />
      </head>
      <body>
        {/* Aviso de pendências: oculto por padrão; ligue com SHOW_PENDING_NOTICE=true em desenvolvimento. */}
        {process.env.NODE_ENV === "development" && process.env.SHOW_PENDING_NOTICE === "true" ? (
          <DevPendingNotice />
        ) : null}
        {children}
        <RevealObserver />
        <SalesClosedNotice />
        {hasTracking ? <Analytics /> : null}
        <VercelAnalytics />

      </body>
    </html>
  );
}
