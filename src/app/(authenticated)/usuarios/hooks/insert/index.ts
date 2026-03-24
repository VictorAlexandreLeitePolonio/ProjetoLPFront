"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { User } from "@/types";
import { UsuarioFormData } from "../../schemas/usuario.schema";
import { getApiErrorMessage } from "@/utils/apiError";

export function useUsuarioInsert() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertUsuario = useCallback(async (payload: UsuarioFormData & { password: string }): Promise<User> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<User>("/api/users", payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao cadastrar usuário");
      const error = new Error(message);
      setError(error);
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { insertUsuario, isPending, error };
}
