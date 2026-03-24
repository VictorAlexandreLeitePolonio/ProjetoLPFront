"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataTable, Column } from "@/components/ui/DataTable";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { StatusToggleModal } from "@/components/ui/StatusToggleModal";
import { FilterPopover, FilterOption, FilterValues } from "@/components/ui/FilterPopover";
import { Button } from "@/components/ui/Button";
import { ActionsDropdown } from "@/components/ui/ActionsDropdown";
import { Eye, Power, Trash2, FileText } from "lucide-react";
import { usePacientesPaginated, PacienteFilters } from "../hooks/pagined";
import { Pagination } from "@/components/ui/Pagination";
import { usePacienteDelete } from "../hooks/delete";
import { toast } from "sonner";
import { usePacienteChangeStatus } from "../hooks/changeStatus";
import { Patient } from "@/types";

interface Props {
  onCreate: () => void;
  onViewDetails: (id: number) => void;
  onVerProntuarios?: (id: number) => void;
}

const appointmentStatusOptions = [
  { value: "Scheduled", label: "Agendado" },
  { value: "Completed", label: "Completo" },
  { value: "Cancelled", label: "Cancelado" },
];

const paymentStatusOptions = [
  { value: "Pending", label: "Pendente" },
  { value: "Paid", label: "Pago" },
  { value: "Cancelled", label: "Cancelado" },
];

export default function PacienteList({ onCreate, onViewDetails, onVerProntuarios }: Props) {
  const {
    data,
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    loading,
    error,
    search,
    setSearch,
    applyFilters,
    clearFilters,
    refetch,
  } = usePacientesPaginated();
  const { deletePaciente, isPending: deleting } = usePacienteDelete();
  const { changeStatus, loading: changingStatus } = usePacienteChangeStatus();

  const [toDelete, setToDelete] = useState<Patient | null>(null);
  const [toToggleStatus, setToToggleStatus] = useState<Patient | null>(null);
  const [filterValues, setFilterValues] = useState<FilterValues>({
    appointmentStatus: "",
    paymentStatus: "",
  });

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deletePaciente(toDelete.id);
      toast.success("Paciente excluído com sucesso!");
      setToDelete(null);
      refetch();
    } catch {
      // erro já tratado no hook
    }
  };

  const handleConfirmChangeStatus = async () => {
    if (!toToggleStatus) return;
    const result = await changeStatus(toToggleStatus.id);
    if (result.success) {
      setToToggleStatus(null);
      refetch();
    }
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
  };

  const handleApplyFilters = () => {
    const newFilters: PacienteFilters = {};
    if (filterValues.appointmentStatus) {
      newFilters.appointmentStatus = filterValues.appointmentStatus;
    }
    if (filterValues.paymentStatus) {
      newFilters.paymentStatus = filterValues.paymentStatus;
    }
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilterValues({
      appointmentStatus: "",
      paymentStatus: "",
    });
    clearFilters();
  };

  const getAppointmentStatusBadge = (status?: string) => {
    if (!status) return <span className="text-gray-400">-</span>;
    
    const styles = {
      Scheduled: "bg-blue-100 text-blue-700 border-blue-200",
      Completed: "bg-green-100 text-green-700 border-green-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      Scheduled: "Agendado",
      Completed: "Completo",
      Cancelled: "Cancelado",
    };

    return (
      <span className={`px-2 py-1 rounded-sm text-xs font-semibold border-2 ${styles[status as keyof typeof styles] || ""}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const getPaymentStatusBadge = (status?: string) => {
    if (!status) return <span className="text-gray-400">-</span>;
    
    const styles = {
      Pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Paid: "bg-green-100 text-green-700 border-green-200",
      Cancelled: "bg-red-100 text-red-700 border-red-200",
    };

    const labels = {
      Pending: "Pendente",
      Paid: "Pago",
      Cancelled: "Cancelado",
    };

    return (
      <span className={`px-2 py-1 rounded-sm text-xs font-semibold border-2 ${styles[status as keyof typeof styles] || ""}`}>
        {labels[status as keyof typeof labels] || status}
      </span>
    );
  };

  const filterOptions: FilterOption[] = [
    {
      key: "appointmentStatus",
      label: "Status da Consulta",
      options: appointmentStatusOptions,
    },
    {
      key: "paymentStatus",
      label: "Status do Pagamento",
      options: paymentStatusOptions,
    },
  ];

  const columns: Column<Patient>[] = [
    { key: "name", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "cpf", label: "CPF" },
    { key: "phone", label: "Telefone" },
    { key: "cidade", label: "Cidade" },
    {
      key: "appointmentStatus",
      label: "Status da Última Consulta",
      render: (p) => getAppointmentStatusBadge(p.appointmentStatus),
    },
    {
      key: "paymentStatus",
      label: "Status do Pagamento",
      render: (p) => getPaymentStatusBadge(p.paymentStatus),
    },
    {
      key: "isActive",
      label: "Status",
      render: (p) => (
        <span
          className={`px-2 py-1 rounded-sm text-xs font-semibold border-2 ${
            p.isActive
              ? "bg-[#1a4a3a] text-white border-[#143d2f]"
              : "bg-red-100 text-red-700 border-red-200"
          }`}
        >
          {p.isActive ? "Ativo" : "Inativo"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (p) => (
        <ActionsDropdown
          actions={[
            {
              label: "Detalhes",
              onClick: () => onViewDetails(p.id),
              icon: <Eye size={14} />,
            },
            {
              label: "Ver Prontuários",
              onClick: () => onVerProntuarios?.(p.id),
              icon: <FileText size={14} />,
            },
            {
              label: p.isActive ? "Inativar" : "Ativar",
              onClick: () => setToToggleStatus(p),
              variant: p.isActive ? "danger" : "success",
              icon: <Power size={14} />,
            },
            {
              label: "Excluir",
              onClick: () => setToDelete(p),
              variant: "danger",
              icon: <Trash2 size={14} />,
            },
          ]}
        />
      ),
    },
  ];

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      <PageHeader
        title="Pacientes"
        actions={
          <div className="flex gap-2">
            <FilterPopover
              filters={filterOptions}
              values={filterValues}
              onChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
            <Button onClick={onCreate}>Novo Paciente</Button>
          </div>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nome..."
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Nenhum paciente encontrado."
        keyExtractor={(p) => p.id}
      />

      <Pagination
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={setPageSize}
      />

      <DeleteConfirmDialog
        open={!!toDelete}
        entityLabel="paciente"
        name={toDelete?.name ?? ""}
        loading={deleting}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <StatusToggleModal
        open={!!toToggleStatus}
        entityLabel="paciente"
        name={toToggleStatus?.name ?? ""}
        isActive={toToggleStatus?.isActive ?? true}
        loading={changingStatus}
        onClose={() => setToToggleStatus(null)}
        onConfirm={handleConfirmChangeStatus}
      />
    </div>
  );
}
