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
import { Search } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Source, DarknetSourceConfig, Proxy } from "@/lib/generated/prisma";
import { DarknetSourceCreateSchema } from "@/app/api/_utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import SelectProxy from "./SelectProxy";
import { SettingEditDialog } from "@/components/SettingEditDialog";
import ErrorMessage from "@/components/ErrorMessage";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import SourceDeleteAlert from "./SourceDeleteAlert";

interface Props {
  sources: (Source & { darknet: DarknetSourceConfig & { proxy: Proxy } })[];
  proxies: Proxy[];
}

const DarknetSettingCard = ({ sources, proxies }: Props) => {
  // const darknetSources: DarknetSource[] = [
  //   {
  //     id: "1",
  //     label: "Ahmia Search Engine",
  //     desc: "Ahmia is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
  //     url: "http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/",
  //   },
  //   {
  //     id: "2",
  //     label: "Darknet Search Engine",
  //     desc: "Darknet Search Engine is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
  //     url: "http://darknetsearchengine.onion/",
  //   },
  // ];
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Darknet Sources</CardTitle>
        <CardDescription>
          You can manage information sources from the darknet here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search darknet sources..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <DarknetSourceDialog
            proxies={proxies}
            triggerButton={
              <Button>
                <PlusIcon />
                Add Darknet Source
              </Button>
            }
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Proxy</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map((source, index) => (
              <TableRow key={source.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{source.name}</TableCell>
                <TableCell className="max-w-xs whitespace-normal">
                  {source.description}
                </TableCell>
                <TableCell className="max-w-xs break-all whitespace-normal">
                  <span className="text-sm">{source.darknet.url}</span>
                </TableCell>
                <TableCell>
                  {source.darknet.proxyId ? source.darknet.proxy.name : "None"}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <DarknetSourceDialog
                      proxies={proxies}
                      source={source}
                      triggerButton={
                        <Button size="sm" variant="outline">
                          <PencilIcon className="size-3" />
                        </Button>
                      }
                    />
                    <SourceDeleteAlert
                      source={source}
                      triggerButton={
                        <Button size="sm" variant="outline">
                          <TrashIcon className="size-3" />
                        </Button>
                      }
                    />
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

const DarknetSourceDialog = ({
  proxies,
  source,
  triggerButton,
}: {
  proxies: Proxy[];
  source?: Source & { darknet: DarknetSourceConfig & { proxy: Proxy } };
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(DarknetSourceCreateSchema),
    defaultValues: {
      name: source?.name || "",
      description: source?.description || "",
      type: "DARKNET",
      active: source?.active || true,
      rateLimit: source?.rateLimit || 10,
      darknet: {
        url: source?.darknet?.url || "",
        proxyId: source?.darknet?.proxyId || "",
      },
    },
  });
  const onSubmit = async (data: z.infer<typeof DarknetSourceCreateSchema>) => {
    console.log(data);
    const endpoint = source
      ? `/api/follow/sources/${source.id}`
      : "/api/follow/sources";
    const method = source ? "PATCH" : "POST";
    const body = JSON.stringify(data);
    await fetch(endpoint, { method, body })
      .then((res) => {
        if (res.ok) {
          toast.success(
            source
              ? "Darknet source updated successfully"
              : "Darknet source added successfully"
          );
          setOpen(false);
          setTimeout(() => {
            router.refresh();
          }, 200);
        } else {
          toast.error(
            source
              ? "Failed to update darknet source"
              : "Failed to add darknet source"
          );
        }
      })
      .catch((err) => {
        toast.error(
          source
            ? "Failed to update darknet source"
            : "Failed to add darknet source"
        );
      });
  };
  return (
    <SettingEditDialog
      props={{ open, onOpenChange: setOpen }}
      title={source ? "Edit Darknet Source" : "Add Darknet Source"}
      description={
        source
          ? "Edit a darknet source"
          : "Add a new darknet source to your list."
      }
      triggerButton={triggerButton}
      buttonText={source ? "Update" : "Add"}
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="grid gap-4">
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>
          <Input id="name" placeholder="Name" required {...register("name")} />
          <ErrorMessage>{errors.name?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Description"
            required
            rows={3}
            {...register("description")}
          />
          <ErrorMessage>{errors.description?.message}</ErrorMessage>
        </div>
        <div className="grid gap-3">
          <Label htmlFor="darknet.url">Domain</Label>
          <Input
            id="darknet.url"
            placeholder="https://xxxxxxxxxxxxxxxx.onion"
            required
            {...register("darknet.url")}
          />
          <ErrorMessage>{errors.darknet?.url?.message}</ErrorMessage>
        </div>
        <SelectProxy
          control={control}
          proxies={proxies}
          name="darknet.proxyId"
          error={errors.darknet?.proxyId?.message}
          required={true}
        />
      </div>
    </SettingEditDialog>
  );
};

export default DarknetSettingCard;
