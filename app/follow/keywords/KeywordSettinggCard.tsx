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
import { Category } from "./CategorySettingCard";

export interface Keyword {
  id: string;
  name: string;
  category: Category;
  derived: string[];
}

interface Props {
  keywords: Keyword[];
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
                <SelectItem key={category.key} value={category.key}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button>
                  <PlusIcon />
                  Add Keyword
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Keyword</DialogTitle>
                  <DialogDescription>
                    Add a new keyword to your list.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="grid gap-3">
                    <Label htmlFor="keyword">Keyword</Label>
                    <Input id="keyword" placeholder="Keyword" required />
                  </div>
                  <div className="grid gap-3">
                    <Label htmlFor="category">Category</Label>
                    <div id="category">
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category: Category) => (
                            <SelectItem key={category.key} value={category.key}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-3">
                    <div className="flex justify-between items-center">
                      <div className="grid gap-2">
                        <Label htmlFor="derived">Derived</Label>
                        <p className="text-sm text-muted-foreground">
                          You can automatically derive keywords by AI.
                        </p>
                      </div>
                      <Switch id="derived" />
                    </div>
                    <Textarea
                      id="derived-keywords"
                      placeholder="Derived keywords"
                      defaultValue={`Derived 1; Derived 2; Derived 3; Derived 4;`}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button>Add</Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </form>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Derived</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keywords.map((keyword: Keyword) => (
              <TableRow key={keyword.id}>
                <TableCell>{keyword.id}</TableCell>
                <TableCell>{keyword.name}</TableCell>
                <TableCell>{keyword.category.name}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1 max-w-2xl">
                    {keyword.derived.map((derived) => (
                      <Badge
                        key={derived}
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        {derived}
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
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="size-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default KeywordSettinggCard;
