"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon, PencilIcon, TrashIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "@/components/ui/pagination";
import { Switch } from "@/components/ui/switch";

const ProxySettingTable = () => {
  const proxySettings: {
    id: string;
    isEnabled: boolean;
    name: string;
    protocol: string;
    endpoint: string;
    region: string;
    usage: string;
    desc: string;
  }[] = [
    {
      id: "1",
      isEnabled: true,
      name: "Proxy Setting 1",
      protocol: "http",
      endpoint: "127.0.0.1:8080",
      region: "us",
      usage: "10",
      desc: "description",
    },
    {
      id: "2",
      isEnabled: false,
      name: "Proxy Setting 2",
      protocol: "https",
      endpoint: "127.0.0.1:8081",
      region: "eu",
      usage: "20",
      desc: "description",
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <Button>
          <PlusIcon />
          Add Proxy Setting
        </Button>
        <Input placeholder="Search Proxy Setting" className="w-64" />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>IsEnabled</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Usage</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {proxySettings.map((data) => (
            <TableRow key={data.id}>
              <TableCell>{data.id}</TableCell>
              <TableCell>
                <Switch checked={data.isEnabled} />
              </TableCell>
              <TableCell>{data.name}</TableCell>
              <TableCell>{data.protocol}</TableCell>
              <TableCell>{data.endpoint}</TableCell>
              <TableCell>{data.region}</TableCell>
              <TableCell>{data.usage}</TableCell>
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

export default ProxySettingTable;
