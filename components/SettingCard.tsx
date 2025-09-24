import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface Props {
  title: string;
  description: string;
  filterComponent?: React.ReactNode;
  buttonComponent?: React.ReactNode;
  children?: React.ReactNode;
}

export const SettingCard = ({
  title,
  description,
  filterComponent,
  buttonComponent,
  children,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          {filterComponent}
          {buttonComponent}
        </div>

        {children}
      </CardContent>
    </Card>
  );
};
