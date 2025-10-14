"use client";

import { Category } from "@/lib/generated/prisma";
import {
  CategoryUpdateSchema,
  CategoryCreateSchema,
} from "@/app/api/_utils/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { SettingEditDialog } from "@/components/layout";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ErrorMessage } from "@/components/business";

const EditCategoryDialog = ({
  category,
  triggerButton,
}: {
  category?: Category;
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const CategorySchema = category ? CategoryUpdateSchema : CategoryCreateSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof CategorySchema>>({
    resolver: zodResolver(CategorySchema),
    defaultValues: {
      name: category?.name,
      description: category?.description,
    },
  });

  const onSubmit = async (data: z.infer<typeof CategorySchema>) => {
    const endpoint = category
      ? `/api/follow/categories/${category.id}`
      : "/api/follow/categories";
    const method = category ? "PATCH" : "POST";
    const body = category ? JSON.stringify(data) : JSON.stringify(data);
    await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body,
    })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok)
            return toast.success(
              category
                ? "Category updated successfully"
                : "Category added successfully"
            );
          return toast.error(
            category ? "Failed to update category" : "Failed to add category"
          );
        };
        setOpen(false);
        handleResponse();
        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={category ? "Edit Category" : "Add Category"}
      description={
        category
          ? "Edit the category to your list."
          : "Add a new category to your list."
      }
      triggerButton={triggerButton}
      buttonText={category ? "Edit" : "Add"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="category-name">Category Name</Label>
          <Input
            id="category-name"
            placeholder="Category Name"
            required
            {...register("name")}
          />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>

        <div className="grid gap-3">
          <Label htmlFor="category-description">Category Description</Label>
          <Textarea
            id="category-description"
            placeholder="Category Description"
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
      </div>
    </SettingEditDialog>
  );
};

export default EditCategoryDialog;
