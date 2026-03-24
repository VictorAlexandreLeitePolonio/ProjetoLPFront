"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { Appointment, PagedResult } from "@/types";
import { normalizePagedResult } from "@/lib/pagination";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export interface AgendaFilters {
  status?: string;
  patientId?: number;
}

export function useAgendaPaginated() {
  const [result, setResult] = useState<PagedResult<Appointment>>({
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<AgendaFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchAgenda = useCallback(async (
    name?: string,
    activeFilters?: AgendaFilters,
    currentPage?: number,
    currentPageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (name) params.append("patientName", name);
      if (activeFilters?.status) {
        params.append("status", activeFilters.status);
      }
      if (activeFilters?.patientId) {
        params.append("patientId", String(activeFilters.patientId));
      }
      params.append("page", (currentPage ?? page).toString());
      params.append("pageSize", (currentPageSize ?? pageSize).toString());
      const response = await api.get<PagedResult<Appointment> | Appointment[]>(`/api/appointments?${params.toString()}`);
      setResult(normalizePagedResult<Appointment>(response.data, currentPageSize ?? pageSize));
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao carregar agenda. Verifique sua conexão.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  // Debounce para busca
  useEffect(() => {
    const timer = setTimeout(() => fetchAgenda(search || undefined, filters, page, pageSize), 400);
    return () => clearTimeout(timer);
  }, [search, filters, page, pageSize, fetchAgenda]);

  // Resetar para página 1 quando search, filtros ou pageSize mudarem
  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  const refetch = useCallback(
    () => fetchAgenda(search || undefined, filters, page, pageSize),
    [fetchAgenda, search, filters, page, pageSize]
  );

  const applyFilters = useCallback((newFilters: AgendaFilters) => {
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
