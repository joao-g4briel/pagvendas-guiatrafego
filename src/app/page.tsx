import { Audience } from "@/components/audience";
import { Contents } from "@/components/contents";
import { Faq } from "@/components/faq";
import { FinalCta } from "@/components/final-cta";
import { Hero } from "@/components/hero";
import { Included } from "@/components/included";
import { MobileBuyBar } from "@/components/mobile-buy-bar";
import { Offer } from "@/components/offer";
import { Preview } from "@/components/preview";
import { Problems } from "@/components/problems";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main id="principal">
        <Hero />
        <Problems />
        <Contents />
        <Preview />
        <Included />
        <Audience />
        <Offer />
        <Faq />
        <FinalCta />
      </main>
      <SiteFooter />
      <MobileBuyBar />
    </>
  );
}
