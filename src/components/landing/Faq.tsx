import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";

const FAQ = [
  {
    q: "A casa fica escura?",
    a: "Não. A película atua sobre o calor e os raios UV, mas é pensada para manter a transparência e a luz natural — você ganha conforto sem perder claridade.",
  },
  {
    q: "Posso instalar em qualquer janela?",
    a: "Na grande maioria dos casos residenciais, sim. Na visita técnica avaliamos o vidro e indicamos a película ideal para cada ambiente.",
  },
  {
    q: "Onde vocês atendem?",
    a: "Atendemos Volta Redonda (RJ) e toda a região do Sul Fluminense. Fale com nossa equipe para confirmar a sua cidade.",
  },
];

export function Faq() {
  return (
    <SectionShell id="faq" aria-labelledby="faq-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Perguntas frequentes
        </PreTitle>
        <h2
          id="faq-title"
          className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-tight text-brand-900"
        >
          Tudo que você quer saber antes de decidir.
        </h2>
      </Reveal>

      <Reveal className="col-span-12 mt-10 lg:col-span-8 lg:col-start-3">
        <GlassCard className="p-3 sm:p-5">
          <Accordion type="single" collapsible className="w-full">
            {FAQ.map((item, i) => (
              <AccordionItem
                key={item.q}
                value={`item-${i}`}
                className="border-b border-brand-200/50 last:border-b-0"
              >
                <AccordionTrigger className="px-3 py-5 text-left font-display text-base font-bold text-brand-900 hover:no-underline sm:px-4 sm:text-lg">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-5 text-sm leading-relaxed text-ink-soft sm:px-4 sm:text-base">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </GlassCard>
      </Reveal>
    </SectionShell>
  );
}
