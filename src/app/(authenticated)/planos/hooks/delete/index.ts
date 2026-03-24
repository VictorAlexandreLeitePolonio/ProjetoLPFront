"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePlanoDelete() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePlano = useCallback(async (id: number): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await api.delete(`/api/plans/${id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao excluir plano");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { deletePlano, isPending, error };
}
