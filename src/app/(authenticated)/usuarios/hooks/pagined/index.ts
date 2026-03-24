"use client";

import { useState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import api from "@/lib/api";
import { User } from "@/types";

export function useUsuariosPaginated() {
  const [data, setData] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const fetchUsuarios = useCallback(async (name?: string) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (name) params.append("name", name);
      const response = await api.get<User[]>(`/api/users?${params.toString()}`);
      setData(response.data);
    } catch {
      const msg = "Erro ao carregar dados. Verifique sua conexão.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchUsuarios(search || undefined), 400);
    return () => clearTimeout(timer);
  }, [search, fetchUsuarios]);

  const refetch = useCallback(
    () => fetchUsuarios(search || undefined),
    [fetchUsuarios, search]
  );

  return { data, loading, error, search, setSearch, refetch };
}
