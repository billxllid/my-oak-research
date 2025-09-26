import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WebSourceCreateSchema } from "@/app/api/_utils/zod";
import { toast } from "sonner";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { NetworkEnvironment } from "./ProxySettingCard";
import ErrorMessage from "@/components/ErrorMessage";
import { WebSourceConfig, Source, Proxy } from "@/lib/generated/prisma";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  networkEnvironments: NetworkEnvironment[];
  triggerButton: React.ReactNode;
  source?: Source & { web: WebSourceConfig } & { proxy: Proxy };
}

const EditWebSiteDialog = ({
  networkEnvironments,
  triggerButton,
  source,
}: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(WebSourceCreateSchema),
    defaultValues: {
      name: source?.name,
      type: "WEB",
      active: true,
      description: source?.description,
      rateLimit: 10,
      web: {
        url: source?.web?.url,
        headers: {},
        crawlerEngine: "FETCH",
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof WebSourceCreateSchema>) => {
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
              ? "Web site updated successfully"
              : "Web site added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        } else {
          toast.error(
            source ? "Failed to update web site" : "Failed to add web site"
          );
        }
      })
      .catch((err) => {
        toast.error(
          source ? "Failed to update web site" : "Failed to add web site"
        );
        console.error(err);
      });
  };

  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Web Site" : "Add Web Site"}
      description={
        source ? "Edit a web site" : "Add a new web site to your list."
      }
      triggerButton={triggerButton}
      buttonText={source ? "Update" : "Add"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            rows={3}
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.url">URL</Label>
          <Input
            id="web.url"
            placeholder="https://www.example.com"
            {...register("web.url")}
          />
          <ErrorMessage>{errors.web?.url?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="proxyId">Proxy</Label>
          <Select {...register("proxyId")}>
            <SelectTrigger>
              <SelectValue placeholder="Select a proxy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="None">None</SelectItem>
              {networkEnvironments.map(
                (networkEnvironment: NetworkEnvironment) => (
                  <SelectItem
                    key={networkEnvironment.id}
                    value={networkEnvironment.id}
                  >
                    {networkEnvironment.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <ErrorMessage>{errors.proxyId?.message}</ErrorMessage>
        </div>
      </div>
    </SettingEditDialog>
  );
};

export default EditWebSiteDialog;
