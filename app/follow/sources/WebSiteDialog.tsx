import { useState } from "react";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { WebSourceCreateSchema } from "@/app/api/_utils/zod";
import { toast } from "sonner";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectItem } from "@/components/ui/select";
import { ControlledSelect } from "@/components/ui/controlled-select";
import ErrorMessage from "@/components/ErrorMessage";
import { WebSourceConfig, Source, Proxy } from "@/lib/generated/prisma";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PlusIcon, TestTube } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface Props {
  triggerButton: React.ReactNode;
  source?: Source & { web: WebSourceConfig } & { proxy: Proxy };
  proxies: Proxy[];
}

const EditWebSiteDialog = ({ triggerButton, source, proxies }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(WebSourceCreateSchema),
    defaultValues: {
      name: source?.name || "",
      type: "WEB",
      active: source?.active || true,
      description: source?.description || "",
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
          <Controller
            name="proxyId"
            control={control}
            render={({ field }) => (
              <ControlledSelect
                value={field.value}
                onValueChange={field.onChange}
                placeholder="Select a proxy"
                nullValue="none"
              >
                {proxies.map((proxy: Proxy) => (
                  <SelectItem key={proxy.id} value={proxy.id}>
                    {proxy.name}
                  </SelectItem>
                ))}
              </ControlledSelect>
            )}
          />
          <ErrorMessage>{errors.proxyId?.message}</ErrorMessage>
        </div>
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

export default EditWebSiteDialog;
