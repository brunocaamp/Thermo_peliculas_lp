import { createFileRoute } from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import heroAsset from "@/assets/landing/hero.jpg.asset.json";

import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Benefits } from "@/components/landing/Benefits";
import { Comparison } from "@/components/landing/Comparison";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Faq } from "@/components/landing/Faq";
import { ContactForm } from "@/components/landing/ContactForm";
import { Footer } from "@/components/landing/Footer";
import { FloatingWhatsApp } from "@/components/landing/FloatingWhatsApp";

const TITLE =
  "Thermo Películas — Películas Nanocerâmicas em Volta Redonda e Sul Fluminense";
const DESCRIPTION =
  "Bloqueamos até 99% dos raios UV e 97% da radiação infravermelha mantendo a luz natural. Películas nanocerâmicas instaladas em Volta Redonda e todo o Sul Fluminense.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:image", content: heroAsset.url },
      { property: "og:url", content: "/" },
      { name: "twitter:title", content: TITLE },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:image", content: heroAsset.url },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preload", as: "image", href: heroAsset.url, fetchpriority: "high" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          name: "Thermo Películas",
          description: DESCRIPTION,
          image: heroAsset.url,
          telephone: "+55-24-99999-9999",
          areaServed: [
            { "@type": "City", name: "Volta Redonda" },
            { "@type": "City", name: "Barra Mansa" },
            { "@type": "City", name: "Resende" },
            { "@type": "Place", name: "Sul Fluminense" },
          ],
          address: {
            "@type": "PostalAddress",
            addressLocality: "Volta Redonda",
            addressRegion: "RJ",
            addressCountry: "BR",
          },
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "5",
            reviewCount: "4",
          },
        }),
      },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ambient text-ink">
      <Header />
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Comparison />
        <Benefits />
        <HowItWorks />
        <Testimonials />
        <Faq />
        <ContactForm />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
