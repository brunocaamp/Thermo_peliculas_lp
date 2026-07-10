import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  ArrowLeft,
  ArrowRight,
  BadgePercent,
  Copy,
  List,
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
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";
import { GlassCard } from "@/components/landing/ui/GlassCard";
import { LeadSchema, submitLead, type Lead } from "@/lib/lead.functions";
import { TAMANHOS_JANELA } from "@/lib/pricing.config";
import {
  calcularOrcamento,
  formatBRL,
  formatM2,
  linkWhatsAppOrcamento,
} from "@/lib/quote.functions";

function maskWhatsapp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

const PASSOS = ["Janelas", "Tamanho", "Resultado"] as const;

const stepVariants = {
  enter: (direction: number) => ({ opacity: 0, x: direction > 0 ? 48 : -48 }),
  center: { opacity: 1, x: 0 },
  exit: (direction: number) => ({ opacity: 0, x: direction > 0 ? -48 : 48 }),
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
  const escala = 26;
  return (
    <div className="flex h-16 items-end justify-center">
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

/** Par de sliders largura × altura, reutilizado no modo padrão e por janela. */
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
    <div className={cn("space-y-5 rounded-2xl bg-white/70 p-5", className)}>
      <div>
        <div className="flex items-center justify-between text-sm">
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
        <div className="flex items-center justify-between text-sm">
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
      <p className="text-center text-xs text-ink-soft">
        ≈ {formatM2(largura * altura)} por janela
      </p>
    </div>
  );
}

export function QuoteCalculator() {
  const [passo, setPasso] = useState(0);
  const [direcao, setDirecao] = useState(1);
  const [janelas, setJanelas] = useState(4);
  const [modo, setModo] = useState<"padrao" | "individual">("padrao");
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
    if (modo === "individual") {
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
  }, [modo, janelas, janelasConfig, padrao]);

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
    <GlassCard variant="strong" className="overflow-hidden p-6 sm:p-10">
      {/* Indicador de passos */}
      <ol className="flex items-center justify-center gap-2 sm:gap-3" aria-label="Etapas da simulação">
        {PASSOS.map((rotulo, i) => (
          <li key={rotulo} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => i < passo && irPara(i)}
              disabled={i > passo}
              className={cn(
                "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-all",
                i === passo && "bg-brand-900 text-white shadow-sm",
                i < passo && "bg-brand-200/70 text-brand-900 hover:bg-brand-200",
                i > passo && "bg-white/60 text-ink-soft",
              )}
            >
              <span
                className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold",
                  i === passo ? "bg-white/20" : "bg-brand-900/10",
                )}
              >
                {i + 1}
              </span>
              <span className="hidden sm:inline">{rotulo}</span>
            </button>
            {i < PASSOS.length - 1 && (
              <span className="h-px w-4 bg-brand-200 sm:w-8" aria-hidden="true" />
            )}
          </li>
        ))}
      </ol>

      <div className="relative mt-8 min-h-[21rem]">
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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-xl font-extrabold text-brand-900 sm:text-2xl lg:text-[1.7rem]">
                Quantas janelas você quer proteger?
              </h3>
              <p className="mt-2 text-center text-sm text-ink-soft lg:text-base">
                Conte todas as janelas e portas de vidro que recebem sol.
              </p>

              <div className="mx-auto mt-8 flex max-w-xs items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setJanelas((j) => Math.max(1, j - 1))}
                  aria-label="Diminuir quantidade de janelas"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-brand-900 shadow-sm transition-all hover:bg-white active:scale-90"
                >
                  <Minus className="h-5 w-5" />
                </button>
                <div className="flex h-20 w-24 items-center justify-center rounded-2xl bg-brand-900 text-4xl font-extrabold text-white shadow-[var(--shadow-elegant)]">
                  {janelas}
                </div>
                <button
                  type="button"
                  onClick={() => setJanelas((j) => Math.min(40, j + 1))}
                  aria-label="Aumentar quantidade de janelas"
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/80 text-brand-900 shadow-sm transition-all hover:bg-white active:scale-90"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                {[2, 4, 6, 8, 10].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setJanelas(n)}
                    className={cn(
                      "h-10 min-w-12 rounded-full px-4 text-sm font-semibold transition-all",
                      janelas === n
                        ? "bg-brand-900 text-white shadow-sm"
                        : "bg-white/70 text-brand-700 hover:bg-white",
                    )}
                  >
                    {n}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => irPara(1)}
                className="group mt-9 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 text-base font-semibold text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-brand-700 active:scale-[0.98]"
              >
                Continuar
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.div>
          )}

          {/* ─── Passo 2: tamanho (padronizado ou individual) ─── */}
          {passo === 1 && (
            <motion.div
              key="passo-tamanho"
              custom={direcao}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-xl font-extrabold text-brand-900 sm:text-2xl lg:text-[1.7rem]">
                {modo === "padrao" ? "Qual o tamanho das janelas?" : "Ajuste cada janela"}
              </h3>
              <p className="mt-2 text-center text-sm text-ink-soft lg:text-base">
                {modo === "padrao"
                  ? "Escolha o mais parecido — vale para todas. Não precisa ser exato."
                  : "Defina o tamanho de cada janela separadamente."}
              </p>

              {/* Alternância entre padronizar tudo ou definir uma a uma */}
              <div className="mt-6 grid grid-cols-2 gap-2 rounded-2xl bg-white/50 p-1.5">
                <button
                  type="button"
                  onClick={() => setModo("padrao")}
                  aria-pressed={modo === "padrao"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                    modo === "padrao"
                      ? "bg-brand-900 text-white shadow-sm"
                      : "text-brand-700 hover:bg-white/70",
                  )}
                >
                  <Copy className="h-4 w-4" />
                  Todas iguais
                </button>
                <button
                  type="button"
                  onClick={() => setModo("individual")}
                  aria-pressed={modo === "individual"}
                  className={cn(
                    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all sm:text-sm",
                    modo === "individual"
                      ? "bg-brand-900 text-white shadow-sm"
                      : "text-brand-700 hover:bg-white/70",
                  )}
                >
                  <List className="h-4 w-4" />
                  Uma a uma
                </button>
              </div>

              {/* ── Modo padronizado ── */}
              {modo === "padrao" && (
                <>
                  <div
                    className="mt-5 grid grid-cols-3 gap-2 sm:gap-3"
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
                          "rounded-2xl p-3 text-center transition-all sm:p-4",
                          padrao.tamanhoId === t.id
                            ? "bg-white shadow-md ring-2 ring-brand-900"
                            : "bg-white/60 hover:bg-white/85",
                        )}
                      >
                        <WindowGlyph largura={t.largura} altura={t.altura} />
                        <p className="mt-2.5 text-sm font-bold text-brand-900">{t.rotulo}</p>
                        <p className="mt-0.5 text-[0.7rem] leading-tight text-ink-soft">{t.exemplo}</p>
                        <p className="mt-1 text-[0.7rem] font-semibold text-brand-700">
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
                      "mt-3 flex w-full items-center justify-center gap-2 rounded-2xl p-3.5 text-sm font-semibold transition-all",
                      padrao.tamanhoId === "custom"
                        ? "bg-white text-brand-900 shadow-md ring-2 ring-brand-900"
                        : "bg-white/60 text-brand-700 hover:bg-white/85",
                    )}
                  >
                    <PencilRuler className="h-4 w-4" />
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
                          className="mt-3"
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

              {/* ── Modo individual ── */}
              {modo === "individual" && (
                <div className="mt-5 space-y-3">
                  {janelasConfig.map((cfg, i) => (
                    <div key={i} className="rounded-2xl bg-white/55 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-brand-900">Janela {i + 1}</span>
                        <span className="text-xs font-semibold text-brand-700">
                          {formatM2(areaDeConfig(cfg))}
                        </span>
                      </div>
                      <div
                        className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4"
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
                              "rounded-xl px-2 py-2 text-xs font-semibold transition-all",
                              cfg.tamanhoId === t.id
                                ? "bg-brand-900 text-white shadow-sm"
                                : "bg-white/70 text-brand-700 hover:bg-white",
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
                            "inline-flex items-center justify-center gap-1 rounded-xl px-2 py-2 text-xs font-semibold transition-all",
                            cfg.tamanhoId === "custom"
                              ? "bg-brand-900 text-white shadow-sm"
                              : "bg-white/70 text-brand-700 hover:bg-white",
                          )}
                        >
                          <PencilRuler className="h-3.5 w-3.5" />
                          Manual
                        </button>
                      </div>
                      {cfg.tamanhoId === "custom" && (
                        <SlidersLarguraAltura
                          className="mt-3 bg-white/80"
                          largura={cfg.largura}
                          altura={cfg.altura}
                          onLargura={(v) => setJanelaConfig(i, { largura: v })}
                          onAltura={(v) => setJanelaConfig(i, { altura: v })}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-7 flex gap-3">
                <button
                  type="button"
                  onClick={() => irPara(0)}
                  className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/70 text-brand-900 transition-all hover:bg-white active:scale-95"
                  aria-label="Voltar"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => irPara(2)}
                  className="group flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-brand-900 text-base font-semibold text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-brand-700 active:scale-[0.98]"
                >
                  Ver meu orçamento
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <h3 className="text-center text-xl font-extrabold text-brand-900 sm:text-2xl lg:text-[1.7rem]">
                Seu orçamento estimado
              </h3>

              <div className="mt-6 space-y-2 rounded-2xl bg-white/70 p-5 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Janelas</span>
                  <span className="font-bold text-brand-900">
                    {orcamento.individual
                      ? `${orcamento.janelas} · tamanhos individuais`
                      : `${orcamento.janelas} · ${orcamento.tamanhoRotulo.toLowerCase()} (~${formatM2(orcamento.areaMediaM2)})`}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Área total</span>
                  <span className="font-bold text-brand-900">{formatM2(orcamento.areaTotalM2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-ink-soft">Valor do m² instalado</span>
                  <span className="font-bold text-brand-900">{formatBRL(orcamento.precoM2)}</span>
                </div>
                {orcamento.desconto && (
                  <div className="flex items-center justify-between border-t border-brand-200/60 pt-2">
                    <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                      <BadgePercent className="h-4 w-4" />
                      {orcamento.desconto.rotulo}
                    </span>
                    <span className="font-bold text-emerald-700">
                      −{formatBRL(orcamento.valorDesconto)}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-5 text-center">
                {orcamento.desconto && (
                  <p className="text-sm text-ink-soft">
                    <s>{formatBRL(orcamento.subtotal)}</s>{" "}
                    <span className="ml-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">
                      −{orcamento.desconto.percentual}%
                    </span>
                  </p>
                )}
                <p className="mt-1 text-[2.6rem] font-extrabold leading-none text-brand-900 sm:text-5xl">
                  <AnimatedPrice value={orcamento.total} />
                </p>
                <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                  <ShieldCheck className="h-3.5 w-3.5 text-brand-700" />
                  Estimativa aproximada — o valor final é confirmado em visita técnica gratuita.
                </p>
              </div>

              <a
                href={linkWhatsAppOrcamento(orcamento)}
                target="_blank"
                rel="noopener noreferrer"
                className="group mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] text-base font-semibold text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-[#128C7E] active:scale-[0.98]"
              >
                <WhatsAppIcon className="h-5 w-5 transition-transform group-hover:scale-110" />
                Fale com um especialista!
              </a>

              <div className="mt-4 flex items-center gap-3 text-xs text-ink-soft">
                <span className="h-px flex-1 bg-brand-200/70" />
                ou
                <span className="h-px flex-1 bg-brand-200/70" />
              </div>

              {!mostrarForm ? (
                <button
                  type="button"
                  onClick={() => setMostrarForm(true)}
                  className="mt-4 flex h-12 w-full items-center justify-center rounded-2xl bg-white/70 text-sm font-semibold text-brand-900 transition-all hover:bg-white"
                >
                  Prefiro que um especialista me chame
                </button>
              ) : (
                <motion.form
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  onSubmit={onSubmit}
                  noValidate
                  className="mt-4 grid grid-cols-1 gap-4 rounded-2xl bg-white/70 p-5 sm:grid-cols-2"
                >
                  <div>
                    <Label htmlFor="orc-name" className="text-brand-900">
                      Nome
                    </Label>
                    <Input
                      id="orc-name"
                      placeholder="Seu nome"
                      autoComplete="name"
                      aria-invalid={!!errors.name}
                      className="mt-2 h-12 rounded-xl border-brand-200 bg-white text-base"
                      {...register("name")}
                    />
                    {errors.name && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="orc-whatsapp" className="text-brand-900">
                      WhatsApp
                    </Label>
                    <Input
                      id="orc-whatsapp"
                      inputMode="tel"
                      placeholder="(24) 99999-9999"
                      autoComplete="tel"
                      aria-invalid={!!errors.whatsapp}
                      className="mt-2 h-12 rounded-xl border-brand-200 bg-white text-base"
                      {...register("whatsapp", {
                        onChange: (e) =>
                          setValue("whatsapp", maskWhatsapp(e.target.value), {
                            shouldValidate: false,
                          }),
                      })}
                    />
                    {errors.whatsapp && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.whatsapp.message}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="orc-city" className="text-brand-900">
                      Bairro / Cidade
                    </Label>
                    <Input
                      id="orc-city"
                      placeholder="Onde você mora"
                      autoComplete="address-level2"
                      aria-invalid={!!errors.city}
                      className="mt-2 h-12 rounded-xl border-brand-200 bg-white text-base"
                      {...register("city")}
                    />
                    {errors.city && (
                      <p className="mt-1.5 text-xs text-rose-600">{errors.city.message}</p>
                    )}
                  </div>
                  <button
                    type="submit"
                    disabled={pending}
                    className="group flex h-13 items-center justify-center gap-2 rounded-2xl bg-brand-900 px-6 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:col-span-2 sm:h-14 sm:text-base"
                  >
                    {pending ? "Enviando…" : "Receber meu orçamento agora"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="text-center text-xs text-ink-soft sm:col-span-2">
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
                className="mx-auto mt-5 flex items-center gap-1.5 text-xs font-semibold text-brand-700 transition-colors hover:text-brand-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Refazer simulação
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GlassCard>
  );
}
