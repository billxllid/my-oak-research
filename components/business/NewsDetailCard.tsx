import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Bookmark } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";

const NewsDetailCard = ({
  title,
  summary,
  markdown,
  className,
}: {
  title?: string;
  summary?: string;
  markdown: string;
  className?: string;
}) => {
  return (
    <Card className={cn("h-full px-8 py-14 bg-gray-100", className)}>
      <CardHeader>
        <CardTitle className="mb-4">
          <div className="flex items-center gap-2 justify-between">
            <p className="text-4xl font-bold">{title ? title : "News Title"}</p>
            <div className="flex items-center gap-2">
              <Bookmark size={32} className="fill-red-500 text-red-500" />
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
