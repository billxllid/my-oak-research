import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NewsDetailCard = ({
  title,
  summary,
  markdown,
  className,
  bookmarked,
  onBookmarkToggle,
}: {
  title?: string;
  summary?: string;
  markdown: string;
  className?: string;
  bookmarked?: boolean;
  onBookmarkToggle?: () => void;
}) => {
  return (
    <Card className={cn("h-full px-8 py-14 bg-gray-100", className)}>
      <CardHeader>
        <CardTitle className="mb-4">
          <div className="flex items-center gap-2 justify-between">
            <p className="text-4xl font-bold">{title ? title : "News Title"}</p>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 p-0" // Button 自身保持 40px
                onClick={(event) => {
                  event.stopPropagation();
                  onBookmarkToggle?.();
                }}
              >
                <Bookmark
                  // 关键点：使用 "size-8" (32px)
                  // 1. 它包含了 "size-" 字符串，能避开 Button 的强制缩小规则
                  // 2. 它直接设置了 width: 32px; height: 32px;
                  className={cn(
                    "size-8",
                    bookmarked
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            </div>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {summary ? summary : "News Summary News Summary News Summary"}
        </p>
      </CardHeader>
      <CardContent className="px-6 overflow-y-auto">
        <article className="prose dark:prose-invert">
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </article>
      </CardContent>
    </Card>
  );
};

export default NewsDetailCard;
