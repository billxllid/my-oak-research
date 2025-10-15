"use client";

import { Category, Prisma } from "@/lib/generated/prisma";
import { SelectItem } from "@/components/ui/select";
import { ControlledSelect } from "@/components/ui/controlled-select";
import { Controller } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { KeywordUpdateSchema, KeywordCreateSchema } from "@/app/api/_utils/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/business";
import { SettingEditDialog } from "@/components/layout";
import { useKeywordMutation } from "@/hooks/useKeywordMutation";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

const EditKeywordDialog = ({
  keyword,
  categories,
  triggerButton,
}: {
  keyword?: KeywordWithCategory;
  categories: Category[];
  triggerButton: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const mutation = useKeywordMutation({
    keywordId: keyword?.id,
    onSuccess: () => {
      setOpen(false);
      if (!keyword) {
        reset();
      }
    },
  });

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(keyword ? KeywordUpdateSchema : KeywordCreateSchema),
    defaultValues: {
      name: keyword?.name || "",
      categoryId: keyword?.category?.id || undefined,
      description: keyword?.description || "",
      includes: keyword?.includes || [],
      synonyms: keyword?.synonyms || [],
      excludes: keyword?.excludes || [],
      enableAiExpand: keyword?.enableAiExpand || false,
      lang: (keyword?.lang as "auto" | "zh" | "en" | "ja") || "auto",
      active: keyword?.active ?? true,
    },
  });

  const enableAiExpand = watch("enableAiExpand");

  const onSubmit = async (
    data: z.infer<typeof KeywordUpdateSchema | typeof KeywordCreateSchema>
  ) => {
    mutation.mutate(data);
  };

  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      buttonText={
        mutation.isPending
          ? keyword
            ? "Updating..."
            : "Adding..."
          : keyword
          ? "Update"
          : "Add"
      }
      title={keyword ? "Edit Keyword" : "Add Keyword"}
      description={
        keyword
          ? "Edit the keyword to your list."
          : "Add a new keyword to your list."
      }
      triggerButton={triggerButton}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-3">
        <Label htmlFor="keyword">Name</Label>
        <Input id="keyword" placeholder="Keyword Name" {...register("name")} />
        <ErrorMessage>{errors.name?.message}</ErrorMessage>
      </div>
      <div className="grid gap-3">
        <Label htmlFor="categoryId">Category</Label>
        <Controller
          name="categoryId"
          control={control}
          render={({ field }) => (
            <ControlledSelect
              value={field.value}
              onValueChange={field.onChange}
              placeholder="Select a category"
              nullValue="none"
            >
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </ControlledSelect>
          )}
        />
        <ErrorMessage>{errors.categoryId?.message}</ErrorMessage>
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
        <Label htmlFor="includes">Includes</Label>
        <Textarea
          id="includes"
          placeholder="Includes"
          rows={3}
          {...register("includes")}
        />
        <ErrorMessage>{errors.includes?.message}</ErrorMessage>
        <div className="flex justify-between items-center">
          <div className="grid gap-2">
            <Label htmlFor="synonyms">Synonyms</Label>
            <p className="text-sm text-muted-foreground">
              You can automatically add synonyms by AI.
            </p>
          </div>
          <Controller
            name="enableAiExpand"
            control={control}
            render={({ field }) => (
              <Switch
                id="synonyms"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          />
        </div>
        {enableAiExpand && (
          <div className="grid gap-3">
            <Textarea
              id="synonyms"
              {...register("synonyms")}
              placeholder="AI Synonyms"
            />
            <ErrorMessage>{errors.synonyms?.message}</ErrorMessage>
          </div>
        )}
      </div>
      <div className="grid gap-3">
        <Label htmlFor="excludes">Excludes(Optional)</Label>
        <Textarea
          id="excludes"
          placeholder="Excludes"
          rows={3}
          {...register("excludes")}
        />
        <ErrorMessage>{errors.excludes?.message}</ErrorMessage>
      </div>
    </SettingEditDialog>
  );
};

export default EditKeywordDialog;
