"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import WebSiteSourceDialog from "./WebSiteSourceDialog";
import WebSites from "./WebSiteSources";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  proxies: Proxy[];
  initialSources?: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
}

// Fetcher function for sources
async function fetchSources() {
  const response = await fetch("/api/follow/sources?type=WEB");
  if (!response.ok) {
    throw new Error("Failed to fetch sources");
  }
  const data = await response.json();
  // Ensure we always return an array, never undefined
  return Array.isArray(data?.items) ? data.items : [];
}

const WebSiteSettingCard = ({ proxies, initialSources }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch sources data
  const {
    data: sources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sources", "WEB"],
    queryFn: fetchSources,
    initialData: initialSources,
  });

  if (error) {
    return (
      <SettingCard
        title="Manage Web Sites"
        description="Error loading web sites. Please try again."
        count={0}
        countLabel="websites"
      />
    );
  }

  const typeFilteredSources =
    sources?.filter(
      (s: Source & { web: WebSourceConfig } & { proxy: Proxy }) =>
        s.type === "WEB" && s.web
    ) || [];

  // 应用搜索筛选
  const filteredSources = typeFilteredSources.filter(
    (source: Source & { web: WebSourceConfig } & { proxy: Proxy }) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.web?.url?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 筛选组件
  const filterComponent = (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search web sites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <WebSiteSourceDialog
        proxies={proxies}
        triggerButton={
          <Button>
            <PlusIcon className="size-4" />
            Add Web Site
          </Button>
        }
      />
    </div>
  );

  return (
    <SettingCard
      title="Manage Web Sites"
      description="You can manage information sources from the web site here."
      count={filteredSources.length}
      countLabel="websites"
      filterComponent={filterComponent}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <WebSites sources={filteredSources} proxies={proxies} />
      )}
    </SettingCard>
  );
};

export default WebSiteSettingCard;
