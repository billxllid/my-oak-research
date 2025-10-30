"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import SourceDialog from "./SourceDialog";
import SourceDeleteAlert from "./SourceDeleteAlert";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

type WebSiteSource = Source & { web: WebSourceConfig } & { proxy: Proxy };

const WebSites = ({ sources, proxies }: Props) => {
  const [editingSource, setEditingSource] = useState<WebSiteSource | undefined>();

  const handleEdit = (source: WebSiteSource) => {
    setEditingSource(source);
  };

  const handleCloseDialog = () => {
    setEditingSource(undefined);
  };

  const columns: DataTableColumn<WebSiteSource>[] = [
    {
      key: "name",
      label: "Name",
      render: (source) => source.name,
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-[200px]",
      render: (source) => <div className="truncate">{source.description}</div>,
    },
    {
      key: "url",
      label: "URL",
      render: (source) => source.web?.url || "-",
    },
    {
      key: "proxy",
      label: "Proxy",
      render: (source) => source.proxy?.name || "None",
    },
  ];

  const actions: DataTableAction<WebSiteSource>[] = [
    {
      type: "edit",
      render: (source) => (
        <Button size="sm" variant="outline" onClick={() => handleEdit(source)}>
          <PencilIcon className="size-3" />
        </Button>
      ),
    },
    {
      type: "delete",
      render: (source) => (
        <SourceDeleteAlert
          source={source}
          queryKeyType="WEB"
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
    <>
      <SourceDialog
        sourceType="WEB"
        source={editingSource}
        proxies={proxies}
        open={!!editingSource}
        onOpenChange={(open) => !open && handleCloseDialog()}
      />
      <DataTable
        data={sources}
        columns={columns}
        actions={actions}
        emptyMessage="No website sources found. Add your first website source to get started."
      />
    </>
  );
};

export default WebSites;
