"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { Proxy } from "@/lib/generated/prisma";
import { SettingCard } from "@/components/common";
import EditProxySettingDialog from "./ProxySettingDialog";
import Proxies from "./Proxies";

interface Props {
  proxies: Proxy[];
}

const ProxySettingCard = ({ proxies }: Props) => {
  return (
    <SettingCard
      title="Manage Proxy Settings"
      description="You can manage proxy settings here."
      count={proxies.length}
      countLabel="proxies"
    >
      <div className="space-y-4">
        <div className="flex justify-end">
          <EditProxySettingDialog
            triggerButton={
              <Button>
                <PlusIcon className="size-4" />
                Add Proxy Setting
              </Button>
            }
          />
        </div>
        <Proxies proxies={proxies} />
      </div>
    </SettingCard>
  );
};

export default ProxySettingCard;
