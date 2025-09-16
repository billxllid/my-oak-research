import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React from "react";
import { Search } from "lucide-react";
import ReportCard from "./ReportCard";
import { Plus } from "lucide-react";

const reports = [
  {
    id: 1,
    name: "Report 1",
    description: "Report 1 description",
  },
  {
    id: 2,
    name: "Report 2",
    description: "Report 2 description",
  },
  {
    id: 3,
    name: "Report 3",
    description: "Report 3 description",
  },
  {
    id: 4,
    name: "Report 4",
    description: "Report 4 description",
  },
  {
    id: 5,
    name: "Report 5",
    description: "Report 5 description",
  },
];

const ReportManage = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <Input placeholder="Search" icon={<Search size={16} />} />
        <div className="flex gap-2">
          <Button>
            <Plus />
          </Button>
          <Button variant="outline">Filter</Button>
          <Button variant="outline">Editor</Button>
        </div>
      </div>

      <div className="max-h-[calc(100vh-170px)] overflow-y-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {reports.map((template) => (
            <ReportCard key={template.id} {...template} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReportManage;
