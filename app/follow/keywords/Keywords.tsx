"use client";

import { Category, Prisma } from "@/lib/generated/prisma";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, XIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import EditKeywordDialog from "./KeywordDialog";
import DeleteKeywordDialog from "./KeywordAlert";

type KeywordWithCategory = Prisma.KeywordGetPayload<{
  include: { category: true };
}>;

const KeywordsTable = ({
  keywords,
  categories,
}: {
  keywords: KeywordWithCategory[];
  categories: Category[];
}) => {
  // 定义表格列配置
  const columns: DataTableColumn<KeywordWithCategory>[] = [
    {
      key: "name",
      label: "Name",
      render: (keyword) => keyword.name,
    },
    {
      key: "lang",
      label: "Lang",
      render: (keyword) => <Badge variant="outline">{keyword.lang}</Badge>,
    },
    {
      key: "category",
      label: "Category",
      render: (keyword) => keyword.category?.name || "-",
    },
    {
      key: "includes",
      label: "Includes",
      render: (keyword) => (
        <div className="flex flex-wrap gap-1 max-w-md">
          {keyword.includes.map((include) => (
            <Badge
              key={include}
              variant="outline"
              className="flex items-center gap-1"
            >
              {include}
              <XIcon
                size={12}
                color="gray"
                className="cursor-pointer hover:text-red-500"
              />
            </Badge>
          ))}
          {keyword.synonyms.map((synonym) => (
            <Badge key={synonym} variant="secondary">
              {synonym}
              <XIcon
                size={12}
                color="gray"
                className="cursor-pointer hover:text-red-500"
              />
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "excludes",
      label: "Excludes",
      render: (keyword) => (
        <div className="flex flex-wrap gap-1 max-w-2xl">
          {keyword.excludes.map((exclude) => (
            <Badge key={exclude} variant="outline">
              {exclude}
              <XIcon
                size={12}
                color="gray"
                className="cursor-pointer hover:text-red-500"
              />
            </Badge>
          ))}
        </div>
      ),
    },
  ];

  // 定义操作配置
  const actions: DataTableAction<KeywordWithCategory>[] = [
    {
      type: "edit",
      render: (keyword) => (
        <EditKeywordDialog
          keyword={keyword}
          categories={categories}
          triggerButton={
            <Button size="sm" variant="outline">
              <PencilIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
    {
      type: "delete",
      render: (keyword) => (
        <DeleteKeywordDialog
          keyword={keyword}
          triggerButton={
            <Button size="sm" variant="outline">
              <TrashIcon className="size-3" />
            </Button>
          }
        />
      ),
    },
  ];

  return (
    <DataTable
      data={keywords}
      columns={columns}
      actions={actions}
      emptyMessage="No keywords found. Add your first keyword to get started."
    />
  );
};

export default KeywordsTable;
