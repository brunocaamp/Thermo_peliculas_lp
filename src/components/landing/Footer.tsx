import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import logoImg from "@/assets/landing/logo-default.png";
import { GlassCard } from "./ui/GlassCard";
import { PrimaryCTA } from "./ui/ActionButtons";
import logo_footer from "@/assets/landing/logo_footer.png";
import { WhatsAppIcon } from "@/components/ui/whatsapp-icon";

export function Footer() {
  return (
    <footer className="relative w-full pb-50 pt-[4rem] overflow-hidden">
      <img src={logo_footer} alt="Logo Thermopelícula Footer" className="absolute bottom-[-4rem] z-0 opacity-[80%]" />
      <div className="mx-[4vw]">
        <GlassCard variant="strong2" className="p-8 md:p-12">



          <div className="grid grid-cols-1 gap-10 md:grid-cols-12 pt-6">
            <div className="md:col-span-5">
              <img src={logoImg} alt="Thermopelícula" className="h-[5rem] w-auto" />
              <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-soft">
                Películas nanocerâmicas de controle solar instaladas com precisão em Volta
                Redonda e em todo o Sul Fluminense.
              </p>
            </div>

            <div className="md:col-span-3">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-900/60">
                Navegar
              </p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {[
                  { href: "#solucao", label: "Solução" },
                  { href: "#beneficios", label: "Benefícios" },
                  { href: "#depoimentos", label: "Depoimentos" },
                  { href: "#faq", label: "Perguntas frequentes" },
                  { href: "#contato", label: "Orçamento" },
                ].map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="font-medium text-brand-700 transition-colors hover:text-brand-900"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-900/60">
                Contato
              </p>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <MapPin className="h-5 w-5 shrink-0 text-brand-900" />
                  <span className="font-medium text-brand-700">
                    Volta Redonda — RJ · Atendemos todo o Sul Fluminense
                  </span>
                </li>
                <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <WhatsAppIcon className="h-5 w-5 shrink-0 text-brand-900" />
                  <a
                    href="https://wa.me/5511994575663"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-brand-700 transition-colors hover:text-brand-900"
                  >
                    (24) 99999-9999
                  </a>
                </li>
                <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <Mail className="h-5 w-5 shrink-0 text-brand-900" />
                  <a
                    href="mailto:contato@thermopeliculas.com.br"
                    className="font-medium text-brand-700 transition-colors hover:text-brand-900"
                  >
                    contato@thermopeliculas.com.br
                  </a>
                </li>
                <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                  <Instagram className="h-5 w-5 shrink-0 text-brand-900" />
                  <a
                    href="#"
                    className="font-medium text-brand-700 transition-colors hover:text-brand-900"
                  >
                    @thermopeliculas
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-brand-200/50 pt-6 text-xs text-ink-soft sm:flex-row sm:items-center">
            <p>© {new Date().getFullYear()} Thermopelícula. Todos os direitos reservados.</p>
            <p>Desenvolvido por Tática</p>
          </div>
        </GlassCard>
      </div>
    </footer>
  );
}
