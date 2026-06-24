import { Thermometer, Blinds, Sofa, PanelTop } from "lucide-react";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";

const ITEMS = [
  {
    icon: Thermometer,
    title: "O ar-condicionado fica ligado, mas a casa continua quente.",
    body:
      "Grande parte do calor que você sente é transportada pela radiação infravermelha que atravessa os vidros.",
  },
  {
    icon: Blinds,
    title: "Cortinas sempre fechadas.",
    body:
      "Você sonhava com uma casa iluminada, mas vive no escuro só para fugir do sol e do calor.",
  },
  {
    icon: Sofa,
    title: "Móveis envelhecendo rápido.",
    body:
      "A radiação UV desbota sofás, cortinas, pisos e estofados e ainda envelhece a pele de quem convive na sala.",
  },
  {
    icon: PanelTop,
    title: "Janelas grandes viraram um problema.",
    body:
      "Elas exigem mais do que uma boa vista: exigem proteção térmica para virarem aliadas, não vilãs.",
  },
];

export function Problem() {
  return (
    <SectionShell id="problema" aria-labelledby="problema-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          O problema
        </PreTitle>
        <h2
          id="problema-title"
          className="mt-4 text-[clamp(2.1rem,4.08vw,3.3rem)] font-extrabold leading-tight text-brand-900"
        >
          Você reconhece alguma destas situações na sua rotina?
        </h2>
        <p className="mt-4 text-base text-ink-soft sm:text-lg px-18">
          Se mais de uma soa familiar, o vilão provavelmente está nos seus vidros e tem
          solução simples.
        </p>
      </Reveal>

      <div className="col-span-12 mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
        {ITEMS.map((item, i) => (
          <Reveal key={item.title} delay={i * 0.06} className="h-full">
            <GlassCard interactive className="flex h-full flex-col p-6 sm:p-8">
              <div className="mb-5 grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-brand-50 text-brand-900">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex min-w-0 flex-grow flex-col">
                <h3 className="font-display text-lg font-bold text-brand-900 sm:text-xl">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft sm:text-base">
                  {item.body}
                </p>
              </div>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
