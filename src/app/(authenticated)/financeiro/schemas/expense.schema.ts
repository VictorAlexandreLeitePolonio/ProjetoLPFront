import { z } from "zod";

export const ExpenseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.number().positive("O valor deve ser maior que zero"),
  paymentDate: z.string().min(1, "Data de pagamento é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  referenceMonth: z
    .string()
    .min(1, "Mês de referência é obrigatório")
    .regex(/^\d{2}\/\d{4}$/, "Formato inválido. Use MM/YYYY (ex: 03/2025)"),
});

export type ExpenseFormData = z.infer<typeof ExpenseSchema>;
