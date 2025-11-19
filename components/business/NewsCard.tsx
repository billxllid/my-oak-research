import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NewsCardProps {
  title: string;
  summary: string;
  image?: string;
  platform?: string;
  time?: string;
  mark?: boolean;
  onBookmarkToggle?: () => void;
}

const NewsCard = ({
  title,
  summary,
  image,
  platform,
  time,
  mark,
  onBookmarkToggle,
}: NewsCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex gap-4 items-center">
          {image && (
            <div className="bg-gray-200 flex-shrink-0 rounded-md w-36 h-36"></div>
          )}

          <div className="flex flex-col gap-2 justify-between overflow-hidden min-h-36 w-full">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground break-words line-clamp-3">
                {summary}
              </p>
            </div>

            <div className="flex gap-2 justify-between items-center">
              <div className="flex gap-2">
                <Badge variant="outline">
                  <Globe />
                  {platform}
                </Badge>
                <Badge variant="outline">
                  <Calendar />
                  {time}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label={mark ? "Remove from bookmarks" : "Add to bookmarks"}
                onClick={(event) => {
                  event.stopPropagation();
                  onBookmarkToggle?.();
                }}
              >
                <Bookmark
                  size={32}
                  className={
                    mark ? "fill-red-500 text-red-500" : "text-muted-foreground"
                  }
                />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
