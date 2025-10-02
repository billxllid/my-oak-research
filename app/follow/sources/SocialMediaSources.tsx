import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import { SocialConfigByPlatform } from "@/app/api/_utils/zod";
import { SocialMediaSourceConfig, Source } from "@/lib/generated/prisma";
import { z } from "zod";
import { Proxy } from "@/lib/generated/prisma";
import SourceDeleteAlert from "./SourceDeleteAlert";
import { PencilIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SocialMediaSources = ({ sources, proxies }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Proxy</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sources.map((source, index) => (
          <TableRow key={index}>
            <TableCell>{index + 1}</TableCell>
            <TableCell>{source.name}</TableCell>
            <TableCell>{source.description}</TableCell>
            <TableCell>{source.social.platform}</TableCell>
            <TableCell>{source.proxy?.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <SocialMediaSourceDialog
                  proxies={proxies}
                  source={
                    source as Source & {
                      social: z.infer<typeof SocialConfigByPlatform>;
                    } & { proxy: Proxy }
                  }
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
  );
};

export default SocialMediaSources;
