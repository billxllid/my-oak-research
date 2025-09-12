import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon } from "lucide-react";
import KeywordsTable from "./KeywordsTable";

const Keyword = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">Keyword</h1>
        <p className="text-sm text-muted-foreground">
          Keyword is a keyword that is used to track the content of the website.
        </p>
      </div>

      <div className="flex gap-2">
        <Button>
          <PlusIcon />
          Add Keyword
        </Button>
        <Input placeholder="Search Keyword" className="w-64" />
      </div>

      <KeywordsTable />
    </div>
  );
};

export default Keyword;
