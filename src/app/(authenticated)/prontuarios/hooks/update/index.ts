"use client";

import { useState } from "react";
import api from "@/lib/api";
import { MedicalRecord } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export interface UpdateMedicalRecordDto {
  titulo?: string;
  patologia?: string;
  queixaPrincipal?: string;
  examesImagem?: string;
  doencaAntiga?: string;
  doencaAtual?: string;
  habitos?: string;
  examesFisicos?: string;
  sinaisVitais?: string;
  medicamentos?: string;
  cirurgias?: string;
  outrasDoencas?: string;
  sessao?: string;
  orientacaoDomiciliar?: string;
}

export function useProntuarioUpdate() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateProntuario = async (
    id: number,
    data: UpdateMedicalRecordDto
  ): Promise<MedicalRecord | null> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.put<MedicalRecord>(`/api/medicalrecords/${id}`, data);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao atualizar prontuário.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { updateProntuario, isPending, error };
}
