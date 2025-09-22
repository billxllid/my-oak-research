import React from "react";
import QuerySettingCard from "./QuerySettingCard";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const Queries = () => {
  return (
    <div className="grid gap-4">
      <Tabs defaultValue="queries">
        <TabsContent value="queries">
          <QuerySettingCard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Queries;
