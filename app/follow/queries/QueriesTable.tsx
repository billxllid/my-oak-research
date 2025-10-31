"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon } from "lucide-react";
import { Query, Keyword, Source } from "@/lib/generated/prisma";
import { QueryWithAggregations } from "@/lib/types";
import {
  DataTable,
  DataTableColumn,
  DataTableAction,
} from "@/components/common";
import QueryDialog from "./QueryDialog";
import QueryDeleteAlert from "./QueryDeleteAlert";

interface Props {
  queries: QueryWithAggregations[];
  keywords: Keyword[];
  sources: Source[];
}

const QueriesTable = ({ queries, keywords, sources }: Props) => {
  const [editingQuery, setEditingQuery] = useState<
    QueryWithAggregations | undefined
  >();

  const handleEdit = (query: QueryWithAggregations) => {
    setEditingQuery(query);
  };

  const handleCloseDialog = () => {
    setEditingQuery(undefined);
  };

  const columns: DataTableColumn<Query>[] = [
    {
      key: "name",
      label: "Name",
      render: (query) => query.name,
    },
    {
      key: "description",
      label: "Description",
      className: "max-w-xs",
      render: (query) => (
        <div className="whitespace-normal">{query.description || "-"}</div>
      ),
    },
    {
      key: "frequency",
      label: "Frequency",
      render: (query) => query.frequency,
    },
    {
      key: "keywordsCount",
      label: "Keywords",
      render: (query) => query.keywords.length || 0,
    },
    {
      key: "sourcesCount",
      label: "Sources",
      render: (query) => query.sources.length || 0,
    },
    {
      key: "enabled",
      label: "Enabled",
      render: (query) => (query.enabled ? "Yes" : "No"),
    },
  ];

  const actions: DataTableAction<Query>[] = [
    {
      type: "edit",
      render: (query) => (
        <Button size="sm" variant="outline" onClick={() => handleEdit(query)}>
          <PencilIcon className="size-3" />
        </Button>
      ),
    },
    {
      type: "delete",
      render: (query) => (
        <QueryDeleteAlert
          query={query}
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
    <>
      <QueryDialog
        query={editingQuery}
        keywords={keywords}
        sources={sources}
        open={!!editingQuery}
        onOpenChange={(open) => !open && handleCloseDialog()}
      />
      <DataTable
        data={queries}
        columns={columns}
        actions={actions}
        emptyMessage="No queries found. Add your first query to get started."
      />
    </>
  );
};

export default QueriesTable;
