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
import { Button } from "@/components/ui/button";
import { Search, PlusIcon } from "lucide-react";
import { Source, WebSourceConfig, Proxy } from "@/lib/generated/prisma";
import EditWebSiteDialog from "./WebSiteDialog";
import WebSites from "./WebSites";

interface Props {
  sources: (Source & { web: WebSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const WebSiteSetting = ({ sources, proxies }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Web Sites</CardTitle>
        <CardDescription>
          You can manage information sources from the web site here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search web sites..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <EditWebSiteDialog
            proxies={proxies}
            triggerButton={
              <Button>
                <PlusIcon />
                Add Web Site
              </Button>
            }
          />
        </div>
        <WebSites sources={sources} proxies={proxies} />
      </CardContent>
    </Card>
  );
};

export default WebSiteSetting;
