import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const NewsDetailCard = () => {
  return (
    <Card className="h-[calc(100vh-7rem)] bg-gray-100">
      <CardHeader>
        <CardTitle>News Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Markdown</p>
      </CardContent>
    </Card>
  );
};

export default NewsDetailCard;
