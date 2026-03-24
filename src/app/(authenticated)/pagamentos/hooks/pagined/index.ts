"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { Payment, PagedResult } from "@/types";
import { normalizePagedResult } from "@/lib/pagination";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";

export interface PagamentoFilters {
  patientId?: string;
  status?: string;
}

export function usePagamentosPaginated() {
  const [result, setResult] = useState<PagedResult<Payment>>({
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PagamentoFilters>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPagamentos = useCallback(async (
    patientName?: string,
    activeFilters?: PagamentoFilters,
    currentPage?: number,
    currentPageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (patientName) params.append("patientName", patientName);
      if (activeFilters?.patientId) {
        params.append("patientId", activeFilters.patientId);
      }
      if (activeFilters?.status) {
        params.append("status", activeFilters.status);
      }
      params.append("page", (currentPage ?? page).toString());
      params.append("pageSize", (currentPageSize ?? pageSize).toString());
      const response = await api.get<PagedResult<Payment> | Payment[]>(`/api/payments?${params.toString()}`);
      setResult(normalizePagedResult<Payment>(response.data, currentPageSize ?? pageSize));
    } catch (err) {
      const message = getApiErrorMessage(err, "Erro ao carregar pagamentos. Verifique sua conexão.");
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPagamentos(search || undefined, filters, page, pageSize), 400);
    return () => clearTimeout(timer);
  }, [search, filters, page, pageSize, fetchPagamentos]);

  // Resetar para página 1 quando search, filtros ou pageSize mudarem
  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  const refetch = useCallback(
    () => fetchPagamentos(search || undefined, filters, page, pageSize),
    [fetchPagamentos, search, filters, page, pageSize]
  );

  const applyFilters = useCallback((newFilters: PagamentoFilters) => {
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
