"use client";

import React from "react";
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
import { CategoryCreateSchema } from "@/app/api/_utils/zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

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
          <AddCategoryDialog />
        </div>
        <CategoryTable categories={categories} />
      </CardContent>
    </Card>
  );
};

const CategoryTable = ({ categories }: { categories: Category[] }) => {
  const handleEdit = async (category: Category) => {
    console.log("edit", category);
  };

  const handleDelete = async (category: Category) => {
    await fetch(`/api/follow/categories/${category.id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
  };

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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(category)}
                >
                  <PencilIcon className="size-3" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(category)}
                >
                  <TrashIcon className="size-3" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

const AddCategoryDialog = () => {
  const { register, handleSubmit } = useForm<
    z.infer<typeof CategoryCreateSchema>
  >({
    resolver: zodResolver(CategoryCreateSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof CategoryCreateSchema>) => {
    await fetch("/api/follow/categories", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Add Category
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Add a new category to your list.
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
          </div>

          <div className="grid gap-3">
            <Label htmlFor="category-description">Category Description</Label>
            <Textarea
              id="category-description"
              placeholder="Category Description"
              {...register("description")}
            />
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>Add</Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CategorySettingCard;
