"use client";
import React from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, X } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";

const KeywordsTable = () => {
  const keywords: {
    id: string;
    name: string;
    category: string;
    derived: string[];
  }[] = [
    {
      id: "1",
      name: "Keyword 1",
      category: "Category 1",
      derived: ["Derived 1", "Derived 2", "Derived 3"],
    },
    {
      id: "2",
      name: "Keyword 2",
      category: "Category 2",
      derived: ["Derived 2", "Derived 3"],
    },
    {
      id: "3",
      name: "Keyword 3",
      category: "Category 3",
      derived: ["Derived 3", "Derived 4", "Derived 5"],
    },
    {
      id: "4",
      name: "Keyword 4",
      category: "Category 4",
      derived: ["Derived 4"],
    },
  ];
  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Derived</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {keywords.map((keyword) => (
            <TableRow key={keyword.id}>
              <TableCell>{keyword.id}</TableCell>
              <TableCell>{keyword.name}</TableCell>
              <TableCell>{keyword.category}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  {keyword.derived.map((derived) => (
                    <Badge variant="outline" key={derived}>
                      <X />
                      {derived}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("edit", keyword);
                  }}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("delete", keyword);
                  }}
                >
                  <TrashIcon />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#">69</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

export default KeywordsTable;
