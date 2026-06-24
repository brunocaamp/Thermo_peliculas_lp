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
    <div id="depoimentos" aria-labelledby="depoimentos-title" className="section-shell-alt bg-gradient-to-br rounded-3xl from-ink to-brand-900 ml-[4vw] mr-[4vw] lg:ml-[6vw] lg:mr-[6vw] shadow-2xl">
      <Reveal className="col-span-12 mx-auto max-w-[80%] text-center lg:col-span-12 lg:col-start-1">
        <PreTitle variant="default">
          Depoimentos
        </PreTitle>
        <h2
          id="depoimentos-title"
          className="mt-4 text-[clamp(2.1rem,4.08vw,3.3rem)] font-extrabold leading-tight text-white"
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
                <div className="h-full p-4 sm:p-6">
                  <GlassCard variant="dark" className="relative h-full p-7 sm:p-8">
                    <Quote
                      aria-hidden="true"
                      className="absolute right-6 top-6 h-10 w-10 text-white/10"
                    />
                    <div className="flex items-center gap-1 text-brand-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <h3 className="mt-4 font-display text-lg font-bold leading-snug text-white">
                      {r.headline}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-brand-50/80">{r.body}</p>
                    <div className="mt-6 border-t border-white/10 pt-4">
                      <p className="text-sm font-semibold text-white">{r.author}</p>
                      <p className="text-xs text-brand-50/60">{r.city}</p>
                    </div>
                  </GlassCard>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex items-center justify-center gap-3">
            <CarouselPrevious className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/15 hover:text-white" />
            <CarouselNext className="static translate-y-0 border-white/10 bg-white/5 text-white hover:bg-white/15 hover:text-white" />
          </div>
        </Carousel>
      </div>
    </div>
  );
}
