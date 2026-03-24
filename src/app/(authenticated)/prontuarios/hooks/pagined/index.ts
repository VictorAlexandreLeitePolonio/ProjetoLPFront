"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { MedicalRecord, PagedResult } from "@/types";
import { normalizePagedResult } from "@/lib/pagination";
import { toast } from "sonner";

export interface ProntuarioFilters {
  patientId?: number;
  patientName?: string;
  userId?: number;
  createdAt?: string;
}

export function useProntuariosPaginated(initialFilters?: ProntuarioFilters) {
  const [result, setResult] = useState<PagedResult<MedicalRecord>>({
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<ProntuarioFilters>(initialFilters ?? {});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchProntuarios = useCallback(async (
    patientName?: string,
    activeFilters?: ProntuarioFilters,
    currentPage?: number,
    currentPageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.append("page", (currentPage ?? page).toString());
      params.append("pageSize", (currentPageSize ?? pageSize).toString());
      if (patientName) params.append("patientName", patientName);
      if (activeFilters?.patientId) {
        params.append("patientId", activeFilters.patientId.toString());
      }
      if (activeFilters?.patientName) {
        params.append("patientName", activeFilters.patientName);
      }
      if (activeFilters?.userId) {
        params.append("userId", activeFilters.userId.toString());
      }
      if (activeFilters?.createdAt) {
        params.append("createdAt", activeFilters.createdAt);
      }
      const response = await api.get<PagedResult<MedicalRecord> | MedicalRecord[]>(`/api/medicalrecords?${params.toString()}`);
      setResult(normalizePagedResult<MedicalRecord>(response.data, currentPageSize ?? pageSize));
    } catch {
      const msg = "Erro ao carregar dados. Verifique sua conexão.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => fetchProntuarios(search || undefined, filters, page, pageSize), 400);
    return () => clearTimeout(timer);
  }, [search, filters, page, pageSize, fetchProntuarios]);

  useEffect(() => {
    setPage(1);
  }, [search, filters, pageSize]);

  const refetch = useCallback(
    () => fetchProntuarios(search || undefined, filters, page, pageSize),
    [fetchProntuarios, search, filters, page, pageSize]
  );

  const applyFilters = useCallback((newFilters: ProntuarioFilters) => {
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
