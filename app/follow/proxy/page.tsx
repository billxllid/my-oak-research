import React from "react";
import ProxySettingTable from "./ProxySettingTable";

const Proxy = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Proxy</h1>
        <p className="text-sm text-muted-foreground">
          Proxy is a proxy that is used to track the content of the website.
        </p>
      </div>

      <ProxySettingTable />
    </div>
  );
};

export default Proxy;
