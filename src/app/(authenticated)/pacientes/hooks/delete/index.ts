"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePacienteDelete() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deletePaciente = useCallback(async (id: number): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await api.delete(`/api/patients/${id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao excluir paciente. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { deletePaciente, isPending, error };
}
