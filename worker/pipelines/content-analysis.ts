import prisma from "@/lib/prisma";
import { publishTaskEvent } from "@/lib/queue";

type CleanItem = {
  title?: string;
  text: string;
  markdown?: string;
  platform?: string;
  url?: string;
  time?: Date;
  source?: string;
  ref?: unknown;
};

export async function runFocusCollector(runId: string, queryId: string) {
  const send = async (event: unknown) => publishTaskEvent(runId, event);

  await prisma.queryRun.update({
    where: { id: runId },
    data: { status: "RUNNING", startedAt: new Date() },
  });
  await send({ type: "start", message: "任务开始" });

  const query = await prisma.query.findUnique({ where: { id: queryId } });
  if (!query) {
    throw new Error("Query not found");
  }

  // 1) Fetch raw items (placeholder)
  await send({ type: "fetch", message: "拉取数据中" });
  const rawItems: CleanItem[] = await fetchBySourcesPlaceholder(queryId);

  // 2) Clean & dedup (placeholder)
  await send({ type: "clean", message: "清洗与去重" });
  const cleaned = cleanAndDedup(rawItems);

  // 3) Summary (placeholder, TODO: integrate LLM Gateway)
  await send({ type: "summary", message: "生成摘要" });
  const summarized = cleaned.map((it) => ({
    ...it,
    summary: it.text.length > 180 ? `${it.text.slice(0, 180)}...` : it.text,
    relevance: true,
  }));

  // 4) Store (NOTE: Content 模型尚未定义，此处仅记录事件，避免编译错误)
  await send({ type: "store", message: "写入数据库（示例，不落库）" });

  await prisma.queryRun.update({
    where: { id: runId },
    data: { status: "SUCCEEDED", progress: 100, finishedAt: new Date() },
  });
  await send({ type: "done", message: "任务完成", progress: 100 });
}

function cleanAndDedup(items: CleanItem[]): CleanItem[] {
  // 简化：直接返回
  return items;
}

async function fetchBySourcesPlaceholder(
  queryId: string
): Promise<CleanItem[]> {
  // 简化：返回一条虚拟数据
  return [
    {
      title: "示例标题",
      text: "这是一条从占位抓取器返回的示例文本，用于打通任务流、SSE、状态与队列。",
      markdown: undefined,
      platform: "Web",
      url: "https://example.com",
      time: new Date(),
      source: "placeholder",
    },
  ];
}
