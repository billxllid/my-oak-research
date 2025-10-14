"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Source, DarknetSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import DarknetSources from "./DarknetSources";
import DarknetSourceDialog from "./DarknetSourceDialog";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  proxies: Proxy[];
  initialSources?: (Source & {
    darknet: DarknetSourceConfig & { proxy: Proxy };
  })[];
}

// Fetcher function for sources
async function fetchSources() {
  const response = await fetch("/api/follow/sources?type=DARKNET");
  if (!response.ok) {
    throw new Error("Failed to fetch sources");
  }
  const data = await response.json();
  return data.items;
}

const DarknetSettingCard = ({ proxies, initialSources }: Props) => {
  // Use React Query to fetch sources data
  const {
    data: sources,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["sources", "DARKNET"],
    queryFn: fetchSources,
    initialData: initialSources,
  });

  if (error) {
    return (
      <SettingCard
        title="Manage Darknet Sources"
        description="Error loading darknet sources. Please try again."
        count={0}
        countLabel="sources"
      />
    );
  }

  const filteredSources =
    sources?.filter(
      (s: Source & { darknet: DarknetSourceConfig & { proxy: Proxy } }) =>
        s.type === "DARKNET" && s.darknet
    ) || [];

  return (
    <SettingCard
      title="Manage Darknet Sources"
      description="You can manage information sources from the darknet here."
      count={filteredSources.length}
      countLabel="sources"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <DarknetSourceDialog
            proxies={proxies}
            triggerButton={
              <Button>
                <PlusIcon className="size-4" />
                Add Darknet Source
              </Button>
            }
          />
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <DarknetSources sources={filteredSources} proxies={proxies} />
        )}
      </div>
    </SettingCard>
  );
};

export default DarknetSettingCard;
