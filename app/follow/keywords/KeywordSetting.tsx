"use client";

import React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Category } from "@/lib/generated/prisma";
import { Prisma } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/SettingCard";
import EditKeywordDialog from "./KeywordDialog";
import KeywordsTable from "./Keywords";

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

export default KeywordSettinggCard;
