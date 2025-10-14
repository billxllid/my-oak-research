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
import { SettingCard } from "@/components/common";
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
      count={keywords.length}
      countLabel="keywords"
    >
      <div className="space-y-4">
        <div className="flex gap-4 justify-between items-center">
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
              <Button>
                <PlusIcon className="size-4" />
                Add Keyword
              </Button>
            }
          />
        </div>
        <KeywordsTable keywords={keywords} categories={categories} />
      </div>
    </SettingCard>
  );
};

export default KeywordSettinggCard;
