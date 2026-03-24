"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Patient } from "@/types";
import { PacienteFormData } from "../../schemas/paciente.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function usePacienteInsert() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertPaciente = useCallback(async (payload: PacienteFormData): Promise<Patient> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<Patient>("/api/patients", payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao cadastrar paciente. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { insertPaciente, isPending, error };
}
