import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Globe, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";

interface NewsCardProps {
  title: string;
  summary: string;
  image?: string;
  platform?: string;
  time?: string;
}

const NewsCard = ({ title, summary, image, platform, time }: NewsCardProps) => {
  return (
    <Card className="w-full">
      <CardContent>
        <div className="flex gap-4">
          {image && (
            <div className="bg-gray-200 flex-shrink-0 rounded-md w-24 h-24"></div>
          )}

          <div className="flex flex-col gap-2 justify-between w-full overflow-hidden">
            <div className="flex flex-col gap-2">
              <h1 className="text-lg font-bold">{title}</h1>
              <p className="text-sm text-muted-foreground">{summary}</p>
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
              <Button variant="ghost" size="icon">
                <Bookmark />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsCard;
