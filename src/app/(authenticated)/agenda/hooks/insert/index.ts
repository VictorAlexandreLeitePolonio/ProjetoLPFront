"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { AgendaFormData } from "../../schemas/agenda.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function useAgendaInsert() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const insertAgenda = useCallback(async (payload: AgendaFormData): Promise<Appointment> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<Appointment>("/api/appointments", payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao agendar consulta. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { insertAgenda, isPending, error };
}
