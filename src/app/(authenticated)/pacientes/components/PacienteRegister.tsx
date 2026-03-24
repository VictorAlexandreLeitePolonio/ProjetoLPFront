"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormSection } from "@/components/ui/FormSection";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PacienteSchema, PacienteFormData } from "../schemas/paciente.schema";
import { usePacienteInsert } from "../hooks/insert";

interface Props {
  onBack: () => void;
  onSave: () => void;
}

export default function PacienteRegister({ onBack, onSave }: Props) {
  const { insertPaciente, isPending } = usePacienteInsert();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(PacienteSchema),
  });

  const onSubmit = async (data: PacienteFormData) => {
    try {
      await insertPaciente(data);
      toast.success("Paciente cadastrado com sucesso!");
      onSave();
    } catch {
      // erro já tratado no hook
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <PageHeader title="Novo Paciente" onBack={onBack} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <FormSection title="Dados Pessoais">
          <FormField label="Nome *" error={errors.name?.message} {...register("name")} />
          <FormField label="E-mail *" error={errors.email?.message} {...register("email")} />
          <FormField label="CPF *" error={errors.cpf?.message} {...register("cpf")} />
          <FormField label="RG" {...register("rg")} />
          <FormField label="Telefone *" error={errors.phone?.message} {...register("phone")} />
        </FormSection>

        <FormSection title="Endereço">
          <FormField label="CEP *" error={errors.cep?.message} {...register("cep")} />
          <FormField label="Rua *" error={errors.rua?.message} {...register("rua")} />
          <FormField label="Número *" error={errors.numero?.message} {...register("numero")} />
          <FormField label="Bairro *" error={errors.bairro?.message} {...register("bairro")} />
          <FormField label="Cidade *" error={errors.cidade?.message} {...register("cidade")} />
          <FormField label="Estado *" error={errors.estado?.message} {...register("estado")} />
        </FormSection>

        <Button type="submit" loading={isPending}>
          Cadastrar
        </Button>
      </form>
    </div>
  );
}
