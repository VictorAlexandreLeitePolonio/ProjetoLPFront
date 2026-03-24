"use client";

import { useState } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function useProntuarioDelete() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteProntuario = async (id: number): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await api.delete(`/api/medicalrecords/${id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao excluir prontuário.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { deleteProntuario, isPending, error };
}
