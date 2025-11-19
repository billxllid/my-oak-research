"use client";

import React from "react";
import { NewsDetailCard } from "@/components/business";
import { useFollowContent } from "@/components/follow-content/context";

const FollowContent = () => {
  const { selectedContent, isLoading, error } = useFollowContent();

  if (error) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center text-sm text-destructive">
        {error.message ?? "无法加载内容详情"}
      </div>
    );
  }

  if (!selectedContent) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center text-sm text-muted-foreground">
        {isLoading ? "正在加载内容..." : "请从左侧内容列表选择一条记录"}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)]">
      <NewsDetailCard
        title={selectedContent.title}
        summary={selectedContent.summary}
        markdown={
          selectedContent.markdown || selectedContent.summary || "暂无详情内容"
        }
      />
    </div>
  );
};

export default FollowContent;
