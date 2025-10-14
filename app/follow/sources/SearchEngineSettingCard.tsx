"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PencilIcon, TrashIcon, PlusIcon, Search } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");

  // 筛选数据
  const filteredSources = sources.filter(
    (source) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.search?.query?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  // 筛选组件
  const filterComponent = (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search search engines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
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
  );

  return (
    <SettingCard
      title="Manage Search Engines"
      description="You can manage search engines here."
      count={filteredSources.length}
      countLabel="search engines"
      filterComponent={filterComponent}
    >
      <DataTable
        data={filteredSources}
        columns={columns}
        actions={actions}
        emptyMessage="No search engines found. Add your first search engine to get started."
      />
    </SettingCard>
  );
};

export default SearchEngineSettingCard;
