import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import EditWebSiteDialog from "./WebSiteSourceDialog";
import SourceDeleteAlert from "./SourceDeleteAlert";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const WebSites = ({ sources, proxies }: Props) => {
  return (
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
            <TableCell className="max-w-[200px] truncate">
              {source.description}
            </TableCell>
            <TableCell>{source.web?.url}</TableCell>
            <TableCell>{source.proxy?.name}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <EditWebSiteDialog
                  triggerButton={
                    <Button size="sm" variant="outline">
                      <PencilIcon className="size-3" />
                    </Button>
                  }
                  source={source}
                  proxies={proxies}
                />
                <SourceDeleteAlert
                  source={source}
                  queryKeyType="WEB"
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

export default WebSites;
