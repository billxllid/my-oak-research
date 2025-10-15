"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KeywordSettinggCard from "./KeywordSetting";
import CategorySettingCard from "./CategorySetting";
import { Category } from "@/lib/generated/prisma";
import { useQuery } from "@tanstack/react-query";

// Fetcher function for categories
async function fetchCategories() {
  const response = await fetch("/api/follow/categories");
  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }
  const data = await response.json();
  // Categories API returns array directly, not { items: [...] }
  return Array.isArray(data) ? data : [];
}

const KeywordsPage = () => {
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <Tabs defaultValue="keywords" className="space-y-2">
      <TabsList>
        <TabsTrigger value="keywords">Keywords</TabsTrigger>
        <TabsTrigger value="categories">Categories</TabsTrigger>
      </TabsList>
      <TabsContent value="keywords">
        <KeywordSettinggCard categories={categories} />
      </TabsContent>
      <TabsContent value="categories">
        <CategorySettingCard />
      </TabsContent>
    </Tabs>
  );
};

export default KeywordsPage;
