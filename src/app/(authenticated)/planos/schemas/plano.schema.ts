import { z } from "zod";

export const PlanoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  valor: z.number().min(0.01, "Valor deve ser maior que zero"),
  tipoPlano: z.enum(["Mensal", "Avulso"]),
  tipoSessao: z.enum(["Fisioterapia", "Pilates", "Massagem", "Hidrolipo", "Lipedema", "Linfedema"]),
});

export type PlanoFormData = z.infer<typeof PlanoSchema>;
