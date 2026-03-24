"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function useAgendaDelete() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteAgenda = useCallback(async (id: number): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await api.delete(`/api/appointments/${id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao cancelar agendamento. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { deleteAgenda, isPending, error };
}
