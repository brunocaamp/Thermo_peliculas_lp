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

export const submitLead = async (data: unknown) => {
  const parsedData = LeadSchema.parse(data);
  // TODO: integrar com email / CRM / WhatsApp API
  console.log("[lead]", parsedData);
  return { ok: true as const };
};
