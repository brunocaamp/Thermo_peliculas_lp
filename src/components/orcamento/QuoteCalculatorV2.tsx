import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Minus,
  PencilRuler,
  Plus,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { LeadSchema, submitLead, type Lead } from "@/lib/lead.functions";
import { TAMANHOS_JANELA } from "@/lib/pricing.config";
import {
  calcularOrcamento,
  formatBRL,
  formatM2,
  linkWhatsAppOrcamento,
} from "@/lib/quote.functions";

/* ============================================================
 * Calculadora de orçamento — VERSÃO 2
 * Diferenças em relação à v1:
 *  - Não se envolve em GlassCard: o container da página é a superfície.
 *  - Tamanho individual por janela é o padrão; um toggle aplica o
 *    mesmo tamanho para todas de uma vez.
 *  - Tipografia maior, cards de janela com separação visual clara,
 *    focus rings e microinterações em todos os controles.
 * ============================================================ */

function maskWhatsapp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const PASSOS = ["Janelas", "Tamanho", "Resultado"] as const;

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 56 : -56 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -56 : 56 }),
};

/** Configuração de tamanho de uma janela (preset ou medidas manuais). */
type JanelaConfig = { tamanhoId: string; largura: number; altura: number };

const CONFIG_PADRAO: JanelaConfig = { tamanhoId: "media", largura: 1.5, altura: 1.4 };

const fmtMetros = (n: number) => n.toFixed(1).replace(".", ",");

function areaDeConfig({ tamanhoId, largura, altura }: JanelaConfig): number {
  if (tamanhoId === "custom") return largura * altura;
  const preset = TAMANHOS_JANELA.find((t) => t.id === tamanhoId) ?? TAMANHOS_JANELA[1];
  return preset.largura * preset.altura;
}

function rotuloDeConfig({ tamanhoId, largura, altura }: JanelaConfig): string {
  if (tamanhoId === "custom") return `${fmtMetros(largura)} × ${fmtMetros(altura)} m`;
  return TAMANHOS_JANELA.find((t) => t.id === tamanhoId)?.rotulo ?? "Média";
}

/** Classes compartilhadas de foco/microinteração dos controles. */
const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

function AnimatedPrice({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const controls = animate(0, value, {
      duration: 1.1,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        node.textContent = formatBRL(v);
      },
    });
    return () => controls.stop();
  }, [value]);
  return <span ref={ref}>{formatBRL(value)}</span>;
}

/** Desenho proporcional de uma janela, usado nos cards de tamanho. */
function WindowGlyph({ largura, altura }: { largura: number; altura: number }) {
  const escala = 28;
  return (
    <div className="flex h-[4.5rem] items-end justify-center">
      <div
        className="relative rounded-md border-2 border-brand-700/70 bg-brand-50/70"
        style={{ width: largura * escala, height: altura * escala }}
      >
        <div className="absolute inset-y-0 left-1/2 w-[2px] -translate-x-1/2 bg-brand-700/40" />
        <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-brand-700/40" />
      </div>
    </div>
  );
}

/** Par de sliders largura × altura. */
function SlidersLarguraAltura({
  largura,
  altura,
  onLargura,
  onAltura,
  className,
}: {
  largura: number;
  altura: number;
  onLargura: (v: number) => void;
  onAltura: (v: number) => void;
  className?: string;
}) {
  return (
    <div className={cn("space-y-5 rounded-2xl bg-white/80 p-5", className)}>
      <div>
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-brand-900">Largura</span>
          <span className="font-bold text-brand-700">{fmtMetros(largura)} m</span>
        </div>
        <Slider
          className="mt-3"
          min={0.5}
          max={4}
          step={0.1}
          value={[largura]}
          onValueChange={([v]) => onLargura(v)}
          aria-label="Largura da janela em metros"
        />
      </div>
      <div>
        <div className="flex items-center justify-between text-base">
          <span className="font-semibold text-brand-900">Altura</span>
          <span className="font-bold text-brand-700">{fmtMetros(altura)} m</span>
        </div>
        <Slider
          className="mt-3"
          min={0.5}
          max={3}
          step={0.1}
          value={[altura]}
          onValueChange={([v]) => onAltura(v)}
          aria-label="Altura da janela em metros"
        />
      </div>
      <p className="text-center text-sm text-ink-soft">
        ≈ {formatM2(largura * altura)} por janela
      </p>
    </div>
  );
}

export function QuoteCalculatorV2() {
  const [passo, setPasso] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const [janelas, setJanelas] = useState(4);
  /** v2: individual é o padrão; o toggle liga o modo "mesmo tamanho para todas". */
  const [mesmoTamanho, setMesmoTamanho] = useState(false);
  const [padrao, setPadrao] = useState<JanelaConfig>({ ...CONFIG_PADRAO });
  const [janelasConfig, setJanelasConfig] = useState<JanelaConfig[]>(() =>
    Array.from({ length: 4 }, () => ({ ...CONFIG_PADRAO })),
  );
  const [mostrarForm, setMostrarForm] = useState(false);
  const [pending, setPending] = useState(false);

  const irPara = (novoPasso: number) => {
    setDirecao(novoPasso > passo ? 1 : -1);
    setPasso(novoPasso);
  };

  // Mantém a lista de configurações individuais em sincronia com a quantidade.
  useEffect(() => {
    setJanelasConfig((prev) => {
      if (prev.length === janelas) return prev;
      const next = prev.slice(0, janelas);
      while (next.length < janelas) next.push({ ...CONFIG_PADRAO });
      return next;
    });
  }, [janelas]);

  const setJanelaConfig = (i: number, patch: Partial<JanelaConfig>) =>
    setJanelasConfig((prev) => prev.map((c, idx) => (idx === i ? { ...c, ...patch } : c)));

  const orcamento = useMemo(() => {
    if (!mesmoTamanho) {
      const detalhes = janelasConfig.map((c) => ({
        rotulo: rotuloDeConfig(c),
        area: areaDeConfig(c),
      }));
      const areaTotal = detalhes.reduce((soma, d) => soma + d.area, 0);
      return calcularOrcamento({
        janelas,
        areaTotalM2: areaTotal,
        tamanhoRotulo: "Tamanhos individuais",
        individual: true,
        detalhes,
      });
    }
    const area = areaDeConfig(padrao);
    return calcularOrcamento({
      janelas,
      areaTotalM2: janelas * area,
      tamanhoRotulo: padrao.tamanhoId === "custom" ? "Personalizado" : rotuloDeConfig(padrao),
    });
  }, [mesmoTamanho, janelas, janelasConfig, padrao]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: { name: "", whatsapp: "", city: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setPending(true);
    try {
      await submitLead(data);
      toast.success("Orçamento enviado! Estamos abrindo seu WhatsApp…");
      window.open(linkWhatsAppOrcamento(orcamento, data), "_blank", "noopener,noreferrer");
    } catch {
      toast.error("Não conseguimos enviar agora. Use o botão verde do WhatsApp.");
    } finally {
      setPending(false);
    }
  });

  return (
    <div>
      {/* Indicador de passos */}
      <ol className="flex items-center justify-center gap-2 sm:gap-3" aria-label="Etapas da simulação">
        {PASSOS.map((rotulo, i) => (
          <li key={rotulo} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => i < passo && irPara(i)}
              disabled={i > passo}
              className={cn(
                "flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-300",
                focusRing,
                i === passo && "bg-brand-900 text-white shadow-sm",
                i < passo && "bg-brand-200/70 text-brand-900 hover:bg-brand-200 hover:scale-105",
                i > passo && "bg-brand-50 text-ink-soft",
              )}
            >
              <span
                className={cn(
                  "flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold",
                  i === passo ? "bg-white/20" : "bg-brand-900/10",
                )}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{rotulo}</span>
            </button>
            {i < PASSOS.length - 1 && (
              <span className="h-px w-5 bg-brand-200 sm:w-10" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 min-h-[23rem]">
        <AnimatePresence mode="wait" custom={direcao} initial={false}>
          {/* ─── Passo 1: quantidade de janelas ─── */}
          {passo === 0 && (
            <motion.div
              key="passo-janelas"
              custom={direcao}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-2xl font-extrabold text-brand-900 lg:text-3xl">
                Quantas janelas você quer proteger?
              </h3>
              <p className="mt-2.5 text-center text-base text-ink-soft lg:text-lg">
                Conte todas as janelas e portas de vidro que recebem sol.
              </p>

              <div className="mx-auto mt-9 flex max-w-sm items-center justify-center gap-5">
                <button
                  type="button"
                  onClick={() => setJanelas((j) => Math.max(1, j - 1))}
                  aria-label="Diminuir quantidade de janelas"
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-900 shadow-sm transition-all duration-200 hover:bg-brand-200/60 hover:shadow active:scale-90",
                    focusRing,
                  )}
                >
                  <Minus className="h-6 w-6" />
                </button>
                <div className="flex h-24 w-28 items-center justify-center rounded-3xl bg-brand-900 text-5xl font-extrabold text-white shadow-[var(--shadow-elegant)]">
                  {janelas}
                </div>
                <button
                  type="button"
                  onClick={() => setJanelas((j) => Math.min(40, j + 1))}
                  aria-label="Aumentar quantidade de janelas"
                  className={cn(
                    "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-900 shadow-sm transition-all duration-200 hover:bg-brand-200/60 hover:shadow active:scale-90",
                    focusRing,
                  )}
                >
                  <Plus className="h-6 w-6" />
                </button>
              </div>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
                {[2, 4, 6, 8, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setJanelas(n)}
                    className={cn(
                      "h-11 min-w-14 rounded-full px-5 text-base font-semibold transition-all duration-200",
                      focusRing,
                      janelas === n
                        ? "bg-brand-900 text-white shadow-sm scale-105"
                        : "bg-brand-50 text-brand-700 hover:bg-brand-200/60 hover:scale-105",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => irPara(1)}
                className={cn(
                  "group mx-auto mt-10 flex h-15 w-full max-w-xl items-center justify-center gap-2 rounded-2xl bg-brand-900 text-lg font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]",
                  focusRing,
                )}
              >
                Continuar
                <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {/* ─── Passo 2: tamanhos (individual por padrão) ─── */}
          {passo === 1 && (
            <motion.div
              key="passo-tamanho"
              custom={direcao}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-2xl font-extrabold text-brand-900 lg:text-3xl">
                {mesmoTamanho ? "Qual o tamanho das janelas?" : "Qual o tamanho de cada janela?"}
              </h3>
              <p className="mt-2.5 text-center text-base text-ink-soft lg:text-lg">
                {mesmoTamanho
                  ? "Escolha o mais parecido — vale para todas. Não precisa ser exato."
                  : "Ajuste cada janela abaixo — não precisa ser exato."}
              </p>

              {/* Toggle: mesmo tamanho para todas */}
              <label
                htmlFor="mesmo-tamanho"
                className="mx-auto mt-6 flex w-fit cursor-pointer items-center gap-3 rounded-full border border-brand-200/70 bg-white/70 px-5 py-3 shadow-sm transition-all duration-200 hover:border-brand-400/60 hover:shadow"
              >
                <Switch
                  id="mesmo-tamanho"
                  checked={mesmoTamanho}
                  onCheckedChange={setMesmoTamanho}
                  aria-label="Aplicar o mesmo tamanho para todas as janelas"
                />
                <span className="text-sm font-semibold text-brand-900 sm:text-base">
                  Aplicar o mesmo tamanho para todas
                </span>
              </label>

              {/* ── Mesmo tamanho para todas ── */}
              {mesmoTamanho && (
                <>
                  <div
                    className="mt-6 grid grid-cols-3 gap-2.5 sm:gap-4"
                    role="radiogroup"
                    aria-label="Tamanho das janelas"
                  >
                    {TAMANHOS_JANELA.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        role="radio"
                        aria-checked={padrao.tamanhoId === t.id}
                        onClick={() => setPadrao((p) => ({ ...p, tamanhoId: t.id }))}
                        className={cn(
                          "rounded-2xl border p-3.5 text-center transition-all duration-200 sm:p-5",
                          focusRing,
                          padrao.tamanhoId === t.id
                            ? "border-brand-900 bg-white shadow-md ring-2 ring-brand-900"
                            : "border-brand-200/60 bg-white/60 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow",
                        )}
                      >
                        <WindowGlyph largura={t.largura} altura={t.altura} />
                        <p className="mt-3 text-base font-bold text-brand-900">{t.rotulo}</p>
                        <p className="mt-0.5 text-xs leading-tight text-ink-soft sm:text-sm">{t.exemplo}</p>
                        <p className="mt-1 text-xs font-semibold text-brand-700 sm:text-sm">
                          {String(t.largura).replace(".", ",")} × {String(t.altura).replace(".", ",")} m
                        </p>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    role="radio"
                    aria-checked={padrao.tamanhoId === "custom"}
                    onClick={() => setPadrao((p) => ({ ...p, tamanhoId: "custom" }))}
                    className={cn(
                      "mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border p-4 text-base font-semibold transition-all duration-200",
                      focusRing,
                      padrao.tamanhoId === "custom"
                        ? "border-brand-900 bg-white text-brand-900 shadow-md ring-2 ring-brand-900"
                        : "border-brand-200/60 bg-white/60 text-brand-700 hover:bg-white/90 hover:shadow",
                    )}
                  >
                    <PencilRuler className="h-5 w-5" />
                    Sei as medidas — personalizar
                  </button>

                  <AnimatePresence initial={false}>
                    {padrao.tamanhoId === "custom" && (
                      <motion.div
                        key="sliders-padrao"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <SlidersLarguraAltura
                          className="mt-3 border border-brand-200/60"
                          largura={padrao.largura}
                          altura={padrao.altura}
                          onLargura={(v) => setPadrao((p) => ({ ...p, largura: v }))}
                          onAltura={(v) => setPadrao((p) => ({ ...p, altura: v }))}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* ── Individual (padrão da v2) ── */}
              {!mesmoTamanho && (
                <div className="mt-6 grid grid-cols-1 gap-3.5 xl:grid-cols-2">
                  {janelasConfig.map((cfg, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: Math.min(i * 0.05, 0.4) }}
                      className={cn(
                        "rounded-2xl border p-4 transition-shadow duration-200 hover:shadow-md sm:p-5",
                        i % 2 === 0
                          ? "border-brand-200/70 bg-white/75"
                          : "border-brand-200/50 bg-brand-50/60",
                      )}
                    >
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-base font-bold text-brand-900">
                          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-900/10 text-xs font-extrabold text-brand-900">
                            {i + 1}
                          </span>
                          Janela {i + 1}
                        </span>
                        <span className="rounded-full bg-brand-900/5 px-3 py-1 text-sm font-semibold text-brand-700">
                          {formatM2(areaDeConfig(cfg))}
                        </span>
                      </div>
                      <div
                        className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4"
                        role="radiogroup"
                        aria-label={`Tamanho da janela ${i + 1}`}
                      >
                        {TAMANHOS_JANELA.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            role="radio"
                            aria-checked={cfg.tamanhoId === t.id}
                            onClick={() => setJanelaConfig(i, { tamanhoId: t.id })}
                            className={cn(
                              "rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-200",
                              focusRing,
                              cfg.tamanhoId === t.id
                                ? "bg-brand-900 text-white shadow-sm"
                                : "bg-white text-brand-700 shadow-sm hover:bg-brand-50 hover:scale-[1.03]",
                            )}
                          >
                            {t.rotulo}
                          </button>
                        ))}
                        <button
                          type="button"
                          role="radio"
                          aria-checked={cfg.tamanhoId === "custom"}
                          onClick={() => setJanelaConfig(i, { tamanhoId: "custom" })}
                          className={cn(
                            "inline-flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-sm font-semibold transition-all duration-200",
                            focusRing,
                            cfg.tamanhoId === "custom"
                              ? "bg-brand-900 text-white shadow-sm"
                              : "bg-white text-brand-700 shadow-sm hover:bg-brand-50 hover:scale-[1.03]",
                          )}
                        >
                          <PencilRuler className="h-4 w-4" />
                          Manual
                        </button>
                      </div>
                      {cfg.tamanhoId === "custom" && (
                        <SlidersLarguraAltura
                          className="mt-3 border border-brand-200/50 bg-white"
                          largura={cfg.largura}
                          altura={cfg.altura}
                          onLargura={(v) => setJanelaConfig(i, { largura: v })}
                          onAltura={(v) => setJanelaConfig(i, { altura: v })}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>
              )}

              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => irPara(0)}
                  className={cn(
                    "flex h-15 w-15 shrink-0 items-center justify-center rounded-2xl bg-brand-50 text-brand-900 transition-all duration-200 hover:bg-brand-200/60 active:scale-95",
                    focusRing,
                  )}
                  aria-label="Voltar"
                >
                  <ArrowLeft className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => irPara(2)}
                  className={cn(
                    "group flex h-15 w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 text-lg font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]",
                    focusRing,
                  )}
                >
                  Ver meu orçamento
                  <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          )}

          {/* ─── Passo 3: resultado ─── */}
          {passo === 2 && (
            <motion.div
              key="passo-resultado"
              custom={direcao}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-2xl font-extrabold text-brand-900 lg:text-3xl">
                Seu orçamento estimado
              </h3>

              <div className="mt-7 grid grid-cols-1 gap-6 xl:grid-cols-2 xl:items-center">
                <div className="space-y-2.5 rounded-2xl border border-brand-200/60 bg-white/75 p-6 text-base">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-soft">Janelas</span>
                    <span className="text-right font-bold text-brand-900">
                      {orcamento.individual
                        ? `${orcamento.janelas} · tamanhos individuais`
                        : `${orcamento.janelas} · ${orcamento.tamanhoRotulo.toLowerCase()} (~${formatM2(orcamento.areaMediaM2)})`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-soft">Área total</span>
                    <span className="font-bold text-brand-900">{formatM2(orcamento.areaTotalM2)}</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-ink-soft">Valor do m² instalado</span>
                    <span className="font-bold text-brand-900">{formatBRL(orcamento.precoM2)}</span>
                  </div>
                  {orcamento.desconto && (
                    <div className="flex items-center justify-between gap-4 border-t border-brand-200/60 pt-2.5">
                      <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                        <BadgePercent className="h-5 w-5" />
                        {orcamento.desconto.rotulo}
                      </span>
                      <span className="font-bold text-emerald-700">
                        −{formatBRL(orcamento.valorDesconto)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  {orcamento.desconto && (
                    <p className="text-base text-ink-soft">
                      <s>{formatBRL(orcamento.subtotal)}</s>{" "}
                      <span className="ml-1 rounded-full bg-emerald-100 px-2.5 py-0.5 text-sm font-bold text-emerald-700">
                        −{orcamento.desconto.percentual}%
                      </span>
                    </p>
                  )}
                  <p className="mt-1 text-5xl font-extrabold leading-none text-brand-900 lg:text-6xl">
                    <AnimatedPrice value={orcamento.total} />
                  </p>
                  <p className="mx-auto mt-4 inline-flex max-w-md items-center gap-1.5 text-sm text-ink-soft">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-brand-700" />
                    Estimativa aproximada — o valor final é confirmado em visita técnica gratuita.
                  </p>
                </div>
              </div>

              <a
                href={linkWhatsAppOrcamento(orcamento)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "group mt-7 flex h-16 w-full items-center justify-center gap-2.5 rounded-2xl bg-[#25D366] text-lg font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-[#128C7E] hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[0.98]",
                  focusRing,
                )}
              >
                <WhatsAppIcon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />
                Fale com um especialista!
              </a>

              <div className="mt-5 flex items-center gap-3 text-sm text-ink-soft">
                <span className="h-px flex-1 bg-brand-200/70" />
                ou
                <span className="h-px flex-1 bg-brand-200/70" />
              </div>

              {!mostrarForm ? (
                <button
                  type="button"
                  onClick={() => setMostrarForm(true)}
                  className={cn(
                    "mt-5 flex h-13 w-full items-center justify-center rounded-2xl border border-brand-200/70 bg-white/70 text-base font-semibold text-brand-900 transition-all duration-200 hover:border-brand-400/60 hover:bg-white hover:shadow",
                    focusRing,
                  )}
                >
                  Prefiro que um especialista me chame
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="mt-5 grid grid-cols-1 gap-5 rounded-2xl border border-brand-200/60 bg-white/75 p-6 sm:grid-cols-2"
                >
                  <div>
                    <Label htmlFor="orc2-name" className="text-base text-brand-900">
                      Nome
                    </Label>
                    <Input
                      id="orc2-name"
                      placeholder="Seu nome"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      className="mt-2 h-13 rounded-xl border-brand-200 bg-white !text-base transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-brand-400"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-sm text-rose-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="orc2-whatsapp" className="text-base text-brand-900">
                      WhatsApp
                    </Label>
                    <Input
                      id="orc2-whatsapp"
                      inputMode="tel"
                      placeholder="(24) 99999-9999"
                      autoComplete="tel"
                      aria-invalid={!!errors.whatsapp}
                      className="mt-2 h-13 rounded-xl border-brand-200 bg-white !text-base transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-brand-400"
                      {...register("whatsapp", {
                        onChange: (e) =>
                          setValue("whatsapp", maskWhatsapp(e.target.value), {
                            shouldValidate: false,
                          }),
                      })}
                    />
                    {errors.whatsapp && (
                      <p className="mt-1.5 text-sm text-rose-600">{errors.whatsapp.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="orc2-city" className="text-base text-brand-900">
                      Bairro / Cidade
                    </Label>
                    <Input
                      id="orc2-city"
                      placeholder="Onde você mora"
                      autoComplete="address-level2"
                      aria-invalid={!!errors.city}
                      className="mt-2 h-13 rounded-xl border-brand-200 bg-white !text-base transition-shadow duration-200 focus-visible:ring-2 focus-visible:ring-brand-400"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-sm text-rose-600">{errors.city.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className={cn(
                      "group flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-900 px-6 text-base font-semibold text-white shadow-[var(--shadow-elegant)] transition-all duration-300 hover:bg-brand-700 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 lg:text-lg",
                      focusRing,
                    )}
                  >
                    {pending ? "Enviando…" : "Receber meu orçamento agora"}
                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-sm text-ink-soft sm:col-span-2">
                    Seus dados e o orçamento seguem juntos na conversa · Sem compromisso
                  </p>
                </motion.form>
              )}

              <button
                type="button"
                onClick={() => {
                  setMostrarForm(false);
                  irPara(0);
                }}
                className={cn(
                  "mx-auto mt-6 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-brand-700 transition-all duration-200 hover:bg-brand-50 hover:text-brand-900",
                  focusRing,
                )}
              >
                <RotateCcw className="h-4 w-4" />
                Refazer simulação
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
