"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchEngineSourceCreateSchema } from "@/app/api/_utils/zod";
import { z } from "zod";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Source,
  SearchEngineSourceConfig,
  Proxy,
} from "@/lib/generated/prisma";
import SelectProxy from "./SelectProxy";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  triggerButton: React.ReactNode;
  source?: Source & { search: SearchEngineSourceConfig } & { proxy: Proxy };
  proxies: Proxy[];
}

const SearchEngineSourceDialog = ({
  triggerButton,
  source,
  proxies,
}: Props) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SearchEngineSourceCreateSchema),
    defaultValues: {
      name: source?.name ?? "",
      description: source?.description ?? "",
      type: "SEARCH_ENGINE",
      proxyId: source?.proxyId ?? null,
      search: {
        engine: "GOOGLE",
        query: source?.search?.query ?? "",
        region: source?.search?.region ?? "",
        lang: (source?.search?.lang as "auto" | "zh" | "en" | "ja") ?? "auto",
        apiEndpoint: source?.search?.apiEndpoint ?? "",
        options:
          typeof source?.search?.options === "object" &&
          source?.search?.options !== null &&
          !Array.isArray(source?.search?.options)
            ? source.search.options
            : {},
      },
    },
  });
  const onSubmit = async (
    data: z.infer<typeof SearchEngineSourceCreateSchema>
  ) => {
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
              ? "Search engine updated successfully"
              : "Search engine added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        } else {
          toast.error(
            source
              ? "Failed to update search engine"
              : "Failed to add search engine"
          );
        }
      })
      .catch((err) => {
        toast.error(
          source
            ? "Failed to update search engine"
            : "Failed to add search engine"
        );
      });
  };
  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Search Engine" : "Add Search Engine"}
      description={
        source
          ? "Edit a search engine"
          : "Add a new search engine to your list."
      }
      buttonText={source ? "Update" : "Add"}
      triggerButton={triggerButton}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="keyword">Name</Label>
          <Input
            id="keyword"
            placeholder="Name"
            {...register("name")}
            required
          />
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
          <Label htmlFor="url">Query</Label>
          <Input
            id="url"
            placeholder="Query"
            {...register("search.query")}
            required
          />
          <ErrorMessage>{errors.search?.query?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="url">Region</Label>
          <Input
            id="url"
            placeholder="Region"
            {...register("search.region")}
            required
          />
          <ErrorMessage>{errors.search?.region?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="url">Lang</Label>
          <Input
            id="url"
            placeholder="Lang"
            {...register("search.lang")}
            required
          />
          <ErrorMessage>{errors.search?.lang?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="url">API Endpoint</Label>
          <Input
            id="url"
            placeholder="API Endpoint"
            {...register("search.apiEndpoint")}
            required
          />
          <ErrorMessage>{errors.search?.apiEndpoint?.message}</ErrorMessage>
        </div>
        <SelectProxy control={control} proxies={proxies} />
      </div>
    </SettingEditDialog>
  );
};

export default SearchEngineSourceDialog;
