import { Control, UseFormRegister, FieldErrors, UseFormWatch } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ErrorMessage } from "@/components/business";
import SelectProxy from "./SelectProxy";
import { Proxy } from "@/lib/generated/prisma";
import { SourceCreateSchema } from "@/app/api/_utils/zod"; // Adjust if you have a specific social media schema
import { Controller } from "react-hook-form";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { SelectItem } from "@/components/ui/select";
import { SocialPlatform } from "@/lib/generated/prisma";

interface SocialMediaFieldsProps {
  register: UseFormRegister<z.infer<typeof SourceCreateSchema>>;
  control: Control<z.infer<typeof SourceCreateSchema>>;
  errors: FieldErrors<z.infer<typeof SourceCreateSchema>>;
  proxies: Proxy[];
  watch: UseFormWatch<z.infer<typeof SourceCreateSchema>>;
}

export const SocialMediaFields = ({
  register,
  control,
  errors,
  proxies,
  watch,
}: SocialMediaFieldsProps) => {
  const socialPlatform = watch("social.platform") as SocialPlatform | undefined;

  return (
    <>
      <div className="grid gap-3">
        <Label htmlFor="social.platform">Platform</Label>
        <Controller
          name="social.platform"
          control={control}
          render={({ field }) => (
            <ControlledSelect
              value={field.value as string}
              onValueChange={field.onChange}
              placeholder="Select a social media platform"
            >
              {Object.values(SocialPlatform).map((platform) => (
                <SelectItem key={platform} value={platform}>
                  {platform}
                </SelectItem>
              ))}
            </ControlledSelect>
          )}
        />
        <ErrorMessage>{errors.social?.platform?.message}</ErrorMessage>
      </div>

      {socialPlatform === "X" && (
        <>
          <div className="grid gap-3">
            <Label htmlFor="social.config.user">User</Label>
            <Input
              id="social.config.user"
              placeholder="X User"
              {...register("social.config.user")}
            />
            <ErrorMessage>{errors.social?.config?.X?.user?.message}</ErrorMessage>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="social.config.listId">List ID</Label>
            <Input
              id="social.config.listId"
              placeholder="X List ID"
              {...register("social.config.listId")}
            />
            <ErrorMessage>{errors.social?.config?.X?.listId?.message}</ErrorMessage>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="social.config.query">Query</Label>
            <Input
              id="social.config.query"
              placeholder="X Query"
              {...register("social.config.query")}
            />
            <ErrorMessage>{errors.social?.config?.X?.query?.message}</ErrorMessage>
          </div>
        </>
      )}

      {socialPlatform === "TELEGRAM" && (
        <>
          <div className="grid gap-3">
            <Label htmlFor="social.config.channel">Channel</Label>
            <Input
              id="social.config.channel"
              placeholder="@channel or channel_id"
              {...register("social.config.channel")}
            />
            <ErrorMessage>{errors.social?.config?.TELEGRAM?.channel?.message}</ErrorMessage>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="social.config.mode">Mode</Label>
            <Input
              id="social.config.mode"
              placeholder="Mode"
              {...register("social.config.mode")}
            />
            <ErrorMessage>{errors.social?.config?.TELEGRAM?.mode?.message}</ErrorMessage>
          </div>
        </>
      )}

      {socialPlatform === "REDDIT" && (
        <>
          <div className="grid gap-3">
            <Label htmlFor="social.config.subreddit">Subreddit</Label>
            <Input
              id="social.config.subreddit"
              placeholder="subreddit name"
              {...register("social.config.subreddit")}
            />
            <ErrorMessage>{errors.social?.config?.REDDIT?.subreddit?.message}</ErrorMessage>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="social.config.sort">Sort</Label>
            <Input
              id="social.config.sort"
              placeholder="Sort"
              {...register("social.config.sort")}
            />
            <ErrorMessage>{errors.social?.config?.REDDIT?.sort?.message}</ErrorMessage>
          </div>
        </>
      )}

      <SelectProxy control={control} proxies={proxies} error={errors.proxyId?.message} />
    </>
  );
};