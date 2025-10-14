"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlusIcon } from "lucide-react";
import { Source, Proxy } from "@/lib/generated/prisma";
import { SearchEngineSourceConfig } from "@/lib/generated/prisma";
import {
  SettingCard,
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import SearchEngineSourceDialog from "./SearchEngineSourceDialog";
import SourceDeleteAlert from "./SourceDeleteAlert";

interface Props {
  sources: (Source & { search: SearchEngineSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

type SearchEngineSource = Source & { search: SearchEngineSourceConfig } & {
  proxy: Proxy;
};

const SearchEngineSettingCard = ({ sources, proxies }: Props) => {
  // 定义表格列配置
  const columns: DataTableColumn<SearchEngineSource>[] = [
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
      key: "query",
      label: "Query",
      className: "max-w-xs",
      render: (source) => (
        <span className="text-sm break-all whitespace-normal">
          {source.search.query}
        </span>
      ),
    },
    {
      key: "proxy",
      label: "Proxy",
      render: (source) => source.proxy?.name || "None",
    },
  ];

  // 定义操作配置
  const actions: DataTableAction<SearchEngineSource>[] = [
    {
      type: "edit",
      render: (source) => (
        <SearchEngineSourceDialog
          triggerButton={
            <Button size="sm" variant="outline">
              <PencilIcon className="size-3" />
            </Button>
          }
          proxies={proxies}
          source={source}
        />
      ),
    },
    {
      type: "delete",
      render: (source) => (
        <SourceDeleteAlert
          source={source}
          queryKeyType="SEARCH_ENGINE"
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
    <SettingCard
      title="Manage Search Engines"
      description="You can manage search engines here."
      count={sources.length}
      countLabel="search engines"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <SearchEngineSourceDialog
            triggerButton={
              <Button>
                <PlusIcon className="size-4" />
                Add Search Engine
              </Button>
            }
            proxies={proxies}
          />
        </div>
        <DataTable
          data={sources}
          columns={columns}
          actions={actions}
          emptyMessage="No search engines found. Add your first search engine to get started."
        />
      </div>
    </SettingCard>
  );
};

export default SearchEngineSettingCard;
