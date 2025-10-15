import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * 通用的 Source Mutation Hook，用于创建和更新 source
 * @param options.sourceId - 如果提供，则为更新操作；否则为创建操作
 * @param options.queryKeyType - source 类型，用于 invalidate 特定的查询（如 "WEB", "DARKNET", "SOCIAL_MEDIA", "SEARCH_ENGINE"）
 * @param options.onSuccess - 成功后的回调函数
 */
interface UseSourceMutationOptions {
  sourceId?: string;
  queryKeyType?: string;
  onSuccess?: () => void;
}

async function submitSource(data: {
  formData: Record<string, unknown>;
  endpoint: string;
  isUpdate: boolean;
}) {
  const { formData, endpoint, isUpdate } = data;

  const response = await fetch(endpoint, {
    method: isUpdate ? "PATCH" : "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || "Failed to submit source");
  }

  return response.json();
}

export function useSourceMutation({
  sourceId,
  queryKeyType,
  onSuccess,
}: UseSourceMutationOptions = {}) {
  const queryClient = useQueryClient();
  const isUpdate = !!sourceId;
  const endpoint = sourceId
    ? `/api/follow/sources/${sourceId}`
    : "/api/follow/sources";

  return useMutation({
    mutationFn: (formData: Record<string, unknown>) =>
      submitSource({
        formData,
        endpoint,
        isUpdate,
      }),
    onSuccess: () => {
      // 显示成功消息
      toast.success(
        isUpdate ? "Source updated successfully" : "Source added successfully"
      );

      // 执行用户提供的成功回调
      onSuccess?.();

      // Invalidate 相关查询
      queryClient.invalidateQueries({ queryKey: ["sources"] });
      if (queryKeyType) {
        queryClient.invalidateQueries({ queryKey: ["sources", queryKeyType] });
      }
      if (sourceId) {
        queryClient.invalidateQueries({ queryKey: ["source", sourceId] });
      }
    },
    onError: (error: Error) => {
      // 增强的错误处理
      console.error("Failed to submit source:", error);
      toast.error(
        error.message ||
          (isUpdate ? "Failed to update source" : "Failed to add source")
      );
    },
  });
}
