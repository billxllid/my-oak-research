import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KeywordSettinggCard from "./KeywordSetting";
import CategorySettingCard from "./CategorySetting";
import { Category, Prisma } from "@/lib/generated/prisma";
import prisma from "@/lib/prisma";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

const KeywordsPage = async () => {
  const categories: Category[] = await prisma.category.findMany({
    orderBy: {
      createdAt: "asc",
    },
  });
  const keywords: KeywordWithCategory[] = await prisma.keyword.findMany({
    include: {
      category: true,
    },
  });
  return (
    <div>
      <Tabs defaultValue="keywords" className="space-y-2">
        <TabsList>
          <TabsTrigger value="keywords">Keywords</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>
        <TabsContent value="keywords">
          <KeywordSettinggCard keywords={keywords} categories={categories} />
        </TabsContent>
        <TabsContent value="categories">
          <CategorySettingCard categories={categories} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default KeywordsPage;
