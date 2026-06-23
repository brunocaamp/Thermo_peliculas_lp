import { Thermometer, ShieldCheck, Zap, Eye } from "lucide-react";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";

const BENEFITS = [
  {
    icon: Thermometer,
    title: "Mais conforto térmico",
    body:
      "Ambientes mais agradáveis o dia todo. Diminui a entrada de calor pelos vidros e mantém a temperatura interna estável.",
  },
  {
    icon: ShieldCheck,
    title: "Proteção e saúde",
    body:
      "Bloqueia raios nocivos, evitando o desbotamento de móveis e o envelhecimento precoce da pele de quem está dentro de casa.",
  },
  {
    icon: Zap,
    title: "Eficiência energética",
    body:
      "Menor esforço do ar-condicionado para gelar o ambiente — gerando economia real na conta de luz todo mês.",
  },
  {
    icon: Eye,
    title: "Privacidade e estética",
    body:
      "Mais tranquilidade sem comprometer a entrada de luz natural — e ainda valoriza visualmente o ambiente.",
  },
];

export function Benefits() {
  return (
    <SectionShell id="beneficios" aria-labelledby="beneficios-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Benefícios
        </PreTitle>
        <h2
          id="beneficios-title"
          className="mt-4 text-[clamp(1.75rem,3.4vw,2.75rem)] font-extrabold leading-tight text-brand-900"
        >
          Por que escolher a tecnologia nanocerâmica?
        </h2>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Quatro ganhos imediatos que você sente no primeiro dia depois da instalação.
        </p>
      </Reveal>

      <div className="col-span-12 mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {BENEFITS.map((b, i) => (
          <Reveal key={b.title} delay={i * 0.06}>
            <GlassCard
              interactive
              variant="tinted"
              className="group flex h-full flex-col p-6 sm:p-7"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-900 to-brand-700 text-white shadow-[var(--shadow-elegant)] transition-transform duration-500 group-hover:scale-110">
                <b.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg font-bold text-brand-900">
                {b.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{b.body}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
