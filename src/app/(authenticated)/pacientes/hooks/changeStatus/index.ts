"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePacienteChangeStatus() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const changeStatus = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch<{ id: number; isActive: boolean }>(
        `/api/patients/${id}/status`
      );
      return { success: true, isActive: response.data.isActive };
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao alterar status do paciente. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { changeStatus, loading, error };
}
