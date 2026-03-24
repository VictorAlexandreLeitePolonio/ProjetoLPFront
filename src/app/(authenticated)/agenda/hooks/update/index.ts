"use client";

import { useState, useCallback } from "react";
import api from "@/lib/api";
import { Appointment } from "@/types";
import { AgendaFormData } from "../../schemas/agenda.schema";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export function useAgendaUpdate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateAgenda = useCallback(async (id: number, payload: AgendaFormData): Promise<Appointment> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.put<Appointment>(`/api/appointments/${id}`, payload);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao atualizar agendamento. Tente novamente.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, []);

  return { updateAgenda, isPending, error };
}
