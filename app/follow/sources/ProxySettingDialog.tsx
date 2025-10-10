"use client";

import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Proxy, ProxyType } from "@/lib/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { ProxyCreateSchema } from "@/app/api/_utils/zod";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { SelectItem } from "@/components/ui/select";

interface Props {
  triggerButton: React.ReactNode;
  currentProxy?: Proxy;
}

const EditProxySettingDialog = ({ triggerButton, currentProxy }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(ProxyCreateSchema),
    defaultValues: {
      name: currentProxy?.name ?? "",
      type: currentProxy?.type ?? "HTTP",
      url: currentProxy?.url ?? "",
    },
  });
  const onSubmit = async (data: z.infer<typeof ProxyCreateSchema>) => {
    console.log(data);
    const endpoint = currentProxy
      ? `/api/follow/proxy/${currentProxy.id}`
      : "/api/follow/proxy";
    const method = currentProxy ? "PATCH" : "POST";
    const body = JSON.stringify(data);
    await fetch(endpoint, { method, body })
      .then(async (res) => {
        if (res.ok) {
          toast.success(
            currentProxy
              ? "Proxy setting updated successfully"
              : "Proxy setting added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        }
        console.log(res);
      })
      .catch((err) => {
        toast.error(
          currentProxy
            ? "Failed to update proxy setting"
            : "Failed to add proxy setting"
        );
        console.log(err);
      });
  };

  return (
    <SettingEditDialog
      props={{
        open,
        onOpenChange: setOpen,
      }}
      title={currentProxy ? "Update Proxy Setting" : "Add Proxy Setting"}
      description={
        currentProxy
          ? "Update a proxy setting to your list."
          : "Add a new proxy setting to your list."
      }
      triggerButton={triggerButton}
      buttonText={currentProxy ? "Update" : "Add"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" required {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="type">Type</Label>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <ControlledSelect
                value={field.value as string | null}
                onValueChange={(value: string | null) => {
                  field.onChange(value);
                }}
                nullValue=""
              >
                {Object.values(ProxyType).map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </ControlledSelect>
            )}
          />
          <ErrorMessage>{errors.type?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="url">URL</Label>
          <Input
            id="url"
            placeholder="proxy://user:pass@host:port"
            required
            {...register("url")}
          />
          <ErrorMessage>{errors.url?.message}</ErrorMessage>
        </div>
      </div>
    </SettingEditDialog>
  );
};

export default EditProxySettingDialog;
