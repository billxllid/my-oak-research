import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import KeywordSettinggCard, { Keyword } from "./KeywordSettinggCard";
import CategorySettingCard, { Category } from "./CategorySettingCard";

const KeywordsPage = () => {
  // 默认分类：人物、事件、组织、地点，并且可以添加自定义分类
  const categories: Category[] = [
    {
      id: "1",
      key: "person",
      name: "Person",
      description: "Person",
    },
    {
      id: "2",
      key: "event",
      name: "Event",
      description: "Event",
    },
    {
      id: "3",
      key: "organization",
      name: "Organization",
      description: "Organization",
    },
    {
      id: "4",
      key: "location",
      name: "Location",
      description: "Location",
    },
  ];

  const keywords: Keyword[] = [
    {
      id: "1",
      name: "Trump",
      category: {
        id: "1",
        key: "person",
        name: "Person",
        description: "Person",
      },
      derived: ["Trump", "Donald Trump", "Donald J. Trump", "Trump Jr."],
    },
    {
      id: "2",
      name: "Pakistan",
      category: {
        id: "4",
        key: "location",
        name: "Location",
        description: "Location",
      },
      derived: [
        "Pakistan",
        "Pakistani",
        "Pakistani people",
        "Pakistani culture",
        "Pakistani history",
        "Pakistani geography",
        "Pakistani economy",
        "Pakistani politics",
        "Pakistani society",
        "Pakistani religion",
      ],
    },
    {
      id: "3",
      name: "ISIS",
      category: {
        id: "3",
        key: "organization",
        name: "Organization",
        description: "Organization",
      },
      derived: [
        "ISIS",
        "IS-K",
        "Islamic State",
        "Islamic State of Iraq and the Levant",
      ],
    },
    {
      id: "4",
      name: "Israeli-Iranian War",
      category: {
        id: "2",
        key: "event",
        name: "Event",
        description: "Event",
      },
      derived: ["Israeli-Iranian War", "Israeli-Iranian Conflict"],
    },
  ];

  return (
    <div>
      <Tabs defaultValue="keywords">
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
