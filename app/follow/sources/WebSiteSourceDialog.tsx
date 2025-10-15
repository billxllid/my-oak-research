"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WebSourceCreateSchema } from "@/app/api/_utils/zod";
import { SettingEditDialog } from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@/components/ui/select";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { ErrorMessage } from "@/components/business";
import { WebSourceConfig, Source, Proxy } from "@/lib/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import SelectProxy from "./SelectProxy";
import { useSourceMutation } from "@/hooks/useSourceMutation";

interface Props {
  triggerButton: React.ReactNode;
  source?: Source & { web: WebSourceConfig } & { proxy: Proxy };
  proxies: Proxy[];
}

const WebSiteSourceDialog = ({ triggerButton, source, proxies }: Props) => {
  const [open, setOpen] = useState(false);

  const mutation = useSourceMutation({
    sourceId: source?.id,
    queryKeyType: "WEB",
    onSuccess: () => {
      setOpen(false);
      if (!source) {
        reset();
      }
    },
  });

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(WebSourceCreateSchema),
    defaultValues: {
      name: source?.name || "",
      description: source?.description || "",
      type: "WEB",
      active: source?.active || true,
      rateLimit: source?.rateLimit || 10,
      proxyId: source?.proxyId || null,
      web: {
        url: source?.web?.url || "",
        headers: source?.web?.headers
          ? JSON.stringify(source.web.headers, null, 2)
          : undefined,
        crawlerEngine: source?.web?.crawlerEngine || "FETCH",
        render: source?.web?.render || false,
        parseRules: source?.web?.parseRules
          ? JSON.stringify(source.web.parseRules, null, 2)
          : undefined,
        robotsRespect: source?.web?.robotsRespect || true,
      },
    },
  });

  const onSubmit = async (data: z.infer<typeof WebSourceCreateSchema>) => {
    mutation.mutate(data);
  };

  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Web Site" : "Add Web Site"}
      description={
        source ? "Edit a web site" : "Add a new web site to your list."
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

        <SelectProxy
          control={control}
          proxies={proxies}
          error={errors.proxyId?.message}
        />

        <div className="grid gap-3">
          <Label htmlFor="web.headers">Headers</Label>
          <Textarea
            id="web.headers"
            rows={3}
            placeholder="e.g. {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}"
            {...register("web.headers" as const)}
          />
          <ErrorMessage>{errors.web?.headers?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.parseRules">Parse Rules</Label>
          <Textarea
            id="web.parseRules"
            rows={3}
            placeholder="e.g. {'title': 'h1', 'content': 'p'}"
            {...register("web.parseRules" as const)}
          />
          <ErrorMessage>{errors.web?.parseRules?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.crawlerEngine">Crawler Engine</Label>
          <Controller
            name="web.crawlerEngine"
            control={control}
            render={({ field }) => (
              <ControlledSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select a crawler engine"
                nullValue=""
              >
                <SelectItem value="FETCH">Fetch</SelectItem>
                <SelectItem value="CHEERIO">Cheerio</SelectItem>
                <SelectItem value="PLAYWRIGHT">Playwright</SelectItem>
                <SelectItem value="PUPPETEER">Puppeteer</SelectItem>
                <SelectItem value="CUSTOM">Custom</SelectItem>
              </ControlledSelect>
            )}
          />
          <ErrorMessage>{errors.web?.crawlerEngine?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.render">Render</Label>
          <Switch
            id="web.render"
            checked={watch("web.render")}
            onClick={() => {
              setValue("web.render", !watch("web.render") as boolean);
            }}
          />
          <ErrorMessage>{errors.web?.render?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.robotsRespect">Robots Respect</Label>
          <Switch
            id="web.robotsRespect"
            checked={watch("web.robotsRespect")}
            onClick={() => {
              setValue(
                "web.robotsRespect",
                !watch("web.robotsRespect") as boolean
              );
            }}
          />
          <ErrorMessage>{errors.web?.robotsRespect?.message}</ErrorMessage>
        </div>
      </div>
    </SettingEditDialog>
  );
};

export default WebSiteSourceDialog;
