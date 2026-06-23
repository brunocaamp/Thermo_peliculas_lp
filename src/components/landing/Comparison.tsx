import { CheckCircle2, XCircle } from "lucide-react";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";
import { PrimaryCTA, WhatsAppCTA } from "./ui/ActionButtons";

const WITHOUT = [
  "Excesso de calor exigindo o máximo do ar-condicionado.",
  "Móveis e pisos sofrendo desbotamento contínuo.",
  "Necessidade de manter cortinas fechadas bloqueando a vista.",
];

const WITH = [
  "Temperatura controlada desde os vidros.",
  "Interior da casa preservado por muito mais tempo.",
  "Luz natural liberada sem o desconforto térmico.",
];

export function Comparison() {
  return (
    <SectionShell id="comparativo" aria-labelledby="comparativo-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Comparativo
        </PreTitle>
        <h2
          id="comparativo-title"
          className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-tight text-brand-900"
        >
          Com e sem Thermo Películas
        </h2>
      </Reveal>

      <Reveal delay={0.05} className="col-span-12 mt-10 md:col-span-6">
        <GlassCard className="h-full overflow-hidden p-7 sm:p-9">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-rose-400/0 via-rose-400/70 to-rose-400/0"
          />
          <PreTitle variant="rose">
            Sem película
          </PreTitle>
          <ul className="mt-6 space-y-4">
            {WITHOUT.map((item) => (
              <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-500" />
                <span className="text-sm leading-relaxed text-ink sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>

      <Reveal delay={0.12} className="col-span-12 mt-2 md:col-span-6 md:mt-10">
        <GlassCard
          variant="tinted"
          className="relative h-full overflow-hidden p-7 sm:p-9"
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-400/0 via-brand-900 to-brand-400/0"
          />
          <PreTitle variant="dark">
            Com Thermo Películas
          </PreTitle>
          <ul className="mt-6 space-y-4">
            {WITH.map((item) => (
              <li key={item} className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-brand-900" />
                <span className="text-sm leading-relaxed text-ink sm:text-base">{item}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      </Reveal>
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
