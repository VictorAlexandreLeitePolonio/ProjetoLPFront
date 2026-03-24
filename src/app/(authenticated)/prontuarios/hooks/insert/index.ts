"use client";

import { useState } from "react";
import api from "@/lib/api";
import { MedicalRecord } from "@/types";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export interface CreateMedicalRecordDto {
  patientId: number;
  titulo: string;
  patologia: string;
  queixaPrincipal: string;
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

export function useInsertProntuario() {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const insertProntuario = async (data: CreateMedicalRecordDto): Promise<MedicalRecord | null> => {
    setIsPending(true);
    setError(null);
    try {
      const response = await api.post<MedicalRecord>("/api/medicalrecords", data);
      return response.data;
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao criar prontuário.");
      toast.error(message);
      throw err;
    } finally {
      setIsPending(false);
    }
  };

  return { insertProntuario, isPending, error };
}
