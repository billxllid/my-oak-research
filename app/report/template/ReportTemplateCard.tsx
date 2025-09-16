import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ReportTemplateCardProps {
  id: number;
  name: string;
  description: string;
}

const ReportTemplateCard = ({
  id,
  name,
  description,
}: ReportTemplateCardProps) => {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-2">
          <div className="h-64 w-64 bg-gray-200 rounded-md"></div>
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportTemplateCard;
