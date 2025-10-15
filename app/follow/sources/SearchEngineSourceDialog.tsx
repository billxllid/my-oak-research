"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SearchEngineSourceCreateSchema } from "@/app/api/_utils/zod";
import { z } from "zod";
import { SettingEditDialog } from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Source,
  SearchEngineSourceConfig,
  Proxy,
} from "@/lib/generated/prisma";
import SelectProxy from "./SelectProxy";
import { ErrorMessage } from "@/components/business";
import { useSourceMutation } from "@/hooks/useSourceMutation";

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

  const mutation = useSourceMutation({
    sourceId: source?.id,
    queryKeyType: "SEARCH_ENGINE",
    onSuccess: () => {
      setOpen(false);
      if (!source) {
        reset();
      }
    },
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    reset,
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
    mutation.mutate(data);
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
      buttonText={
        mutation.isPending
          ? source
            ? "Updating..."
            : "Adding..."
          : source
          ? "Update"
          : "Add"
      }
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
