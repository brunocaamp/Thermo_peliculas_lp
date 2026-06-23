import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  whatsapp: z
    .string()
    .min(10, "WhatsApp inválido")
    .max(20, "WhatsApp inválido"),
  city: z.string().min(2, "Informe seu bairro/cidade"),
});

export type Lead = z.infer<typeof LeadSchema>;

export const submitLead = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => LeadSchema.parse(data))
  .handler(async ({ data }) => {
    // TODO: integrar com email / CRM / WhatsApp API
    console.log("[lead]", data);
    return { ok: true as const };
  });
