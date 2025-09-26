"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import EditWebSiteDialog from "./WebSiteDialog";
import { networkEnvironments } from "./ProxySettingCard";
import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
          <EditWebSiteDialog
            networkEnvironments={networkEnvironments}
            triggerButton={
              <Button>
                <PlusIcon />
                Add Web Site
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
                    <EditWebSiteDialog
                      networkEnvironments={networkEnvironments}
                      triggerButton={
                        <Button size="sm" variant="outline">
                          <PencilIcon className="size-3" />
                        </Button>
                      }
                      source={source}
                    />
                    <DeleteWebSiteDialog
                      webSite={source}
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

const DeleteWebSiteDialog = ({
  webSite,
  triggerButton,
}: {
  webSite: Source & { web: WebSourceConfig } & { proxy: Proxy };
  triggerButton: React.ReactNode;
}) => {
  const router = useRouter();
  const handleDelete = async (
    webSite: Source & { web: WebSourceConfig } & { proxy: Proxy }
  ) => {
    await fetch(`/api/follow/sources/${webSite.id}`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          toast.success("Web site deleted successfully");
          setTimeout(() => {
            router.refresh();
          }, 200);
        }
      })
      .catch((err) => {
        toast.error("Failed to delete web site");
        console.error(err);
      });
  };
  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Web Site"
      description="Are you sure you want to delete this web site?"
      onDelete={() => handleDelete(webSite)}
    />
  );
};

export default WebSiteSettingCard;
