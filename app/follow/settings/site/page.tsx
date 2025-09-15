import React from "react";
import SiteTable from "./SiteTable";

const Site = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Site</h1>
        <p className="text-sm text-muted-foreground">
          Site is a site that is used to track the content of the website.
        </p>
      </div>
      <SiteTable />
    </div>
  );
};

export default Site;
