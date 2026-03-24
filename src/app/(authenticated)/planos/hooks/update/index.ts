"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Plan } from "@/types";
import { PlanoFormData } from "../../schemas/plano.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePlanoUpdate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePlano = useCallback(async (id: number, payload: PlanoFormData): Promise<Plan> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.put<Plan>(`/api/plans/${id}`, payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao atualizar plano");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { updatePlano, isPending, error };
}
