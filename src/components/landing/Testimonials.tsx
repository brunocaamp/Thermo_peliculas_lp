import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";

const REVIEWS = [
  {
    headline: "O ar-condicionado finalmente dá conta do recado!",
    body:
      "Moro em um apartamento que recebe o sol da tarde direto na sala. Antes, o ar-condicionado ficava no máximo e a casa continuava quente. Depois que a equipe da Thermo Películas instalou o material de nanocerâmica, a diferença foi imediata. A sala ficou muito mais fresca e o ar gela rapidinho agora. Excelente investimento!",
    author: "Carlos E.",
    city: "Volta Redonda — RJ",
  },
  {
    headline: "Luz natural sem estragar meus móveis",
    body:
      "Sempre sonhei com janelas grandes, mas vivia com as cortinas fechadas porque o sol estava desbotando meu sofá e o piso. Fiquei impressionada com o resultado da película! A casa continua super clara e iluminada, mas sem aquele 'efeito estufa'. O atendimento foi impecável do início ao fim.",
    author: "Mariana S.",
    city: "Barra Mansa — RJ",
  },
  {
    headline: "Instalação rápida e sem dor de cabeça",
    body:
      "Trabalho em home office e o calor perto da janela era insuportável à tarde. Confesso que adiei o serviço porque achei que faria bagunça em casa. Me enganei! A instalação foi super limpa, rápida e sem nenhum quebra-quebra. Mudou completamente o meu conforto no dia a dia. Recomendo de olhos fechados.",
    author: "Roberto F.",
    city: "Volta Redonda — RJ",
  },
  {
    headline: "Conforto para toda a família",
    body:
      "Fechamos a varanda com vidro e ela tinha virado uma sauna. Colocamos as películas da Thermo e o resultado é surreal. Você coloca a mão no vidro e sente ele quente, mas o calor simplesmente não entra no ambiente. Vale cada centavo para quem quer ter mais qualidade de vida e aproveitar a casa.",
    author: "Juliana T.",
    city: "Resende — RJ",
  },
];

export function Testimonials() {
  const autoplay = useRef(
    Autoplay({ delay: 5500, stopOnInteraction: true, stopOnMouseEnter: true }),
  );

  return (
    <SectionShell id="depoimentos" aria-labelledby="depoimentos-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Depoimentos
        </PreTitle>
        <h2
          id="depoimentos-title"
          className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-tight text-brand-900"
        >
          Quem protege a casa com a Thermo Películas comprova a eficiência.
        </h2>
      </Reveal>

      <div className="col-span-12 mt-10">
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[autoplay.current]}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {REVIEWS.map((r) => (
              <CarouselItem key={r.author} className="pl-4 md:basis-1/2 xl:basis-1/3">
                <GlassCard variant="strong" className="relative h-full p-7 sm:p-8">
                  <Quote
                    aria-hidden="true"
                    className="absolute right-6 top-6 h-10 w-10 text-brand-200"
                  />
                  <div className="flex items-center gap-1 text-brand-900">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold leading-snug text-brand-900">
                    {r.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  <div className="mt-6 border-t border-brand-200/50 pt-4">
                    <p className="text-sm font-semibold text-brand-900">{r.author}</p>
                    <p className="text-xs text-ink-soft">{r.city}</p>
                  </div>
                </GlassCard>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0 border-brand-900/15 bg-white/70 text-brand-900 hover:bg-white hover:text-brand-900" />
            <CarouselNext className="static translate-y-0 border-brand-900/15 bg-white/70 text-brand-900 hover:bg-white hover:text-brand-900" />
          </div>
        </Carousel>
      </div>
    </SectionShell>
  );
}
