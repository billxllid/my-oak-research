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
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Source, SocialMediaSourceConfig, Proxy } from "@/lib/generated/prisma";
import EditSocialMediaDialog from "./SocialMediaDialog";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SocialMediaSettingCard = ({ sources, proxies }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Social Media</CardTitle>
        <CardDescription>
          You can manage information sources from the social media here.
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
          <EditSocialMediaDialog proxies={proxies} />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sources.map(
              (
                socialMedia: Source & { social: SocialMediaSourceConfig } & {
                  proxy: Proxy;
                },
                index: number
              ) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{socialMedia.name}</TableCell>
                  <TableCell>{socialMedia.description}</TableCell>
                  <TableCell>{socialMedia.social.platform}</TableCell>
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
              )
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSettingCard;
