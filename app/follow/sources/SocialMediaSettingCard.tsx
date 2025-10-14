"use client";

import React from "react";
import { PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Source, SocialMediaSourceConfig, Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import SocialMediaSources from "./SocialMediaSources";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SocialMediaSettingCard = ({ sources, proxies }: Props) => {
  return (
    <SettingCard
      title="Manage Social Media"
      description="You can manage information sources from the social media here."
      count={sources.length}
      countLabel="social media"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
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
        <SocialMediaSources sources={sources} proxies={proxies} />
      </div>
    </SettingCard>
  );
};

export default SocialMediaSettingCard;
