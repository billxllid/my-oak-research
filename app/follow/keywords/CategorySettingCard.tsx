"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Category } from "@/lib/generated/prisma";
import {
  CategoryCreateSchema,
  CategoryUpdateSchema,
} from "@/app/api/_utils/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  categories: Category[];
}

const CategorySettingCard = ({ categories }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Keyword Categories</CardTitle>
        <CardDescription>
          You can manage your keyword categories here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search categories..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category: Category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <EditCategoryDialog
            triggerButton={
              <Button>
                <PlusIcon />
                Add Category
              </Button>
            }
          />
        </div>
        <CategoryTable categories={categories} />
      </CardContent>
    </Card>
  );
};

const CategoryTable = ({ categories }: { categories: Category[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.map((category, index) => (
          <TableRow key={category.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{category.name}</TableCell>
            <TableCell>{category.description || "-"}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditCategoryDialog
                  category={category}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                  }
                />
                <DeleteCategoryDialog
                  category={category}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <TrashIcon className="size-3" />
                    </Button>
                  }
                />
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add Category"}
          </DialogTitle>
          <DialogDescription>
            {category
              ? "Edit the category to your list."
              : "Add a new category to your list."}
          </DialogDescription>
        </DialogHeader>

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

        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>
            {category ? "Edit" : "Add"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const DeleteCategoryDialog = ({
  category,
  triggerButton,
}: {
  category: Category;
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const handleDelete = async (category: Category) => {
    await fetch(`/api/follow/categories/${category.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok) return toast.success("Category deleted successfully");
          if (res.status === 409)
            return toast.error(
              "Category is in use by keywords; migrate or remove those first"
            );
          return toast.error("Failed to delete category");
        };

        handleResponse();

        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        toast.error("Failed to delete category");
        console.error(err);
      });
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Category</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete `{category.name}` category?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(category)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CategorySettingCard;
