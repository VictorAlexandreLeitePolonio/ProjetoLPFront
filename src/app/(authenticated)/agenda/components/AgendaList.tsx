"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/PageHeader";
import { SearchInput } from "@/components/ui/SearchInput";
import { DataTable, Column } from "@/components/ui/DataTable";
import { DeleteConfirmDialog } from "@/components/ui/DeleteConfirmDialog";
import { FilterPopover, FilterOption, FilterValues } from "@/components/ui/FilterPopover";
import { Button } from "@/components/ui/Button";
import { ActionsDropdown } from "@/components/ui/ActionsDropdown";
import { Eye, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { useAgendaPaginated, AgendaFilters } from "../hooks/pagined";
import { Pagination } from "@/components/ui/Pagination";
import { useAgendaDelete } from "../hooks/delete";
import { toast } from "sonner";
import { useAgendaChangeStatus } from "../hooks/changeStatus";
import { Appointment } from "@/types";

interface Props {
  onCreate: () => void;
  onViewDetails: (id: number) => void;
}

const statusOptions = [
  { value: "Scheduled", label: "Agendado" },
  { value: "Completed", label: "Completo" },
  { value: "Cancelled", label: "Cancelado" },
];

export default function AgendaList({ onCreate, onViewDetails }: Props) {
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
  } = useAgendaPaginated();
  const { deleteAgenda, isPending: deleting } = useAgendaDelete();
  const { changeStatus, loading: changingStatus } = useAgendaChangeStatus();

  const [toDelete, setToDelete] = useState<Appointment | null>(null);
  const [toChangeStatus, setToChangeStatus] = useState<Appointment | null>(null);
  const [newStatus, setNewStatus] = useState<"Scheduled" | "Completed" | "Cancelled">("Scheduled");
  const [filterValues, setFilterValues] = useState<FilterValues>({
    status: "",
  });

  const handleConfirmDelete = async () => {
    if (!toDelete) return;
    try {
      await deleteAgenda(toDelete.id);
      toast.success("Agendamento cancelado com sucesso!");
      setToDelete(null);
      refetch();
    } catch {
      // erro já tratado no hook
    }
  };

  const handleConfirmChangeStatus = async () => {
    if (!toChangeStatus) return;
    const result = await changeStatus(toChangeStatus.id, newStatus);
    if (result.success) {
      setToChangeStatus(null);
      refetch();
    }
  };

  const handleFilterChange = (values: FilterValues) => {
    setFilterValues(values);
  };

  const handleApplyFilters = () => {
    const newFilters: AgendaFilters = {};
    if (filterValues.status) {
      newFilters.status = filterValues.status;
    }
    applyFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilterValues({
      status: "",
    });
    clearFilters();
  };

  const openStatusModal = (appointment: Appointment, status: "Scheduled" | "Completed" | "Cancelled") => {
    setToChangeStatus(appointment);
    setNewStatus(status);
  };

  const getStatusBadge = (status?: string) => {
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

  const formatDateTime = (dateString?: string) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const filterOptions: FilterOption[] = [
    {
      key: "status",
      label: "Status",
      options: statusOptions,
    },
  ];

  const columns: Column<Appointment>[] = [
    { key: "patientName", label: "Paciente" },
    { key: "userName", label: "Usuário" },

    {
      key: "appointmentDate",
      label: "Data e Hora",
      render: (a) => formatDateTime(a.appointmentDate),
    },
    {
      key: "status",
      label: "Status",
      render: (a) => getStatusBadge(a.status),
    },
    {
      key: "actions",
      label: "",
      className: "text-right",
      render: (a) => (
        <ActionsDropdown
          actions={[
            {
              label: "Detalhes",
              onClick: () => onViewDetails(a.id),
              icon: <Eye size={14} />,
            },
            ...(a.status !== "Completed"
              ? [
                  {
                    label: "Completar",
                    onClick: () => openStatusModal(a, "Completed" as const),
                    variant: "success" as const,
                    icon: <CheckCircle size={14} />,
                  },
                ]
              : []),
            ...(a.status !== "Cancelled"
              ? [
                  {
                    label: "Cancelar",
                    onClick: () => openStatusModal(a, "Cancelled" as const),
                    variant: "danger" as const,
                    icon: <XCircle size={14} />,
                  },
                ]
              : []),
            {
              label: "Excluir",
              onClick: () => setToDelete(a),
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
        title="Agenda"
        actions={
          <div className="flex gap-2">
            <FilterPopover
              filters={filterOptions}
              values={filterValues}
              onChange={handleFilterChange}
              onApply={handleApplyFilters}
              onClear={handleClearFilters}
            />
            <Button onClick={onCreate}>Novo Agendamento</Button>
          </div>
        }
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Buscar por nome do paciente..."
      />

      <DataTable
        columns={columns}
        data={data}
        loading={loading}
        emptyMessage="Nenhum agendamento encontrado."
        keyExtractor={(a) => a.id}
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
        entityLabel="agendamento"
        name={`de ${toDelete?.patientName ?? ""}`}
        loading={deleting}
        onClose={() => setToDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      {/* Status Change Modal */}
      {toChangeStatus && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded-sm shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Alterar Status</h3>
            <p className="text-gray-600 mb-6">
              Deseja alterar o status do agendamento de <strong>{toChangeStatus.patientName}</strong> para <strong>
                {newStatus === "Completed" ? "Completo" : "Cancelado"}
              </strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setToChangeStatus(null)}>
                Cancelar
              </Button>
              <Button 
                onClick={handleConfirmChangeStatus} 
                loading={changingStatus}
                variant={newStatus === "Cancelled" ? "danger" : "primary"}
              >
                Confirmar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
