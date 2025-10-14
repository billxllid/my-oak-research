"use client";

import React, { useState } from "react";
import { PlusIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Source, SocialMediaSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import SocialMediaSources from "./SocialMediaSources";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SocialMediaSettingCard = ({ sources, proxies }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // 筛选数据
  const filteredSources = sources.filter(
    (source) =>
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
      <SocialMediaSources sources={filteredSources} proxies={proxies} />
    </SettingCard>
  );
};

export default SocialMediaSettingCard;
