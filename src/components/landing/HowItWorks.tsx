import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";
import { PrimaryCTA, WhatsAppCTA } from "./ui/ActionButtons";

const STEPS = [
  {
    n: "01",
    title: "Avaliamos o seu ambiente",
    body: "Visita técnica para entender exposição solar, vidros e necessidade real.",
  },
  {
    n: "02",
    title: "Indicamos a película ideal",
    body: "Recomendamos a especificação técnica certa para o seu caso e orçamento.",
  },
  {
    n: "03",
    title: "Instalamos sem bagunça",
    body: "Aplicação limpa, rápida e profissional — sem quebra-quebra na sua casa.",
  },
  {
    n: "04",
    title: "Você sente a diferença",
    body: "Já no primeiro dia: menos calor, mais luz, mais conforto, todos os dias.",
  },
];

export function HowItWorks() {
  return (
    <SectionShell id="como-funciona" aria-labelledby="como-title" className="pb-20">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Como funciona
        </PreTitle>
        <h2
          id="como-title"
          className="mt-4 text-[clamp(2.1rem,4.08vw,3.3rem)] font-extrabold leading-tight text-brand-900"
        >
          Instalação rápida e sem quebra-quebra.
        </h2>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Quatro passos simples — da primeira visita ao primeiro dia de conforto.
        </p>
      </Reveal>

      <div className="col-span-12 relative mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {/* Connector line on desktop */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[6%] right-[6%] top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-400/50 to-transparent xl:block"
        />
        {STEPS.map((s, i) => (
          <Reveal key={s.n} delay={i * 0.08}>
            <GlassCard interactive className="relative h-full p-6 sm:p-7">
              <div className="font-display text-5xl font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_var(--brand-400)]">
                {s.n}
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-brand-900">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
      <div className="col-span-12 mt-2 md:mt-10 justify-center items-center flex">
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <PrimaryCTA href="#contato">
            Solicitar orçamento
          </PrimaryCTA>
          <WhatsAppCTA href="https://wa.me/5524999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20Thermo%20Pel%C3%ADculas">
            Falar no WhatsApp
          </WhatsAppCTA>
        </div>
      </div>
    </SectionShell>
  );
}
