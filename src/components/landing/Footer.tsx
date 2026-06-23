import { Instagram, Mail, MapPin, MessageCircle } from "lucide-react";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="relative isolate w-full overflow-hidden bg-brand-900 text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-brand-400/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-brand-700/40 blur-3xl" />
      </div>
      <div className="section-shell !pb-10 !pt-16">
        <div className="col-span-12 grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo variant="light" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/75">
              Películas nanocerâmicas de controle solar instaladas com precisão em Volta
              Redonda e em todo o Sul Fluminense.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
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
                    className="text-white/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              Contato
            </p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-brand-200" />
                <span className="text-white/80">
                  Volta Redonda — RJ · Atendemos todo o Sul Fluminense
                </span>
              </li>
              <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <MessageCircle className="h-4 w-4 shrink-0 text-brand-200" />
                <a
                  href="https://wa.me/5524999999999"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  (24) 99999-9999
                </a>
              </li>
              <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-brand-200" />
                <a
                  href="mailto:contato@thermopeliculas.com.br"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  contato@thermopeliculas.com.br
                </a>
              </li>
              <li className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                <Instagram className="h-4 w-4 shrink-0 text-brand-200" />
                <a
                  href="#"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  @thermopeliculas
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-span-12 mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/60 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Thermo Películas. Todos os direitos reservados.</p>
          <p>CNPJ 00.000.000/0001-00</p>
        </div>
      </div>
    </footer>
  );
}
