"use client";

import React from "react";
import { NewsDetailCard } from "@/components/business";
import { useFollowContent } from "@/components/follow-content/context";
import { useBookmarks } from "@/components/bookmarks/context";

const FollowContent = () => {
  const { selectedContent, isLoading, error } = useFollowContent();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  if (error) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center text-sm text-destructive">
        {error.message ?? "Cannot load content details"}
      </div>
    );
  }

  if (!selectedContent) {
    return (
      <div className="h-[calc(100vh-7rem)] flex items-center justify-center text-sm text-muted-foreground">
        {isLoading
          ? "Loading content..."
          : "Please select a record from the left content list"}
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-7rem)]">
      <NewsDetailCard
        title={selectedContent.title}
        summary={selectedContent.summary}
        markdown={
          selectedContent.markdown ||
          selectedContent.summary ||
          "No content details"
        }
        bookmarked={isBookmarked(selectedContent.id)}
        onBookmarkToggle={() => toggleBookmark(selectedContent)}
      />
    </div>
  );
};

export default FollowContent;
