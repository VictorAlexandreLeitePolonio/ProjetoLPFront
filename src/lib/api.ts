import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5045",
  withCredentials: true, // envia o cookie auth_token automaticamente
});

// Interceptor de resposta — redireciona para login em caso de 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("Sua sessão expirou. Faça login novamente.");
      // Redirecionar para login após breve delay para o toast aparecer
      setTimeout(() => {
        window.location.href = "/login";
      }, 1500);
    }
    return Promise.reject(error);
  }
);

export default api;
