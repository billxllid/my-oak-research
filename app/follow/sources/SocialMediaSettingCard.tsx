"use client";

import React, { useState } from "react";
import { PlusIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Source, SocialMediaSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import SocialMediaSources from "./SocialMediaSources";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  proxies: Proxy[];
  initialSources?: (Source & { social: SocialMediaSourceConfig } & {
    proxy: Proxy;
  })[];
}

// Fetcher function for sources
async function fetchSources() {
  const response = await fetch("/api/follow/sources?type=SOCIAL_MEDIA");
  if (!response.ok) {
    throw new Error("Failed to fetch sources");
  }
  const data = await response.json();
  // Ensure we always return an array, never undefined
  return Array.isArray(data?.items) ? data.items : [];
}

const SocialMediaSettingCard = ({ proxies, initialSources }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Use React Query to fetch sources data
  const {
    data: sources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sources", "SOCIAL_MEDIA"],
    queryFn: fetchSources,
    initialData: initialSources,
  });

  if (error) {
    return (
      <SettingCard
        title="Manage Social Media"
        description="Error loading social media sources. Please try again."
        count={0}
        countLabel="social media"
      />
    );
  }

  const typeFilteredSources =
    sources?.filter(
      (s: Source & { social: SocialMediaSourceConfig } & { proxy: Proxy }) =>
        s.type === "SOCIAL_MEDIA" && s.social
    ) || [];

  // 应用搜索筛选
  const filteredSources = typeFilteredSources.filter(
    (source: Source & { social: SocialMediaSourceConfig } & { proxy: Proxy }) =>
      source.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      source.social?.platform?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 筛选组件
  const filterComponent = (
    <div className="flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search social media..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>
      <SocialMediaSourceDialog
        proxies={proxies}
        triggerButton={
          <Button>
            <PlusIcon className="size-4" />
            Add Social Media
          </Button>
        }
      />
    </div>
  );

  return (
    <SettingCard
      title="Manage Social Media"
      description="You can manage information sources from the social media here."
      count={filteredSources.length}
      countLabel="social media"
      filterComponent={filterComponent}
    >
      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      ) : (
        <SocialMediaSources sources={filteredSources} proxies={proxies} />
      )}
    </SettingCard>
  );
};

export default SocialMediaSettingCard;
