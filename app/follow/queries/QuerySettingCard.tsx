"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Search, PencilIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Keyword } from "../keywords/KeywordSetting";
import { socialMedia } from "../sources/SocialMediaSettingCard";

interface Query {
  id: string;
  keywords: Keyword[];
  soureces: string[];
}

const QuerySettingCard = () => {
  const keywords: Keyword[] = [
    {
      id: "1",
      name: "Trump",
      category: {
        id: "1",
        key: "person",
        name: "Person",
        description: "Person",
      },
      derived: ["Trump", "Donald Trump", "Donald J. Trump", "Trump Jr."],
    },
    {
      id: "2",
      name: "Pakistan",
      category: {
        id: "4",
        key: "location",
        name: "Location",
        description: "Location",
      },
      derived: [
        "Pakistan",
        "Pakistani",
        "Pakistani people",
        "Pakistani culture",
        "Pakistani history",
        "Pakistani geography",
        "Pakistani economy",
        "Pakistani politics",
        "Pakistani society",
        "Pakistani religion",
      ],
    },
    {
      id: "3",
      name: "ISIS",
      category: {
        id: "3",
        key: "organization",
        name: "Organization",
        description: "Organization",
      },
      derived: [
        "ISIS",
        "IS-K",
        "Islamic State",
        "Islamic State of Iraq and the Levant",
      ],
    },
    {
      id: "4",
      name: "Israeli-Iranian War",
      category: {
        id: "2",
        key: "event",
        name: "Event",
        description: "Event",
      },
      derived: ["Israeli-Iranian War", "Israeli-Iranian Conflict"],
    },
  ];

  const Queries: Query[] = [
    {
      id: "1",
      keywords: [keywords[0], keywords[1]],
      soureces: [socialMedia[0].api.name, socialMedia[1].api.name],
    },
    {
      id: "2",
      keywords: [keywords[2], keywords[3]],
      soureces: [socialMedia[1].api.name, socialMedia[2].api.name],
    },
  ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Queries</CardTitle>
        <CardDescription>You can manage queries here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search queries..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by query" />
            </SelectTrigger>
          </Select>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Keywords</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Queries.map((query) => (
              <TableRow key={query.id}>
                <TableCell>{query.id}</TableCell>
                <TableCell>
                  {query.keywords.map((keyword) => keyword.name).join(", ")}
                </TableCell>
                <TableCell>{query.soureces.join(", ")}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <TrashIcon className="size-3" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default QuerySettingCard;
