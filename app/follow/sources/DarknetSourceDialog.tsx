import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Proxy } from "@/lib/generated/prisma";
import { Source } from "@/lib/generated/prisma";
import { DarknetSourceConfig } from "@/lib/generated/prisma";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Mutation function for React Query
async function submitDarknetSource(data: {
  formData: z.infer<typeof DarknetSourceCreateSchema>;
  endpoint: string;
  isUpdate: boolean;
}) {
  const { formData, endpoint, isUpdate } = data;

  const response = await fetch(endpoint, {
    method: isUpdate ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to submit darknet source");
  }

  return response.json();
}

const DarknetSourceDialog = ({
  proxies,
  source,
  triggerButton,
}: {
  proxies: Proxy[];
  source?: Source & { darknet: DarknetSourceConfig & { proxy: Proxy } };
  triggerButton: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  // Setup React Query mutation
  const endpoint = source
    ? `/api/follow/sources/${source.id}`
    : "/api/follow/sources";

  const mutation = useMutation({
    mutationFn: submitDarknetSource,
    onSuccess: () => {
      // Show success message
      toast.success(
        source
          ? "Darknet source updated successfully"
          : "Darknet source added successfully"
      );

      // Close dialog
      setOpen(false);

      // Invalidate and refetch queries
      queryClient.invalidateQueries({ queryKey: ["sources", "DARKNET"] });
      if (source) {
        queryClient.invalidateQueries({ queryKey: ["source", source.id] });
      }
    },
    onError: (error: Error) => {
      // Enhanced error handling
      console.error("Failed to submit darknet source:", error);
      toast.error(
        error.message ||
          (source
            ? "Failed to update darknet source"
            : "Failed to add darknet source")
      );
    },
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
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
    // Reset form for new entries on success
    const handleSuccess = () => {
      if (!source) {
        reset();
      }
    };

    // Trigger mutation
    mutation.mutate(
      {
        formData: data,
        endpoint,
        isUpdate: !!source,
      },
      {
        onSuccess: handleSuccess,
      }
    );
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
      buttonText={
        mutation.isPending
          ? source
            ? "Updating..."
            : "Adding..."
          : source
          ? "Update"
          : "Add"
      }
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
