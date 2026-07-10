import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Clock3, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/landing/Header";
import { GlassCard } from "@/components/landing/ui/GlassCard";
import { PreTitle } from "@/components/landing/ui/PreTitle";
import { Reveal } from "@/components/landing/ui/Reveal";
import { WhatsAppCTA } from "@/components/landing/ui/ActionButtons";
import { BackgroundBlobs } from "@/components/landing/ui/BackgroundBlobs";
import { QuoteCalculator } from "@/components/orcamento/QuoteCalculator";
import { PRECO_POR_M2, WHATSAPP_NUMERO, obterDescontoAtivo } from "@/lib/pricing.config";
import { formatBRL } from "@/lib/quote.functions";

const TITLE = "Simule seu orçamento em 1 minuto — Thermopelícula";
const DESCRIPTION =
  "Descubra na hora quanto custa proteger sua casa do calor com películas nanocerâmicas. Calculadora transparente: informe suas janelas e receba a estimativa no WhatsApp.";

export const Route = createFileRoute("/orcamento")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrcamentoPage,
});

function formatValidade(validoAte?: string) {
  if (!validoAte) return null;
  const [, mes, dia] = validoAte.split("-");
  return `${dia}/${mes}`;
}

const SELOS = [
  { icon: Sun, texto: "Bloqueia até 99% dos raios UV" },
  // { icon: ShieldCheck, texto: "Rejeita até 97% do calor" },
  { icon: Clock3, texto: "Instalação rápida e sem quebra-quebra" },
] as const;

function SelosConfianca({ className }: { className?: string }) {
  return (
    <ul className={className}>
      {SELOS.map(({ icon: Icon, texto }) => (
        <li
          key={texto}
          className="flex items-center gap-3 rounded-2xl bg-white/60 px-4 py-3 text-sm font-semibold text-brand-900 shadow-sm backdrop-blur lg:text-base"
        >
          <Icon className="h-5 w-5 shrink-0 text-brand-700" />
          {texto}
        </li>
      ))}
    </ul>
  );
}

function OrcamentoPage() {
  const desconto = obterDescontoAtivo();
  const validade = formatValidade(desconto?.validoAte);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-ambient text-ink">     

      <Header
        logoHref="/"
        nav={[
          { href: "/#solucao", label: "Solução" },
          { href: "/#beneficios", label: "Benefícios" },
          { href: "/#depoimentos", label: "Depoimentos" },
          { href: "/#faq", label: "FAQ" },
        ]}
      />

      <main>
        {/* Hero + calculadora */}
        <section
          id="simulador"
          aria-labelledby="orcamento-title"
          className="relative isolate w-full overflow-hidden pt-28 sm:pt-32 lg:flex lg:min-h-screen lg:items-center lg:pt-24"
        >
          <BackgroundBlobs />
          <div className="mx-auto w-full max-w-2xl px-5 pb-16 sm:px-8 lg:grid lg:max-w-[80rem] lg:grid-cols-2 lg:items-center lg:gap-12 lg:px-10 lg:pb-20 xl:gap-16 2xl:max-w-[86rem]">
            {/* Texto + CTAs (coluna esquerda no desktop) */}
            <Reveal className="text-center lg:text-left">
              {/* <PreTitle variant="brand">Calculadora de orçamento</PreTitle> */}
              {desconto && (
                <p className="mx-auto mt-4 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-1.5 text-xs font-bold text-emerald-700 sm:text-sm lg:mt-5 lg:px-5 lg:py-2 lg:text-base">
                  <Sparkles className="h-4 w-4 lg:h-5 lg:w-5" />
                  {desconto.rotulo}: {desconto.percentual}% OFF
                  {validade ? ` até ${validade}` : ""}
                </p>
              )}
              <h1
                id="orcamento-title"
                className="mt-5 text-[clamp(1.9rem,5.2vw,3.1rem)] font-extrabold leading-[1.08] text-brand-900 lg:mt-6 lg:text-[clamp(3rem,3.4vw,3.9rem)] lg:leading-[1.05]"
              >
                Descubra em 1 minuto quanto custa proteger sua casa do calor.
              </h1>
              <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg lg:mx-0 lg:mt-6 lg:max-w-xl lg:text-xl">
                Preço transparente: <strong className="text-ink">{formatBRL(PRECO_POR_M2)} por m² instalado</strong>.
                Sem cadastro, sem surpresa. Simule agora.
              </p>
              <SelosConfianca className="mt-9 hidden max-w-md grid-cols-1 gap-3 lg:grid" />
              {/* CTA direto — só no desktop; no mobile o header e o botão flutuante já cobrem */}
              <div className="mt-8 hidden items-center gap-4 lg:flex">
                <WhatsAppCTA
                  href={`https://wa.me/${WHATSAPP_NUMERO}?text=${encodeURIComponent("Olá! Estou na página de orçamento da Thermopelícula e quero falar com um especialista.")}`}
                  className="px-6 py-4 text-base"
                >
                  Falar com um especialista
                </WhatsAppCTA>
                <p className="text-sm text-ink-soft">
                  Resposta no mesmo dia útil
                  <br />
                  Sem compromisso
                </p>
              </div>

              
            </Reveal>

            {/* Calculadora (coluna direita no desktop) */}
            <Reveal delay={0.12} className="mt-9 lg:mt-0">
              <QuoteCalculator />
            </Reveal>

            {/* Selos de confiança — versão mobile, abaixo da calculadora */}
            <Reveal delay={0.18} className="lg:hidden">
              <SelosConfianca className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3" />
            </Reveal>
          </div>
        </section>

        {/* Credibilidade */}
        <section aria-label="Por que confiar na Thermopelícula" className="relative pb-20 lg:pb-24">
          <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 lg:max-w-4xl">
            <Reveal>
              <GlassCard variant="tinted" className="p-7 sm:p-9 lg:p-12">
                <p className="text-base leading-relaxed text-ink sm:text-lg lg:text-2xl lg:leading-relaxed">
                  “Depois que a equipe da Thermopelícula instalou o material de nanocerâmica, a
                  diferença foi imediata. A sala ficou muito mais fresca e o ar gela rapidinho
                  agora. Excelente investimento!”
                </p>
                <p className="mt-4 text-sm font-bold text-brand-900 lg:mt-6 lg:text-base">
                  Carlos E. <span className="font-medium text-ink-soft">· Volta Redonda — RJ</span>
                </p>
              </GlassCard>
            </Reveal>

            <Reveal delay={0.1} className="mt-8 text-center lg:mt-12">
              <p className="text-sm text-ink-soft lg:text-base">
                Quer conhecer todos os benefícios antes de decidir?
              </p>
              <Link
                to="/"
                className="group mt-3 inline-flex items-center gap-2 text-sm font-bold text-brand-900 transition-colors hover:text-brand-700 lg:text-lg"
              >
                Ver a página completa da Thermopelícula
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 lg:h-5 lg:w-5" />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="border-t border-brand-200/50 py-6 text-center text-xs text-ink-soft">
        © {new Date().getFullYear()} Thermopelícula. Todos os direitos reservados.
      </footer>

      <Toaster position="top-center" richColors closeButton />
    </div>
  );
}
