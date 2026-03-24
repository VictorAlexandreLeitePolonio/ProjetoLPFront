import { z } from "zod";

export const ExpenseSchema = z.object({
  title: z.string().min(1, "Título é obrigatório"),
  value: z.number().positive("O valor deve ser maior que zero"),
  paymentDate: z.string().min(1, "Data de pagamento é obrigatória"),
  description: z.string().min(1, "Descrição é obrigatória"),
  referenceMonth: z.string().min(1, "Mês de referência é obrigatório"),
});

export type ExpenseFormData = z.infer<typeof ExpenseSchema>;
