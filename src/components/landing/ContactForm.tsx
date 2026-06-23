import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { ArrowRight, MapPin, MessageCircle, Phone } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SectionShell } from "./ui/SectionShell";
import { GlassCard } from "./ui/GlassCard";
import { Reveal } from "./ui/Reveal";
import { PreTitle } from "./ui/PreTitle";
import { LeadSchema, submitLead, type Lead } from "@/lib/lead.functions";
import familyAsset from "@/assets/landing/family.jpg.asset.json";

function maskWhatsapp(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d.length ? `(${d}` : "";
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10)
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function ContactForm() {
  const submit = useServerFn(submitLead);
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Lead>({
    resolver: zodResolver(LeadSchema),
    defaultValues: { name: "", whatsapp: "", city: "" },
  });

  const onSubmit = handleSubmit(async (data) => {
    setPending(true);
    try {
      await submit({ data });
      toast.success("Recebemos seu contato! Em breve um especialista falará com você.");
      reset();
    } catch {
      toast.error("Não conseguimos enviar agora. Tente o WhatsApp.");
    } finally {
      setPending(false);
    }
  });

  return (
    <SectionShell id="contato" aria-labelledby="contato-title">
      <Reveal className="col-span-12 mx-auto max-w-3xl text-center lg:col-span-10 lg:col-start-2">
        <PreTitle>
          Solicite seu orçamento
        </PreTitle>
        <h2
          id="contato-title"
          className="mt-4 text-[clamp(1.75rem,3.6vw,2.9rem)] font-extrabold leading-tight text-brand-900"
        >
          Casas inteligentes não sofrem com o calor.
          <br className="hidden sm:block" />
          Faça uma escolha inteligente.
        </h2>
        <p className="mt-4 text-base text-ink-soft sm:text-lg">
          Preencha o formulário ou fale direto com nossa equipe pelo WhatsApp.
        </p>
      </Reveal>

      <Reveal className="col-span-12 mt-10 lg:col-span-7">
        <GlassCard variant="strong" className="p-6 sm:p-9">
          <form onSubmit={onSubmit} noValidate className="grid grid-cols-1 gap-5">
            <div>
              <Label htmlFor="name" className="text-brand-900">
                Nome
              </Label>
              <Input
                id="name"
                placeholder="Seu nome"
                autoComplete="name"
                aria-invalid={!!errors.name}
                className="mt-2 h-12 rounded-xl border-brand-200 bg-white/80 text-base"
                {...register("name")}
              />
              {errors.name ? (
                <p className="mt-1.5 text-xs text-rose-600">{errors.name.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="whatsapp" className="text-brand-900">
                WhatsApp
              </Label>
              <Input
                id="whatsapp"
                inputMode="tel"
                placeholder="(24) 99999-9999"
                autoComplete="tel"
                aria-invalid={!!errors.whatsapp}
                className="mt-2 h-12 rounded-xl border-brand-200 bg-white/80 text-base"
                {...register("whatsapp", {
                  onChange: (e) =>
                    setValue("whatsapp", maskWhatsapp(e.target.value), {
                      shouldValidate: false,
                    }),
                })}
              />
              {errors.whatsapp ? (
                <p className="mt-1.5 text-xs text-rose-600">{errors.whatsapp.message}</p>
              ) : null}
            </div>

            <div>
              <Label htmlFor="city" className="text-brand-900">
                Bairro / Cidade
              </Label>
              <Input
                id="city"
                placeholder="Onde você mora"
                autoComplete="address-level2"
                aria-invalid={!!errors.city}
                className="mt-2 h-12 rounded-xl border-brand-200 bg-white/80 text-base"
                {...register("city")}
              />
              {errors.city ? (
                <p className="mt-1.5 text-xs text-rose-600">{errors.city.message}</p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={pending}
              className="group mt-2 inline-flex h-14 items-center justify-center gap-2 rounded-2xl bg-brand-900 px-6 text-sm font-semibold text-white shadow-[var(--shadow-elegant)] transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60 sm:text-base"
            >
              {pending ? "Enviando..." : "Falar com um especialista"}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
            <p className="text-center text-xs text-ink-soft">
              Resposta no mesmo dia útil · Sem compromisso
            </p>
          </form>
        </GlassCard>
      </Reveal>

      <Reveal
        delay={0.1}
        className="col-span-12 lg:col-span-5 lg:self-stretch"
      >
        <div className="flex h-full flex-col gap-4">
          <div className="relative overflow-hidden rounded-3xl shadow-[var(--shadow-glass-lg)]">
            <img
              src={familyAsset.url}
              alt="Família reunida em sala iluminada e fresca"
              width={1500}
              height={840}
              loading="lazy"
              className="aspect-[5/4] w-full object-cover lg:aspect-[4/5]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="font-display text-xl font-bold text-white sm:text-2xl">
                Mais conforto. Mais luz. Mais família aproveitando a casa.
              </p>
            </div>
          </div>
          <GlassCard className="p-5">
            <div className="flex flex-col gap-3">
              <a
                href="https://wa.me/5524999999999?text=Ol%C3%A1%20Thermo%2C%20gostaria%20de%20um%20or%C3%A7amento"
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-brand-900 px-4 py-3 text-white transition-colors hover:bg-brand-700"
              >
                <MessageCircle className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-white/70">
                    WhatsApp
                  </p>
                  <p className="truncate text-sm font-semibold">Conversar agora</p>
                </div>
              </a>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-brand-900">
                <Phone className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                    Telefone
                  </p>
                  <p className="truncate text-sm font-semibold">(24) 99999-9999</p>
                </div>
              </div>
              <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 text-brand-900">
                <MapPin className="h-5 w-5 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-medium uppercase tracking-wider text-ink-soft">
                    Atendimento
                  </p>
                  <p className="truncate text-sm font-semibold">
                    Volta Redonda e Sul Fluminense
                  </p>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </Reveal>
    </SectionShell>
  );
}
