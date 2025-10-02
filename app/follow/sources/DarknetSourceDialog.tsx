import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Proxy } from "@/lib/generated/prisma";
import { Source } from "@/lib/generated/prisma";
import { DarknetSourceConfig } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SelectProxy from "./SelectProxy";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";
import { DarknetSourceCreateSchema } from "@/app/api/_utils/zod";

const DarknetSourceDialog = ({
  proxies,
  source,
  triggerButton,
}: {
  proxies: Proxy[];
  source?: Source & { darknet: DarknetSourceConfig & { proxy: Proxy } };
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DarknetSourceCreateSchema),
    defaultValues: {
      name: source?.name || "",
      description: source?.description || "",
      type: "DARKNET",
      active: source?.active || true,
      rateLimit: source?.rateLimit || 10,
      darknet: {
        url: source?.darknet?.url || "",
        proxyId: source?.darknet?.proxyId || "",
      },
    },
  });
  const onSubmit = async (data: z.infer<typeof DarknetSourceCreateSchema>) => {
    console.log(data);
    const endpoint = source
      ? `/api/follow/sources/${source.id}`
      : "/api/follow/sources";
    const method = source ? "PATCH" : "POST";
    const body = JSON.stringify(data);
    await fetch(endpoint, { method, body })
      .then((res) => {
        if (res.ok) {
          toast.success(
            source
              ? "Darknet source updated successfully"
              : "Darknet source added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        } else {
          toast.error(
            source
              ? "Failed to update darknet source"
              : "Failed to add darknet source"
          );
        }
      })
      .catch((err) => {
        toast.error(
          source
            ? "Failed to update darknet source"
            : "Failed to add darknet source"
        );
      });
  };
  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Darknet Source" : "Add Darknet Source"}
      description={
        source
          ? "Edit a darknet source"
          : "Add a new darknet source to your list."
      }
      triggerButton={triggerButton}
      buttonText={source ? "Update" : "Add"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" required {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            required
            rows={3}
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="darknet.url">Domain</Label>
          <Input
            id="darknet.url"
            placeholder="https://xxxxxxxxxxxxxxxx.onion"
            required
            {...register("darknet.url")}
          />
          <ErrorMessage>{errors.darknet?.url?.message}</ErrorMessage>
        </div>
        <SelectProxy
          control={control}
          proxies={proxies}
          name="darknet.proxyId"
          error={errors.darknet?.proxyId?.message}
          required={true}
        />
      </div>
    </SettingEditDialog>
  );
};

export default DarknetSourceDialog;
