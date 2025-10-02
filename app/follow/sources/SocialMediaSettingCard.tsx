import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Source, SocialMediaSourceConfig, Proxy } from "@/lib/generated/prisma";
import SocialMediaSourceDialog from "./SocialMediaSourceDialog";
import SocialMediaSources from "./SocialMediaSources";

interface Props {
  sources: (Source & { social: SocialMediaSourceConfig } & { proxy: Proxy })[];
  proxies: Proxy[];
}

const SocialMediaSetting = ({ sources, proxies }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Social Media</CardTitle>
        <CardDescription>
          You can manage information sources from the social media here.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search social media..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <SocialMediaSourceDialog
            proxies={proxies}
            triggerButton={
              <Button>
                <PlusIcon />
                Add Social Media
              </Button>
            }
          />
        </div>
        <SocialMediaSources sources={sources} proxies={proxies} />
      </CardContent>
    </Card>
  );
};

export default SocialMediaSetting;
