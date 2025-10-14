"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import WebSiteSourceDialog from "./WebSiteSourceDialog";
import WebSites from "./WebSiteSources";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const WebSiteSettingCard = ({ sources, proxies }: Props) => {
  return (
    <SettingCard
      title="Manage Web Sites"
      description="You can manage information sources from the web site here."
      count={sources.length}
      countLabel="websites"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
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
        <WebSites sources={sources} proxies={proxies} />
      </div>
    </SettingCard>
  );
};

export default WebSiteSettingCard;
