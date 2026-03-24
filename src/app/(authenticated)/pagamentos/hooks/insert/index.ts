"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Payment } from "@/types";
import { PagamentoFormData } from "../../schemas/pagamento.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePagamentoInsert() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertPagamento = useCallback(async (payload: PagamentoFormData): Promise<Payment> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<Payment>("/api/payments", payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao cadastrar pagamento. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { insertPagamento, isPending, error };
}
