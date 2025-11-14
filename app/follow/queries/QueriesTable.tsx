"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { PencilIcon, TrashIcon, PlayIcon } from "lucide-react";
import { Keyword, Source } from "@/lib/generated/prisma";
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
  const [dialogOpen, setDialogOpen] = useState(false);
  const closeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleEdit = (query: QueryWithAggregations) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setEditingQuery(query);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    closeTimerRef.current = setTimeout(() => {
      setEditingQuery(undefined);
      closeTimerRef.current = null;
    }, 220);
  };

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const columns: DataTableColumn<QueryWithAggregations>[] = [
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
      render: (query) => query.keywords?.length ?? query.keywordsCount ?? 0,
    },
    {
      key: "sourcesCount",
      label: "Sources",
      render: (query) => query.sources?.length ?? query.sourcesCount ?? 0,
    },
    {
      key: "enabled",
      label: "Enabled",
      render: (query) => (query.enabled ? "Yes" : "No"),
    },
  ];

  const actions: DataTableAction<QueryWithAggregations>[] = [
    {
      type: "custom",
      render: (query) => (
        <Button
          size="sm"
          variant="default"
          onClick={async () => {
            try {
              const res = await fetch(`/api/follow/queries/${query.id}/run`, {
                method: "POST",
              });
              const json = await res.json();
              if (!res.ok) {
                console.error("Run failed:", json?.error || res.statusText);
                return;
              }
              const runId = json.runId as string | undefined;
              if (!runId) return;
              const es = new EventSource(`/api/tasks/${runId}/stream`);
              es.onmessage = (ev) => {
                try {
                  const data = JSON.parse(ev.data);
                  // 简单输出，可替换为 toast 或 UI 进度
                  console.log("[task-event]", data);
                  if (data?.type === "done" || data?.type === "error") {
                    // 简单处理：任务结束后刷新页面以获取最新数据
                    try {
                      location.reload();
                    } catch {}
                    es.close();
                  }
                } catch {}
              };
            } catch (e) {
              console.error(e);
            }
          }}
        >
          <PlayIcon className="size-3" />
        </Button>
      ),
    },
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
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false);
            handleCloseDialog();
          } else {
            if (closeTimerRef.current) {
              clearTimeout(closeTimerRef.current);
              closeTimerRef.current = null;
            }
            setDialogOpen(true);
          }
        }}
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
