"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import {
  SocialConfigByPlatform,
  SocialMediaSourceCreateSchema,
} from "@/app/api/_utils/zod";
import SelectProxy from "./SelectProxy";
import { Controller, useForm } from "react-hook-form";
import { Proxy, Source } from "@/lib/generated/prisma";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { z } from "zod";
import ErrorMessage from "@/components/ErrorMessage";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  triggerButton: React.ReactNode;
  proxies: Proxy[];
  source?: Source & { social: z.infer<typeof SocialConfigByPlatform> } & {
    proxy: Proxy;
  };
}

const SocialMediaSourceDialog = ({ triggerButton, proxies, source }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const makeDefaultSocial = (): z.infer<typeof SocialConfigByPlatform> => {
    const platform = source?.social?.platform;
    switch (platform) {
      case "X":
        return {
          platform: "X",
          config: {
            user: source?.social?.config?.user ?? undefined,
            listId: source?.social?.config?.listId ?? undefined,
            query: source?.social?.config?.query ?? undefined,
          },
          credentialId: source?.credentialId ?? undefined,
          proxyId: source?.proxyId ?? undefined,
        };
      case "TELEGRAM":
        return {
          platform: "TELEGRAM",
          config: {
            channel: source?.social?.config?.channel ?? "",
            mode: source?.social?.config?.mode,
          },
          credentialId: source?.credentialId ?? undefined,
          proxyId: source?.proxyId ?? undefined,
        };
      case "REDDIT":
        return {
          platform: "REDDIT",
          config: {
            subreddit: source?.social?.config?.subreddit ?? "",
            sort: source?.social?.config?.sort,
          },
          credentialId: source?.credentialId ?? undefined,
          proxyId: source?.proxyId ?? undefined,
        };
      default:
        // fallback 保守处理
        return {
          platform: "X",
          config: { user: undefined, listId: undefined, query: undefined },
          credentialId: undefined,
          proxyId: undefined,
        };
    }
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SocialMediaSourceCreateSchema),
    defaultValues: {
      name: source?.name ?? "",
      description: source?.description ?? "",
      type: "SOCIAL_MEDIA",
      active: source?.active ?? true,
      rateLimit: source?.rateLimit ?? 10,
      proxyId: source?.proxyId ?? null,
      social: makeDefaultSocial(),
    },
  });
  const onSubmit = async (
    data: z.infer<typeof SocialMediaSourceCreateSchema>
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
              ? "Social media updated successfully"
              : "Social media added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        } else {
          toast.error(
            source
              ? "Failed to update social media"
              : "Failed to add social media"
          );
        }
      })
      .catch((err) => {
        toast.error(
          source
            ? "Failed to update social media"
            : "Failed to add social media"
        );
        console.error(err);
      });
  };
  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Social Media" : "Add Social Media"}
      description={
        source ? "Edit a social media" : "Add a new social media to your list."
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
          <Input
            id="description"
            placeholder="Description"
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="socialMediaType">Type</Label>
          <Controller
            name="social.platform"
            control={control}
            render={({ field }) => (
              <div className="grid gap-3">
                <ControlledSelect
                  value={field.value as string}
                  onValueChange={field.onChange}
                  placeholder="Select a social media platform"
                  nullValue=""
                >
                  <SelectItem value="X">X</SelectItem>
                  <SelectItem value="TELEGRAM">Telegram</SelectItem>
                  <SelectItem value="REDDIT">Reddit</SelectItem>
                </ControlledSelect>
                {field.value === "X" && (
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <Label htmlFor="twitter-user">User</Label>
                      <Input
                        id="twitter-user"
                        placeholder="X User"
                        {...register("social.config.user")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.user?.message}
                      </ErrorMessage>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="twitter-list-id">List ID</Label>
                      <Input
                        id="twitter-list-id"
                        placeholder="X List ID"
                        {...register("social.config.listId")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.listId?.message}
                      </ErrorMessage>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="twitter-query">Query</Label>
                      <Input
                        id="twitter-query"
                        placeholder="X Query"
                        {...register("social.config.query")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.query?.message}
                      </ErrorMessage>
                    </div>
                  </div>
                )}
                {field.value === "TELEGRAM" && (
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <Label htmlFor="telegram-channel">Channel</Label>
                      <Input
                        id="telegram-channel"
                        placeholder="@channel or channel_id"
                        {...register("social.config.channel")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.channel?.message}
                      </ErrorMessage>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="telegram-mode">Mode</Label>
                      <Input
                        id="telegram-mode"
                        placeholder="Mode"
                        {...register("social.config.mode")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.mode?.message}
                      </ErrorMessage>
                    </div>
                  </div>
                )}
                {field.value === "REDDIT" && (
                  <div className="grid gap-3">
                    <div className="grid gap-3">
                      <Label htmlFor="reddit-subreddit">Subreddit</Label>
                      <Input
                        id="reddit-subreddit"
                        placeholder="subreddit name"
                        {...register("social.config.subreddit")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.subreddit?.message}
                      </ErrorMessage>
                    </div>
                    <div className="grid gap-3">
                      <Label htmlFor="reddit-sort">Sort</Label>
                      <Input
                        id="reddit-sort"
                        placeholder="Sort"
                        {...register("social.config.sort")}
                      />
                      <ErrorMessage>
                        {(errors.social?.config as any)?.sort?.message}
                      </ErrorMessage>
                    </div>
                  </div>
                )}
              </div>
            )}
          />
          <ErrorMessage>{errors.social?.platform?.message}</ErrorMessage>
        </div>
        <SelectProxy
          control={control}
          proxies={proxies}
          error={errors.proxyId?.message}
        />
      </div>
    </SettingEditDialog>
  );
};

export default SocialMediaSourceDialog;
