import { Link, createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock3, ShieldCheck, Sparkles, Sun } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/landing/Header";
import { GlassCard } from "@/components/landing/ui/GlassCard";
import { PreTitle } from "@/components/landing/ui/PreTitle";
import { BackgroundBlobs } from "@/components/landing/ui/BackgroundBlobs";
import { QuoteCalculatorV2 } from "@/components/orcamento/QuoteCalculatorV2";
import { VideoShowcase } from "@/components/orcamento/VideoShowcase";
import { PRECO_POR_M2, obterDescontoAtivo } from "@/lib/pricing.config";
import { formatBRL } from "@/lib/quote.functions";

const TITLE = "Simule seu orçamento em 1 minuto — Thermopelícula";
const DESCRIPTION =
  "Descubra na hora quanto custa proteger sua casa do calor com películas nanocerâmicas. Calculadora transparente: informe suas janelas e receba a estimativa no WhatsApp.";

export const Route = createFileRoute("/orcamento-v2")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
    ],
  }),
  component: OrcamentoV2Page,
});

function formatValidade(validoAte?: string) {
  if (!validoAte) return null;
  const [, mes, dia] = validoAte.split("-");
  return `${dia}/${mes}`;
}

const SELOS = [
  { icon: Sun, texto: "Bloqueia até 99% dos raios UV" },
  { icon: ShieldCheck, texto: "Rejeita até 97% do calor" },
  { icon: Clock3, texto: "Instalação rápida e limpa" },
] as const;

/** Fade-in de montagem, com atraso escalonado por seção. */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] as const },
});

function OrcamentoV2Page() {
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
        <section
          id="simulador"
          aria-labelledby="orcamento-v2-title"
          className="relative isolate w-full overflow-hidden pb-16 pt-28 sm:pt-32 lg:pb-24"
        >
          <BackgroundBlobs />

          {/* ── Cabeçalho centralizado ── */}
          <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
            <motion.div {...fadeUp(0)}>
              <PreTitle variant="brand">Calculadora de orçamento</PreTitle>
              <h1
                id="orcamento-v2-title"
                className="mt-5 text-[clamp(2rem,5vw,3.6rem)] font-extrabold leading-[1.06] text-brand-900"
              >
                Descubra em 1 minuto quanto custa proteger sua casa do calor.
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-ink-soft sm:text-lg lg:text-xl">
                Preço transparente:{" "}
                <strong className="text-ink">{formatBRL(PRECO_POR_M2)} por m² instalado</strong>. Sem
                cadastro, sem surpresa. Simule agora.
              </p>
            </motion.div>

            {/* Badges/selos alinhados horizontalmente */}
            <motion.ul
              {...fadeUp(0.12)}
              className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3"
            >
              {desconto && (
                <li className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-4 py-2 text-xs font-bold text-emerald-700 shadow-sm sm:text-sm">
                  <Sparkles className="h-4 w-4" />
                  {desconto.rotulo}: {desconto.percentual}% OFF
                  {validade ? ` até ${validade}` : ""}
                </li>
              )}
              {SELOS.map(({ icon: Icon, texto }) => (
                <li
                  key={texto}
                  className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-brand-900 shadow-sm backdrop-blur transition-transform duration-200 hover:scale-105 sm:text-sm"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-700" />
                  {texto}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* ── Container principal: calculadora (8/12) + mídia (4/12) ── */}
          <motion.div
            {...fadeUp(0.24)}
            className="mx-auto mt-10 w-[94vw] max-w-[90rem] lg:mt-14 lg:w-[92vw]"
          >
            <div className="glass-strong relative min-h-[80vh] overflow-hidden rounded-[2rem] shadow-[0_40px_90px_-30px_rgba(34,67,102,0.4),0_18px_40px_-22px_rgba(34,67,102,0.3)]">
              {/* Coluna esquerda: calculadora (o mr reserva a coluna da mídia no desktop) */}
              <div className="p-5 sm:p-8 lg:mr-[33.333%] lg:p-10 xl:p-12">
                <QuoteCalculatorV2 />
              </div>

              {/* Coluna direita: box de mídia (expande sobre a calculadora ao dar Play) */}
              <VideoShowcase />
            </div>
          </motion.div>
        </section>

        {/* ── Credibilidade ── */}
        <section aria-label="Por que confiar na Thermopelícula" className="relative pb-20 lg:pb-24">
          <div className="mx-auto w-full max-w-2xl px-5 sm:px-8 lg:max-w-4xl">
            <motion.div {...fadeUp(0.1)}>
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
            </motion.div>

            <motion.div {...fadeUp(0.2)} className="mt-8 text-center lg:mt-12">
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
            </motion.div>
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
