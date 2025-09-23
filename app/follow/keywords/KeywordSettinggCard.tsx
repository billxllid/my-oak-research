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
import { Search } from "lucide-react";
import { Category } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeywordUpdateSchema, KeywordCreateSchema } from "@/app/api/_utils/zod";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

interface Props {
  keywords: KeywordWithCategory[];
  categories: Category[];
}

const KeywordSettinggCard = ({ keywords, categories }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Keywords</CardTitle>
        <CardDescription>You can manage your keywords here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search keywords..."
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
          <EditKeywordDialog
            categories={categories}
            triggerButton={
              <Button size="sm" variant="outline">
                <PlusIcon className="size-3" />
              </Button>
            }
          />
        </div>
        <KeywordsTable keywords={keywords} categories={categories} />
      </CardContent>
    </Card>
  );
};

const KeywordsTable = ({
  keywords,
  categories,
}: {
  keywords: KeywordWithCategory[];
  categories: Category[];
}) => {
  const router = useRouter();
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
  const [enableAiExpand, setEnableAiExpand] = useState(false);
  const KeywordSchema = keyword ? KeywordUpdateSchema : KeywordCreateSchema;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof KeywordSchema>>({
    resolver: zodResolver(KeywordSchema),
    defaultValues: {
      name: keyword?.name,
      categoryId: keyword?.category?.id,
      description: keyword?.description,
      includes: keyword?.includes,
      synonyms: keyword?.synonyms,
      excludes: keyword?.excludes,
    },
  });
  const onSubmit = async (data: z.infer<typeof KeywordSchema>) => {
    console.log(data);
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
        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="keyword">Name</Label>
            <Input
              id="keyword"
              placeholder="Keyword Name"
              required
              {...register("name")}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="category">Category</Label>
            <div id="category">
              <Select
                required
                value={keyword?.category?.id}
                {...register("categoryId")}
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
            </div>
          </div>
          <div className="grid gap-3">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Description"
              required
              rows={3}
              {...register("description")}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="includes">Includes</Label>
            <Textarea
              id="includes"
              placeholder="Includes"
              required
              rows={3}
              {...register("includes")}
            />
            <div className="flex justify-between items-center">
              <div className="grid gap-2">
                <Label htmlFor="synonyms">Synonyms</Label>
                <p className="text-sm text-muted-foreground">
                  You can automatically add synonyms by AI.
                </p>
              </div>
              <Switch
                id="synonyms"
                {...register("enableAiExpand")}
                checked={enableAiExpand}
                onCheckedChange={setEnableAiExpand}
              />
            </div>
            {/* TODO：修改为多数据 */}
            {enableAiExpand && (
              <Textarea
                id="synonyms"
                {...register("synonyms")}
                placeholder="AI Synonyms"
                readOnly
              />
            )}
          </div>
          <div className="grid gap-3">
            <Label htmlFor="excludes">Excludes(Optional)</Label>
            <Textarea
              id="excludes"
              placeholder="Excludes"
              required
              rows={3}
              {...register("excludes")}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)}>
            {keyword ? "Edit" : "Add"}
          </Button>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
        </DialogFooter>
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
    <AlertDialog>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Keyword</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete `{keyword.name}` keyword?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => handleDelete(keyword)}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default KeywordSettinggCard;
