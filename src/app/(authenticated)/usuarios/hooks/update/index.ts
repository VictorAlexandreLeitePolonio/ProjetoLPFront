"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { User } from "@/types";
import { UsuarioFormData } from "../../schemas/usuario.schema";
import { getApiErrorMessage } from "@/utils/apiError";

export function useUsuarioUpdate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateUsuario = useCallback(async (id: number, payload: Partial<UsuarioFormData>): Promise<User> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.put<User>(`/api/users/${id}`, payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao atualizar usuário");
      const error = new Error(message);
      setError(error);
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { updateUsuario, isPending, error };
}
