import { Button } from "@/components/ui/button";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import SourceDeleteAlert from "./SourceDeleteAlert";
import { PencilIcon } from "lucide-react";
import { TrashIcon } from "lucide-react";
import { Source } from "@/lib/generated/prisma";
import { DarknetSourceConfig } from "@/lib/generated/prisma";
import { Proxy } from "@/lib/generated/prisma";
import DarknetSourceDialog from "./DarknetSourceDialog";

interface Props {
  sources: (Source & { darknet: DarknetSourceConfig & { proxy: Proxy } })[];
  proxies: Proxy[];
}

const DarknetSources = ({ sources, proxies }: Props) => {
  return (
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
                  queryKeyType="DARKNET"
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

export default DarknetSources;
