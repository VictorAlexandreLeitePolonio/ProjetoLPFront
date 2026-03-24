"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Patient } from "@/types";
import { PacienteFormData } from "../../schemas/paciente.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePacienteUpdate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updatePaciente = useCallback(async (id: number, payload: PacienteFormData): Promise<Patient> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.put<Patient>(`/api/patients/${id}`, payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao atualizar paciente. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { updatePaciente, isPending, error };
}
