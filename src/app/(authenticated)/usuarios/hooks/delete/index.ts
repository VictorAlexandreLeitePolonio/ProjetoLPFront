"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { getApiErrorMessage } from "@/utils/apiError";

export function useUsuarioDelete() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const deleteUsuario = useCallback(async (id: number): Promise<void> => {
    setIsPending(true);
    setError(null);
    try {
      await api.delete(`/api/users/${id}`);
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao excluir usuário");
      const error = new Error(message);
      setError(error);
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { deleteUsuario, isPending, error };
}
