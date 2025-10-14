"use client";

import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Source, DarknetSourceConfig, Proxy } from "@/lib/generated/prisma";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import SourceDeleteAlert from "./SourceDeleteAlert";
import DarknetSourceDialog from "./DarknetSourceDialog";

interface Props {
  sources: (Source & { darknet: DarknetSourceConfig & { proxy: Proxy } })[];
  proxies: Proxy[];
}

type DarknetSource = Source & {
  darknet: DarknetSourceConfig & { proxy: Proxy };
};

const DarknetSources = ({ sources, proxies }: Props) => {
  // 定义表格列配置
  const columns: DataTableColumn<DarknetSource>[] = [
    {
      key: "name",
      label: "Name",
      render: (source) => source.name,
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-xs",
      render: (source) => (
        <div className="whitespace-normal">{source.description}</div>
      ),
    },
    {
      key: "domain",
      label: "Domain",
      className: "max-w-xs",
      render: (source) => (
        <span className="text-sm break-all whitespace-normal">
          {source.darknet.url}
        </span>
      ),
    },
    {
      key: "proxy",
      label: "Proxy",
      render: (source) =>
        source.darknet.proxyId ? source.darknet.proxy.name : "None",
    },
  ];

  // 定义操作配置
  const actions: DataTableAction<DarknetSource>[] = [
    {
      type: "edit",
      render: (source) => (
        <DarknetSourceDialog
          proxies={proxies}
          source={source}
          triggerButton={
            <Button size="sm" variant="outline">
              <PencilIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
    {
      type: "delete",
      render: (source) => (
        <SourceDeleteAlert
          source={source}
          queryKeyType="DARKNET"
          triggerButton={
            <Button size="sm" variant="outline">
              <TrashIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
  ];

  return (
    <DataTable
      data={sources}
      columns={columns}
      actions={actions}
      emptyMessage="No darknet sources found. Add your first darknet source to get started."
    />
  );
};

export default DarknetSources;
