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
import { Proxy } from "@/lib/generated/prisma";
import EditProxySettingDialog from "./ProxySettingDialog";
import Proxies from "./Proxies";

interface Props {
  proxies: Proxy[];
}

const ProxySettingCard = async ({ proxies }: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manage Proxy Settings</CardTitle>
        <CardDescription>You can manage proxy settings here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1">
            <Input
              placeholder="Search proxy settings..."
              className="pl-9 bg-muted border-none"
              icon={<Search size={16} />}
            />
          </div>
          <EditProxySettingDialog
            triggerButton={<Button>Add Proxy Setting</Button>}
          />
        </div>
        <Proxies proxies={proxies} />
      </CardContent>
    </Card>
  );
};

export default ProxySettingCard;
