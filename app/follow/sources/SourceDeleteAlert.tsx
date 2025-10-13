"use client";

import { SettingDeleteAlertDialog } from "@/components/SettingDeleteAlertDialog";
import { toast } from "sonner";
import { Source } from "@/lib/generated/prisma";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  source: Source;
  triggerButton: React.ReactNode;
  queryKeyType?: string; // 用于指定要 invalidate 的查询类型，如 "DARKNET", "WEB", "SOCIAL_MEDIA" 等
}

// Mutation function for deleting source
async function deleteSource(sourceId: string) {
  const response = await fetch(`/api/follow/sources/${sourceId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to delete source");
  }

  return response.json();
}

const SourceDeleteAlert = ({ source, triggerButton, queryKeyType }: Props) => {
  const queryClient = useQueryClient();

  // Setup React Query mutation for delete
  const deleteMutation = useMutation({
    mutationFn: deleteSource,
    onSuccess: () => {
      // Show success message
      toast.success("Source deleted successfully");

      // Invalidate queries based on source type
      if (queryKeyType) {
        queryClient.invalidateQueries({ queryKey: ["sources", queryKeyType] });
      }
      // Also invalidate the general sources list
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    },
    onError: (error: Error) => {
      console.error("Failed to delete source:", error);
      toast.error(error.message || "Failed to delete source");
    },
  });

  const handleDelete = async () => {
    // 防止重复删除
    if (deleteMutation.isPending) {
      return;
    }
    deleteMutation.mutate(source.id);
  };

  return (
    <SettingDeleteAlertDialog
      triggerButton={triggerButton}
      title="Delete Source"
      description="Are you sure you want to delete this source?"
      onDelete={handleDelete}
    />
  );
};

export default SourceDeleteAlert;
