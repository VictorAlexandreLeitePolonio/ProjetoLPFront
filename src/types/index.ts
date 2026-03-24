export interface PagedResult<T> {
  data: T[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type UserRole = "Admin" | "Fisio";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt?: string;
}

export type TipoPlano = "Mensal" | "Avulso";
export type TipoSessao = "Fisioterapia" | "Pilates" | "Massagem" | "Hidrolipo" | "Lipedema" | "Linfedema";

export interface Plan {
  id: number;
  name: string;
  valor: number;
  tipoPlano: TipoPlano;
  tipoSessao: TipoSessao;
  createdAt: string;
}

export type PaymentStatus = "Pending" | "Paid" | "Cancelled";

export interface Payment {
  id: number;
  userId: number;
  patientId: number;
  patientName: string;
  planId: number;
  planName: string;
  planAmount: number;
  referenceMonth: string;
  paymentMethod: string;
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
}

export interface CreatePaymentDto {
  patientId: number;
  planId: number;
  referenceMonth: string;
  paymentMethod: string;
  status: PaymentStatus;
  paidAt?: string;
}

export interface Patient {
  id: number;
  name: string;
  email: string;
  cpf: string;
  rg: string;
  phone: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  isActive: boolean;
  createdAt?: string;
  appointmentStatus?: "Scheduled" | "Completed" | "Cancelled";
  paymentStatus?: "Pending" | "Paid" | "Cancelled";
}

export interface Appointment {
  id: number;
  userId: number;
  patientId: number;
  patientName: string;
  appointmentDate: string;
  status: "Scheduled" | "Completed" | "Cancelled";
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  userId: number;
  userName: string;
  patientId: number;
  patientName: string;
  patologia: string;
  queixaPrincipal: string;
  examesImagem: string;
  doencaAntiga: string;
  doencaAtual: string;
  habitos: string;
  examesFisicos: string;
  sinaisVitais: string;
  medicamentos: string;
  cirurgias: string;
  outrasDoencas: string;
  sessao: string;
  titulo: string;
  contrato: string;
  orientacaoDomiciliar: string;
  createdAt: string;
}

// ─── Módulo Financeiro ─────────────────────────────────────────────────────

export interface Expense {
  id: number;
  title: string;
  value: number;
  paymentDate: string;       // ISO string — ex: "2026-03-10T00:00:00Z"
  description: string;
  referenceMonth: string;    // formato "YYYY-MM" — ex: "2026-03"
  createdAt: string;
}

export interface FinancialBalance {
  referenceMonth: string;    // "YYYY-MM"
  totalExpenses: number;     // soma dos gastos do mês
  totalIncome: number;       // soma dos payments com status "Paid"
  netBalance: number;        // totalIncome - totalExpenses
}

export interface CreateExpenseDto {
  title: string;
  value: number;
  paymentDate: string;       // ISO string
  description: string;
  referenceMonth: string;    // "YYYY-MM"
}
