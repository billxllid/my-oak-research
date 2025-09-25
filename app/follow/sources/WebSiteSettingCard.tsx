"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, Search, PlusIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { NetworkEnvironment, networkEnvironments } from "./ProxySettingCard";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { WebSourceCreateSchema } from "@/app/api/_utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import ErrorMessage from "@/components/ErrorMessage";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
}

const WebSiteSettingCard = ({ sources }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Web Sites</CardTitle>
        <CardDescription>
          You can manage information sources from the web site here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search web sites..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <AddWebSiteDialog networkEnvironments={networkEnvironments} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Proxy</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source, index) => (
              <TableRow key={source.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{source.name}</TableCell>
                <TableCell>{source.description}</TableCell>
                <TableCell>{source.web?.url}</TableCell>
                <TableCell>{source.proxy?.name}</TableCell>
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

const AddWebSiteDialog = ({
  networkEnvironments,
}: {
  networkEnvironments: NetworkEnvironment[];
}) => {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(WebSourceCreateSchema),
    defaultValues: {
      type: "WEB",
      active: true,
      description: "",
      rateLimit: 10,
      web: {
        url: "",
        headers: {},
        crawlerEngine: "FETCH",
      },
      proxyId: "",
    },
  });

  const onSubmit = (data: z.infer<typeof WebSourceCreateSchema>) => {
    console.log(data);
  };

  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title="Add Web Site"
      description="Add a new web site to your list."
      triggerButton={
        <Button>
          <PlusIcon />
          Add Web Site
        </Button>
      }
      buttonText="Add"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            placeholder="Description"
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="web.url">URL</Label>
          <Input
            id="web.url"
            placeholder="https://www.example.com"
            {...register("web.url")}
          />
          <ErrorMessage>{errors.web?.url?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="proxyId">Proxy</Label>
          <Select defaultValue="none">
            <SelectTrigger>
              <SelectValue placeholder="Select a proxy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {networkEnvironments.map(
                (networkEnvironment: NetworkEnvironment) => (
                  <SelectItem
                    key={networkEnvironment.id}
                    value={networkEnvironment.id}
                  >
                    {networkEnvironment.label}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
          <ErrorMessage>{errors.proxyId?.message}</ErrorMessage>
        </div>
      </div>
    </SettingEditDialog>
  );
};

export default WebSiteSettingCard;
