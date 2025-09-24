"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon, XIcon } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Category } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeywordUpdateSchema, KeywordCreateSchema } from "@/app/api/_utils/zod";
import ErrorMessage from "@/components/ErrorMessage";
import { SettingCard } from "@/components/SettingCard";
import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

interface Props {
  keywords: KeywordWithCategory[];
  categories: Category[];
}

const KeywordSettinggCard = ({ keywords, categories }: Props) => {
  return (
    <SettingCard
      title="Manage Keywords"
      description="You can manage your keywords here."
      buttonComponent={
        <EditKeywordDialog
          categories={categories}
          triggerButton={
            <Button>
              <PlusIcon className="size-3" />
              Add Keyword
            </Button>
          }
        />
      }
      filterComponent={
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
      }
    >
      <KeywordsTable keywords={keywords} categories={categories} />
    </SettingCard>
  );
};

const KeywordsTable = ({
  keywords,
  categories,
}: {
  keywords: KeywordWithCategory[];
  categories: Category[];
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Lang</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Includes</TableHead>
          <TableHead>Excludes</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {keywords.map((keyword, index) => (
          <TableRow key={keyword.id}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{keyword.name}</TableCell>
            <TableCell>
              <Badge variant="outline">{keyword.lang}</Badge>
            </TableCell>
            <TableCell>{keyword.category?.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-md">
                {keyword.includes.map((include) => (
                  <Badge
                    key={include}
                    variant="outline"
                    className="flex items-center gap-1"
                  >
                    {include}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
                {keyword.synonyms.map((synonym) => (
                  <Badge key={synonym} variant="secondary">
                    {synonym}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1 max-w-2xl">
                {keyword.excludes.map((exclude) => (
                  <Badge key={exclude} variant="outline">
                    {exclude}
                    <XIcon
                      size={12}
                      color="gray"
                      className="cursor-pointer hover:text-red-500"
                    />
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditKeywordDialog
                  keyword={keyword}
                  categories={categories}
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                  }
                />
                <DeleteKeywordDialog
                  keyword={keyword}
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

const EditKeywordDialog = ({
  keyword,
  categories,
  triggerButton,
}: {
  keyword?: KeywordWithCategory;
  categories: Category[];
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
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
    },
  });

  const enableAiExpand = watch("enableAiExpand");
  const onSubmit = async (
    data: z.infer<typeof KeywordUpdateSchema | typeof KeywordCreateSchema>
  ) => {
    const endpoint = keyword
      ? `/api/follow/keywords/${keyword.id}`
      : "/api/follow/keywords";
    const method = keyword ? "PATCH" : "POST";
    const body = keyword ? JSON.stringify(data) : JSON.stringify(data);
    await fetch(endpoint, { method, body })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok)
            return toast.success(
              keyword
                ? "Keyword updated successfully"
                : "Keyword added successfully"
            );
          return toast.error(
            keyword ? "Failed to update keyword" : "Failed to add keyword"
          );
        };
        setOpen(false);
        handleResponse();
        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        toast.error("Failed to update keyword");
        console.error(err);
      });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerButton}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{keyword ? "Edit Keyword" : "Add Keyword"}</DialogTitle>
          <DialogDescription>
            {keyword
              ? "Edit the keyword to your list."
              : "Add a new keyword to your list."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="keyword">Name</Label>
            <Input
              id="keyword"
              placeholder="Keyword Name"
              {...register("name")}
            />
            <ErrorMessage>{errors.name?.message}</ErrorMessage>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ?? undefined}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category: Category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          <DialogFooter>
            <Button type="submit">{keyword ? "Edit" : "Add"}</Button>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const DeleteKeywordDialog = ({
  keyword,
  triggerButton,
}: {
  keyword: KeywordWithCategory;
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const handleDelete = async (keyword: KeywordWithCategory) => {
    await fetch(`/api/follow/keywords/${keyword.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        const handleResponse = () => {
          if (res.ok) return toast.success("Keyword deleted successfully");
          return toast.error("Failed to delete keyword");
        };

        handleResponse();

        setTimeout(() => {
          router.refresh();
        }, 200);
      })
      .catch((err) => {
        toast.error("Failed to delete keyword");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Keyword"
      description={`Are you sure you want to delete ${keyword.name} keyword?`}
      onDelete={() => handleDelete(keyword)}
    />
  );
};

export default KeywordSettinggCard;
