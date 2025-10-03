import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import WebSiteSettingCard from "./WebSiteSettingCard";
import SocialMediaSettingCard from "./SocialMediaSettingCard";
import DarknetSettingCardCard from "./DarknetSettingCard";
import SearchEngineSettingCard from "./SearchEngineSettingCard";
import ProxySettingCard from "./ProxySettingCard";
import prisma from "@/lib/prisma";
import {
  Source,
  WebSourceConfig,
  SocialMediaSourceConfig,
  Proxy,
} from "@/lib/generated/prisma";
import {
  DarknetSourceConfig,
  SearchEngineSourceConfig,
} from "@/lib/generated/prisma";

const Sources = async () => {
  const sources = await prisma.source.findMany({
    include: {
      web: true,
      social: true,
      darknet: { include: { proxy: true } },
      search: true,
      proxy: true,
      credential: true,
    },
  });
  const webSites = sources.filter(
    (source) => source.type === "WEB"
  ) as (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  const socialMedia = sources.filter(
    (source) => source.type === "SOCIAL_MEDIA"
  ) as (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  const darknet = sources.filter(
    (source) => source.type === "DARKNET"
  ) as (Source & { darknet: DarknetSourceConfig & { proxy: Proxy } })[];
  const searchEngines = sources.filter(
    (source) => source.type === "SEARCH_ENGINE"
  ) as (Source & { search: SearchEngineSourceConfig } & { proxy: Proxy })[];
  const proxies = await prisma.proxy.findMany();
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
          <WebSiteSettingCard sources={webSites} proxies={proxies} />
        </TabsContent>
        <TabsContent value="social-media">
          <SocialMediaSettingCard sources={socialMedia} proxies={proxies} />
        </TabsContent>
        <TabsContent value="darknet">
          <DarknetSettingCardCard sources={darknet} proxies={proxies} />
        </TabsContent>
        <TabsContent value="search-engines">
          <SearchEngineSettingCard sources={searchEngines} proxies={proxies} />
        </TabsContent>
        <TabsContent value="proxy">
          <ProxySettingCard proxies={proxies} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sources;
