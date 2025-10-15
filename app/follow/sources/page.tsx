"use client";

import React, { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WebSiteSettingCard from "./WebSiteSettingCard";
import SocialMediaSettingCard from "./SocialMediaSettingCard";
import DarknetSettingCard from "./DarknetSettingCard";
import SearchEngineSettingCard from "./SearchEngineSettingCard";
import ProxySettingCard from "./ProxySettingCard";
import { Proxy } from "@/lib/generated/prisma";
import { useQuery } from "@tanstack/react-query";

// Fetcher function for proxies
async function fetchProxies() {
  const response = await fetch("/api/follow/proxy");
  if (!response.ok) {
    throw new Error("Failed to fetch proxies");
  }
  const data = await response.json();
  // Ensure we always return an array, never undefined
  return Array.isArray(data?.items) ? data.items : [];
}

const Sources = () => {
  const { data: proxies = [] } = useQuery({
    queryKey: ["proxies"],
    queryFn: fetchProxies,
  });

  return (
    <div>
      <Tabs defaultValue="web-sites" className="space-y-2">
        <TabsList>
          <TabsTrigger value="web-sites">Web Sites</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="darknet">Darknet</TabsTrigger>
          <TabsTrigger value="search-engines">Search Engines</TabsTrigger>
          <TabsTrigger value="proxy">Proxy</TabsTrigger>
        </TabsList>
        <TabsContent value="web-sites">
          <WebSiteSettingCard proxies={proxies} />
        </TabsContent>
        <TabsContent value="social-media">
          <SocialMediaSettingCard proxies={proxies} />
        </TabsContent>
        <TabsContent value="darknet">
          <DarknetSettingCard proxies={proxies} />
        </TabsContent>
        <TabsContent value="search-engines">
          <SearchEngineSettingCard proxies={proxies} />
        </TabsContent>
        <TabsContent value="proxy">
          <ProxySettingCard proxies={proxies} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sources;
