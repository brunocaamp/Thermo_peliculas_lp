import { motion } from "framer-motion";
import { GlassCard } from "./ui/GlassCard";
import { BackgroundBlobs } from "./ui/BackgroundBlobs";
import { PrimaryCTA, WhatsAppCTA } from "./ui/ActionButtons";
import { PreTitle } from "./ui/PreTitle";
import heroBg from "@/assets/landing/hero_1.png";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate w-full overflow-hidden pt-28 min-h-[100vh]"
    >
      <img src={heroBg} alt="Sala de estar com sol entrando pelas janelas grandes de vidro" className="absolute inset-0 w-full h-full object-cover" />
      <BackgroundBlobs />
      <div className="section-shell relative items-center !pb-16 !pt-12 lg:!pt-20">

        {/* Text side */}
        <div className="col-span-12 order-1 lg:order-1 lg:col-span-6 lg:col-start-1 lg:row-start-1">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <GlassCard variant="strong" className="p-7 sm:p-10">
              <PreTitle variant="brand">
                Películas Nanocerâmicas
              </PreTitle>
              <h1
                id="hero-title"
                className="mt-5 text-[clamp(2rem,4.4vw,3.75rem)] font-extrabold leading-[1.05] text-brand-900"
              >
                Você não precisa escolher entre{" "}
                <span className="relative inline-block">
                  <span className="relative z-10">luz natural</span>
                </span>
                 e conforto térmico.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ink-soft sm:text-lg">
                Instalamos películas nanocerâmicas que bloqueiam até{" "}
                <strong className="text-ink">99% dos raios UV</strong> e rejeitam até{" "}
                <strong className="text-ink">97% da radiação infravermelha</strong> (calor).
                Mais conforto para sua casa, menos esforço para o seu ar-condicionado.
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <PrimaryCTA href="#contato">
                  Solicitar orçamento
                </PrimaryCTA>
                <WhatsAppCTA href="https://wa.me/5511994575663?text=Ol%C3%A1%2C%20gostaria%20de%20um%20or%C3%A7amento%20Thermopel%C3%ADcula">
                  Falar no WhatsApp
                </WhatsAppCTA>
              </div>


            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
