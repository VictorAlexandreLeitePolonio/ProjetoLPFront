"use client";

import api from "@/lib/api";
import Cookies from "js-cookie";
import { useState } from "react";
import { AxiosError } from "axios";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginUser {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface LoginApiResponse {
  message: string;
  user: LoginUser;
}

interface UseLoginReturn {
  loginUser: (payload: LoginPayload) => Promise<{
    success: boolean;
    user?: LoginUser;
    error?: string;
  }>;
  loading: boolean;
  error: string | null;
}

export const useLogin = (): UseLoginReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginUser = async (payload: LoginPayload) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post<LoginApiResponse>("/api/Auth/login", payload);
      const { user } = response.data;

      Cookies.set("auth_user", JSON.stringify(user), {
        expires: 1 / 3,
        sameSite: "strict",
        secure: false,
      });

      return { success: true, user };

    } catch (err) {
      const axiosError = err as AxiosError;
      const errorMessage =
        axiosError.response?.status === 401
          ? "E-mail ou senha inválidos."
          : "Erro de conexão. Tente novamente";

      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  return { loginUser, loading, error };
};
