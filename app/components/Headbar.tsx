import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { StarIcon, MoonIcon } from "lucide-react";

const Headbar = () => {
  return (
    <div className="flex items-center py-4 gap-4">
      <SidebarTrigger />
      <div className="flex items-center justify-between w-full">
        <h1 className="text-lg font-bold">Headbar</h1>
        <div className="flex">
          <Button variant="ghost">
            <StarIcon />
          </Button>
          <Button variant="ghost">
            <MoonIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Headbar;
