"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SelectItem } from "@/components/ui/select";
import { SocialMediaSourceCreateSchema } from "@/app/api/_utils/zod";
import SelectProxy from "./SelectProxy";
import { Controller, useForm } from "react-hook-form";
import { Proxy } from "@/lib/generated/prisma";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { zodResolver } from "@hookform/resolvers/zod";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { z } from "zod";
import ErrorMessage from "@/components/ErrorMessage";

interface Props {
  proxies: Proxy[];
}

const EditSocialMediaDialog = ({ proxies }: Props) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SocialMediaSourceCreateSchema),
    defaultValues: {
      name: "Test",
      description: "Test",
      type: "SOCIAL_MEDIA",
      social: {
        platform: "X",
        config: {
          user: "Test",
          listId: "Test",
          query: "Test",
        },
      },
    },
  });
  const onSubmit = (data: z.infer<typeof SocialMediaSourceCreateSchema>) => {
    console.log(data);
  };
  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title="Add Social Media"
      description="Add a new social media to your list."
      triggerButton={
        <Button>
          <PlusIcon />
          Add Social Media
        </Button>
      }
      buttonText="Add"
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
                )}
                {field.value === "REDDIT" && (
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

export default EditSocialMediaDialog;
