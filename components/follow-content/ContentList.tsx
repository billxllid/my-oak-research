"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NewsCard } from "@/components/business";
import { useBookmarks } from "@/components/bookmarks/context";
import { useFollowContent } from "./context";

export const ContentList = () => {
  const { contents, selectedContent, selectContent, isLoading, error } =
    useFollowContent();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  return (
    <ScrollArea className="h-[calc(100vh-11rem)] pr-4">
      <div className="flex flex-col gap-4 overflow-visible px-1">
        {isLoading && (
          <div className="text-sm text-muted-foreground px-2">
            Loading content...
          </div>
        )}
        {error && (
          <div className="text-sm text-destructive px-2">
            {error.message ?? "Cannot load content"}
          </div>
        )}
        {!isLoading && !error && !contents.length && (
          <div className="text-sm text-muted-foreground px-2">
            No content found. Try adjusting your filters.
          </div>
        )}
        {contents.map((content) => {
          const isActive = selectedContent?.id === content.id;
          const bookmarked = isBookmarked(content.id);
          return (
            <div
              key={content.id}
              onClick={() => selectContent(content.id)}
              className={`cursor-pointer transition-all duration-200 ${
                isActive
                  ? "rounded-2xl bg-muted shadow-xl"
                  : "hover:-translate-y-0.5"
              }`}
            >
              <NewsCard
                title={content.title}
                summary={content.summary}
                platform={content.platform}
                time={new Date(content.time).toLocaleDateString()}
                mark={bookmarked}
                onBookmarkToggle={() => toggleBookmark(content)}
              />
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
