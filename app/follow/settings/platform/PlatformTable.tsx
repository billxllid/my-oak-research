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
import { Earth, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";

const PlatformTable = () => {
  enum NetworkEnvironment {
    Web = "Web",
    Client = "Client",
    Darknet = "Darknet",
  }

  const networkEnvironment: {
    [key in NetworkEnvironment]: {
      label: string;
      value: NetworkEnvironment;
      icon: React.ReactNode;
    };
  } = {
    Web: {
      label: "Web",
      value: NetworkEnvironment.Web,
      icon: <Earth size={16} />,
    },
    Client: {
      label: "Client",
      value: NetworkEnvironment.Client,
      icon: <Bot size={16} />,
    },
    Darknet: {
      label: "Darknet",
      value: NetworkEnvironment.Darknet,
      icon: <Bot size={16} />,
    },
  };

  const platforms: {
    id: string;
    name: string;
    desc: string;
    networkEnvironment: {
      label: string;
      value: NetworkEnvironment;
      icon: React.ReactNode;
    };
  }[] = [
    {
      id: "1",
      name: "Platform 1",
      desc: "description for category 1",
      networkEnvironment: networkEnvironment.Web,
    },
    {
      id: "2",
      name: "Category 2",
      desc: "description for category 2",
      networkEnvironment: networkEnvironment.Client,
    },
    {
      id: "3",
      name: "Category 3",
      desc: "description for category 3",
      networkEnvironment: networkEnvironment.Darknet,
    },
    {
      id: "4",
      name: "Category 4",
      desc: "description for category 4",
      networkEnvironment: networkEnvironment.Web,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button>
          <PlusIcon />
          Add Platform
        </Button>
        <Input placeholder="Search Keyword" className="w-64" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Network Environment</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {platforms.map((platform) => (
            <TableRow key={platform.id}>
              <TableCell>{platform.id}</TableCell>
              <TableCell>{platform.name}</TableCell>
              <TableCell>{platform.desc}</TableCell>
              <TableCell>
                <div className="flex gap-1 items-center">
                  {platform.networkEnvironment.icon}
                  {platform.networkEnvironment.label}
                </div>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("edit", platform);
                  }}
                >
                  <PencilIcon />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    console.log("delete", platform);
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

export default PlatformTable;
