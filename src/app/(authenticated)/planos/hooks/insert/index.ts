"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Plan } from "@/types";
import { PlanoFormData } from "../../schemas/plano.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePlanoInsert() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertPlano = useCallback(async (payload: PlanoFormData): Promise<Plan> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<Plan>("/api/plans", payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao cadastrar plano");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { insertPlano, isPending, error };
}
