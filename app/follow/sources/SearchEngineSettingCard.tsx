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
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  proxies: Proxy[];
  initialSources?: (Source & { search: SearchEngineSourceConfig } & {
    proxy: Proxy;
  })[];
}

type SearchEngineSource = Source & { search: SearchEngineSourceConfig } & {
  proxy: Proxy;
};

// Fetcher function for sources
async function fetchSources() {
  const response = await fetch("/api/follow/sources?type=SEARCH_ENGINE");
  if (!response.ok) {
    throw new Error("Failed to fetch sources");
  }
  const data = await response.json();
  // Ensure we always return an array, never undefined
  return Array.isArray(data?.items) ? data.items : [];
}

const SearchEngineSettingCard = ({ proxies, initialSources }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch sources data
  const {
    data: sources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sources", "SEARCH_ENGINE"],
    queryFn: fetchSources,
    initialData: initialSources,
  });

  if (error) {
    return (
      <SettingCard
        title="Manage Search Engines"
        description="Error loading search engines. Please try again."
        count={0}
        countLabel="search engines"
      />
    );
  }

  const typeFilteredSources =
    sources?.filter(
      (s: Source & { search: SearchEngineSourceConfig } & { proxy: Proxy }) =>
        s.type === "SEARCH_ENGINE" && s.search
    ) || [];

  // 应用搜索筛选
  const filteredSources = typeFilteredSources.filter(
    (
      source: Source & { search: SearchEngineSourceConfig } & { proxy: Proxy }
    ) =>
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
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <DataTable
          data={filteredSources}
          columns={columns}
          actions={actions}
          emptyMessage="No search engines found. Add your first search engine to get started."
        />
      )}
    </SettingCard>
  );
};

export default SearchEngineSettingCard;
