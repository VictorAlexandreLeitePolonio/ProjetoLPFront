"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { Patient, PagedResult } from "@/types";
import { normalizePagedResult } from "@/lib/pagination";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export interface PacienteFilters {
  appointmentStatus?: string;
  paymentStatus?: string;
}

export function usePacientesPaginated() {
  const [result, setResult] = useState<PagedResult<Patient>>({
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PacienteFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPacientes = useCallback(async (
    name?: string,
    activeFilters?: PacienteFilters,
    currentPage?: number,
    currentPageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      if (activeFilters?.appointmentStatus) {
        params.append("appointmentStatus", activeFilters.appointmentStatus);
      }
      if (activeFilters?.paymentStatus) {
        params.append("paymentStatus", activeFilters.paymentStatus);
      }
      params.append("page", (currentPage ?? page).toString());
      params.append("pageSize", (currentPageSize ?? pageSize).toString());
      const response = await api.get<PagedResult<Patient> | Patient[]>(`/api/patients?${params.toString()}`);
      setResult(normalizePagedResult<Patient>(response.data, currentPageSize ?? pageSize));
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao carregar pacientes. Verifique sua conexão.");
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => fetchPacientes(search || undefined, filters, page, pageSize), 400);
    return () => clearTimeout(timer);
  }, [search, filters, page, pageSize, fetchPacientes]);

  // Resetar para página 1 quando search, filtros ou pageSize mudarem
  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  const refetch = useCallback(
    () => fetchPacientes(search || undefined, filters, page, pageSize),
    [fetchPacientes, search, filters, page, pageSize]
  );

  const applyFilters = useCallback((newFilters: PacienteFilters) => {
    setFilters(newFilters);
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  return {
    data: result.data,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages: result.totalPages,
    totalCount: result.totalCount,
    loading,
    error,
    search,
    setSearch,
    filters,
    applyFilters,
    clearFilters,
    refetch,
  };
}
