import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import PlatformTable from "./PlatformTable";
import PlatformCreditalTable from "./PlatformCreditalTable";

const Platform = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Platform</h1>
        <p className="text-sm text-muted-foreground">
          Platform is a platform that is used to track the content of the
          website.
        </p>
      </div>

      <div className="flex flex-col gap-12">
        <PlatformTable />
        <PlatformCreditalTable />
      </div>
    </div>
  );
};

export default Platform;
