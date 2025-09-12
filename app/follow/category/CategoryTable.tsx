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
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";

const CategoryTable = () => {
  const categories: {
    id: string;
    name: string;
    count: number;
    desc: string;
  }[] = [
    {
      id: "1",
      name: "Category 1",
      count: 10,
      desc: "description for category 1",
    },
    {
      id: "2",
      name: "Category 2",
      count: 20,
      desc: "description for category 2",
    },
    {
      id: "3",
      name: "Category 3",
      count: 30,
      desc: "description for category 3",
    },
    {
      id: "4",
      name: "Category 4",
      count: 40,
      desc: "description for category 4",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button>
          <PlusIcon />
          Add Category
        </Button>
        <Input placeholder="Search Keyword" className="w-64" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Count</TableHead>
            <TableHead>Desc</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.id}</TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.count}</TableCell>
              <TableCell>{data.desc}</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("edit", data);
                  }}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("delete", data);
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

export default CategoryTable;
