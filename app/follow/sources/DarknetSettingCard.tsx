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

interface Props {
  sources: (Source & { darknet: DarknetSourceConfig & { proxy: Proxy } })[];
  proxies: Proxy[];
}

const DarknetSettingCard = ({ sources, proxies }: Props) => {
  // const darknetSources: DarknetSource[] = [
  //   {
  //     id: "1",
  //     label: "Ahmia Search Engine",
  //     desc: "Ahmia is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
  //     url: "http://juhanurmihxlp77nkq76byazcldy2hlmovfu2epvl5ankdibsot4csyd.onion/",
  //   },
  //   {
  //     id: "2",
  //     label: "Darknet Search Engine",
  //     desc: "Darknet Search Engine is a popular dark web search engine that indexes .onion websites, making them accessible through the Tor network.",
  //     url: "http://darknetsearchengine.onion/",
  //   },
  // ];
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
        <DarknetSources sources={sources} proxies={proxies} />
      </CardContent>
    </Card>
  );
};

export default DarknetSettingCard;
