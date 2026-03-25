"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { FormSection } from "@/components/ui/FormSection";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { PacienteSchema, PacienteFormData } from "../schemas/paciente.schema";
import { usePacienteInsert } from "../hooks/insert";
import { maskCPF, maskRG, maskPhone, maskCEP } from "@/utils/masks";
import { unformatCPF, unformatRG, unformatPhone, unformatCEP } from "@/utils/formatters";

interface Props {
  onBack: () => void;
  onSave: () => void;
}

export default function PacienteRegister({ onBack, onSave }: Props) {
  const { insertPaciente, isPending } = usePacienteInsert();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<PacienteFormData>({
    resolver: zodResolver(PacienteSchema),
  });

  const onSubmit = async (data: PacienteFormData) => {
    try {
      const payload = {
        ...data,
        cpf:   unformatCPF(data.cpf),
        rg:    data.rg ? unformatRG(data.rg) : "",
        phone: unformatPhone(data.phone),
        cep:   unformatCEP(data.cep),
      };
      await insertPaciente(payload);
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

          <Controller
            control={control}
            name="cpf"
            render={({ field }) => (
              <FormField
                label="CPF *"
                error={errors.cpf?.message}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(maskCPF(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="rg"
            render={({ field }) => (
              <FormField
                label="RG"
                value={field.value ?? ""}
                onChange={(e) => field.onChange(maskRG(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <FormField
                label="Telefone *"
                error={errors.phone?.message}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(maskPhone(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
        </FormSection>

        <FormSection title="Endereço">
          <Controller
            control={control}
            name="cep"
            render={({ field }) => (
              <FormField
                label="CEP *"
                error={errors.cep?.message}
                value={field.value ?? ""}
                onChange={(e) => field.onChange(maskCEP(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
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
