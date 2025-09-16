import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search } from "lucide-react";
import ReportTemplateCard from "./ReportTemplateCard";

const templates = [
  {
    id: 1,
    name: "Template 1",
    description: "Template 1 description",
  },
  {
    id: 2,
    name: "Template 2",
    description: "Template 2 description",
  },
  {
    id: 3,
    name: "Template 3",
    description: "Template 3 description",
  },
  {
    id: 4,
    name: "Template 4",
    description: "Template 4 description",
  },
  {
    id: 5,
    name: "Template 5",
    description: "Template 5 description",
  },
  {
    id: 6,
    name: "Template 6",
    description: "Template 6 description",
  },
  {
    id: 7,
    name: "Template 7",
    description: "Template 7 description",
  },
  {
    id: 8,
    name: "Template 8",
    description: "Template 8 description",
  },
  {
    id: 9,
    name: "Template 9",
    description: "Template 9 description",
  },
  {
    id: 10,
    name: "Template 10",
    description: "Template 10 description",
  },
  {
    id: 11,
    name: "Template 11",
    description: "Template 11 description",
  },
  {
    id: 12,
    name: "Template 12",
    description: "Template 12 description",
  },
  {
    id: 13,
    name: "Template 13",
    description: "Template 13 description",
  },
  {
    id: 14,
    name: "Template 14",
    description: "Template 14 description",
  },
];

const ReportTemplate = () => {
  return (
    <div className="flex flex-col flex-1 gap-4">
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

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {templates.map((template) => (
          <ReportTemplateCard key={template.id} {...template} />
        ))}
      </div>
    </div>
  );
};

export default ReportTemplate;
