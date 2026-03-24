"use client";

import { useState, useCallback, useEffect } from "react";
import api from "@/lib/api";
import { Plan, PagedResult } from "@/types";
import { normalizePagedResult } from "@/lib/pagination";
import { toast } from "sonner";

export function usePlanosPaginated() {
  const [result, setResult] = useState<PagedResult<Plan>>({
    data: [],
    page: 1,
    pageSize: 10,
    totalCount: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchPlanos = useCallback(async (
    name?: string,
    currentPage?: number,
    currentPageSize?: number
  ) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      params.append("page", (currentPage ?? page).toString());
      params.append("pageSize", (currentPageSize ?? pageSize).toString());
      const response = await api.get<PagedResult<Plan> | Plan[]>(`/api/plans?${params.toString()}`);
      setResult(normalizePagedResult<Plan>(response.data, currentPageSize ?? pageSize));
    } catch {
      const msg = "Erro ao carregar dados. Verifique sua conexão.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize]);

  useEffect(() => {
    const timer = setTimeout(() => fetchPlanos(search || undefined, page, pageSize), 400);
    return () => clearTimeout(timer);
  }, [search, page, pageSize, fetchPlanos]);

  // Resetar para página 1 quando search ou pageSize mudar
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const refetch = useCallback(
    () => fetchPlanos(search || undefined, page, pageSize),
    [fetchPlanos, search, page, pageSize]
  );

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
    refetch,
  };
}
