import { MapPin, Sparkles } from "lucide-react";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";
import { Float } from "./ui/Float";
import solutionAsset from "@/assets/landing/sobre_1.jpg";
import { PrimaryCTA, WhatsAppCTA } from "./ui/ActionButtons";

export function Solution() {
  return (
    <SectionShell id="solucao" aria-labelledby="solucao-title">
      <Reveal className="col-span-12 lg:col-span-6 lg:col-start-1">
        <div className="relative">
          <div className="relative overflow-hidden rounded-[2rem] shadow-[var(--shadow-glass-lg)]">
            <img
              src={solutionAsset}
              alt="Sala iluminada e fresca com vidros protegidos por película nanocerâmica"
              width={1500}
              height={1500}
              loading="lazy"
              className="aspect-square w-full object-cover"
            />
          </div>
          <Float className="absolute left-[-2rem] top-[4rem] right-6 hidden z-10 sm:block lg:left-auto lg:left-[-3rem] lg:max-w-xs">
            <GlassCard
              variant="strong"
              className="flex items-center gap-3 p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-brand-900">
                Tecnologia nanocerâmica de última geração
              </p>
            </GlassCard>
          </Float>
          <Float className="absolute right-[-2rem] bottom-[4rem] right-6 hidden z-10 sm:block lg:left-auto lg:right-[-3rem] lg:max-w-xs">
            <GlassCard
              variant="strong2"
              className="flex items-center gap-3 p-5"
            >
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-900 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <p className="text-sm font-semibold text-brand-900">
                Atendimento em Volta Redonda e todo o Sul Fluminense
              </p>
            </GlassCard>
          </Float>
        </div>
      </Reveal>

      <Reveal
        delay={0.1}
        className="col-span-12 lg:col-[8_/_span_5] lg:self-center"
      >
        <PreTitle>
          Sobre a Thermo Películas
        </PreTitle>
        <h2
          id="solucao-title"
          className="mt-4 text-[clamp(2.1rem,4.08vw,3.3rem)] font-extrabold leading-tight text-brand-900"
        >
          A solução definitiva está nos seus vidros.
        </h2>
        <p className="mt-5 text-base leading-relaxed text-ink-soft sm:text-lg">
          A Thermo Películas transforma a experiência dentro da sua casa. Especialistas em
          Volta Redonda e em todo o Sul Fluminense, instalamos películas de controle solar
          com tecnologia de nanocerâmica.
        </p>
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          Nossa missão é ajudar você a aproveitar melhor os ambientes, mantendo a
          luminosidade natural, bloqueando o calor antes que ele entre e protegendo sua
          família dos raios nocivos.
        </p>

        <div className="mt-7 flex flex-wrap items-center gap-3">
          <PrimaryCTA href="#contato">
            Solicitar orçamento
          </PrimaryCTA>
          <WhatsAppCTA href="https://wa.me/5524999999999?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20Thermo%20Pel%C3%ADculas">
            Falar no WhatsApp
          </WhatsAppCTA>
        </div>

      </Reveal>
    </SectionShell>
  );
}
