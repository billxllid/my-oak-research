"use client";

import React from "react";
import { FollowContentProvider } from "@/components/follow-content/context";
import { ContentFilters } from "@/components/follow-content/ContentFilters";
import { ContentList } from "@/components/follow-content/ContentList";

const FollowContentLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <FollowContentProvider>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-2 flex flex-col gap-4 overflow-hidden">
          <ContentFilters />
          <ContentList />
        </div>

        <div className="hidden lg:flex lg:col-span-3 flex-col gap-2">
          {children}
        </div>
      </div>
    </FollowContentProvider>
  );
};

export default FollowContentLayout;
