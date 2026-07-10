import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";
import posterImg from "@/assets/landing/sunset-living.jpg";

/* ============================================================
 * Box de mídia da página /orcamento-v2.
 *
 * Estado inicial: capa com botão de Play centralizado, ocupando
 * a coluna direita (~4/12) do container principal no desktop.
 * Ao dar Play, expande para a esquerda (transição de width em
 * ease-in-out) até cobrir 100% do container e inicia o vídeo.
 * Ao pausar, aparece "Voltar para o orçamento", que retrai o
 * box ao formato original.
 *
 * MANUTENÇÃO: troque VIDEO_SRC pelo vídeo real da marca
 * (arquivo .mp4 hospedado junto do site ou URL externa).
 * ============================================================ */
const VIDEO_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-brand-900/40";

export function VideoShowcase() {
  const [expandido, setExpandido] = useState(false);
  const [pausado, setPausado] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const abrir = () => {
    setPausado(false);
    setExpandido(true);
  };

  const fechar = () => {
    videoRef.current?.pause();
    setExpandido(false);
    setPausado(false);
  };

  const retomar = () => {
    void videoRef.current?.play();
  };

  return (
    <div
      className={cn(
        // Mobile: bloco normal abaixo da calculadora, com margem de 1rem.
        "relative mx-4 mb-4 lg:mx-0 lg:mb-0",
        // Desktop: posicionado sobre a coluna direita do container,
        // com 1rem de margem em relação às bordas (inset-y-4 / right-4).
        "lg:absolute lg:inset-y-4 lg:right-4 lg:z-20",
        // Expansão/retração com transição fluida de largura.
        "lg:transition-[width] lg:duration-700 lg:ease-in-out",
        expandido ? "lg:w-[calc(100%-2rem)]" : "lg:w-[calc(33.333%-2rem)]",
      )}
    >
      <div className="group relative h-64 w-full overflow-hidden rounded-[2rem] bg-brand-900 shadow-[0_18px_50px_-20px_rgba(34,67,102,0.45)] sm:h-80 lg:h-full">
        {/* Capa (estado retraído) */}
        {!expandido && (
          <>
            <img
              src={posterImg}
              alt="Sala de estar protegida com película Thermopelícula"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-brand-900/20 to-brand-900/10"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center">
              <motion.button
                type="button"
                onClick={abrir}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                aria-label="Assistir ao vídeo de apresentação"
                className={cn(
                  "flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-900 shadow-[0_12px_40px_rgba(0,0,0,0.35)] backdrop-blur transition-colors duration-300 hover:bg-white",
                  focusRing,
                )}
              >
                <Play className="ml-1 h-9 w-9 fill-current" />
              </motion.button>
              <p className="text-sm font-bold text-white drop-shadow sm:text-base">
                Veja a Thermopelícula em ação
              </p>
            </div>
          </>
        )}

        {/* Vídeo (estado expandido) */}
        {expandido && (
          <>
            <video
              ref={videoRef}
              src={VIDEO_SRC}
              poster={posterImg}
              autoPlay
              playsInline
              onPlay={() => setPausado(false)}
              onPause={() => setPausado(true)}
              onClick={(e) => {
                const v = e.currentTarget;
                if (v.paused) void v.play();
                else v.pause();
              }}
              className="absolute inset-0 h-full w-full cursor-pointer object-cover"
            />

            {/* Fechar no canto (atalho discreto) */}
            <button
              type="button"
              onClick={fechar}
              aria-label="Fechar vídeo"
              className={cn(
                "absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-brand-900/55 text-white backdrop-blur transition-all duration-200 hover:bg-brand-900/80 hover:scale-105 active:scale-95",
                focusRing,
              )}
            >
              <X className="h-5 w-5" />
            </button>

            {/* Overlay de pausa: Play + Voltar para o orçamento */}
            <AnimatePresence>
              {pausado && (
                <motion.div
                  key="overlay-pausa"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-brand-900/55 p-6 backdrop-blur-[2px]"
                >
                  <motion.button
                    type="button"
                    onClick={retomar}
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    aria-label="Continuar o vídeo"
                    className={cn(
                      "flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-brand-900 shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-colors duration-300 hover:bg-white",
                      focusRing,
                    )}
                  >
                    <Play className="ml-1 h-9 w-9 fill-current" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={fechar}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className={cn(
                      "rounded-full bg-white/15 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all duration-200 hover:bg-white/25 hover:scale-105 active:scale-95 sm:text-base",
                      focusRing,
                    )}
                  >
                    ← Voltar para o orçamento
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicador sutil de "tocando" (aparece no hover) */}
            {!pausado && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-brand-900/45 px-3 py-1.5 text-xs font-semibold text-white opacity-0 backdrop-blur transition-opacity duration-300 group-hover:opacity-100"
              >
                <Pause className="h-3.5 w-3.5" />
                Clique no vídeo para pausar
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
