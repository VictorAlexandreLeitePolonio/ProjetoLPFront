import { z } from "zod";

export const PacienteSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  cpf: z.string().min(1, "CPF é obrigatório"),
  rg: z.string().optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  rua: z.string().min(1, "Rua é obrigatória"),
  numero: z.string().min(1, "Número é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  estado: z.string().min(1, "Estado é obrigatório"),
  cep: z.string().min(1, "CEP é obrigatório"),
});

export type PacienteFormData = z.infer<typeof PacienteSchema>;
