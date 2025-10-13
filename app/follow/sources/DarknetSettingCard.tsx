"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Source, DarknetSourceConfig, Proxy } from "@/lib/generated/prisma";
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
      <Card>
        <CardHeader>
          <CardTitle>Manage Darknet Sources</CardTitle>
          <CardDescription>
            Error loading darknet sources. Please try again.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Darknet Sources</CardTitle>
        <CardDescription>
          You can manage information sources from the darknet here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search darknet sources..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <DarknetSourceDialog
            proxies={proxies}
            triggerButton={
              <Button>
                <PlusIcon />
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
          <DarknetSources
            sources={
              sources?.filter(
                (
                  s: Source & {
                    darknet: DarknetSourceConfig & { proxy: Proxy };
                  }
                ) => s.type === "DARKNET" && s.darknet
              ) || []
            }
            proxies={proxies}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default DarknetSettingCard;
