"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import WebSiteSourceDialog from "./WebSiteSourceDialog";
import WebSites from "./WebSiteSources";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const WebSiteSettingCard = ({ sources, proxies }: Props) => {
  const [searchQuery, setSearchQuery] = useState("");

  // 筛选数据
  const filteredSources = sources.filter(
    (source) =>
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
      <WebSites sources={filteredSources} proxies={proxies} />
    </SettingCard>
  );
};

export default WebSiteSettingCard;
