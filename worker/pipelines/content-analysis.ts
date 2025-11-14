import { load } from "cheerio";
import { z } from "zod";

import prisma from "@/lib/prisma";
import { SourceType, ContentType } from "@/lib/generated/prisma";
import {
  SourceWithRelations,
  SocialMediaSource,
  SearchEngineSource,
  WebSource,
  DarknetSource,
} from "@/lib/types";
import { llmGateway } from "@/lib/llm-gateway";
import { publishTaskEvent } from "@/lib/queue";
import { redact, stripPromptLike } from "@/lib/security";

const SummarySchema = z.object({
  summary: z.string().min(30).max(400),
  relevance: z.boolean(),
});

type CleanItem = {
  title?: string;
  text: string;
  markdown: string;
  platform: string;
  url?: string;
  time?: Date;
  sourceId: string;
  sourceType: SourceType;
};

function isWebSource(source: WebSource | DarknetSource): source is WebSource {
  return source.type === SourceType.WEB;
}

function isDarknetSource(
  source: WebSource | DarknetSource
): source is DarknetSource {
  return source.type === SourceType.DARKNET;
}

export async function runFocusCollector(runId: string, queryId: string) {
  const send = async (event: unknown) => publishTaskEvent(runId, event);

  await prisma.queryRun.update({
    where: { id: runId },
    data: { status: "RUNNING", startedAt: new Date(), progress: 0 },
  });
  await send({ type: "start", message: "任务开始" });

  const query = await prisma.query.findUnique({
    where: { id: queryId },
    include: {
      keywords: true,
      sources: {
        include: {
          web: true,
          search: true,
          social: true,
          darknet: true,
        },
      },
    },
  });

  if (!query) {
    throw new Error("Query not found");
  }

  await send({ type: "fetch", message: "拉取数据中" });
  const normalizedSources: SourceWithRelations[] = [];
  query.sources.forEach((source) => {
    switch (source.type) {
      case SourceType.WEB:
        if (source.web) normalizedSources.push(source as WebSource);
        break;
      case SourceType.DARKNET:
        if (source.darknet) normalizedSources.push(source as DarknetSource);
        break;
      case SourceType.SEARCH_ENGINE:
        if (source.search) normalizedSources.push(source as SearchEngineSource);
        break;
      case SourceType.SOCIAL_MEDIA:
        if (source.social) normalizedSources.push(source as SocialMediaSource);
        break;
    }
  });
  const rawItems = await fetchBySources(normalizedSources);
  const cleaned = cleanAndDedup(rawItems);

  if (!cleaned.length) {
    await send({ type: "done", message: "未抓取到内容", progress: 100 });
    await prisma.queryRun.update({
      where: { id: runId },
      data: { status: "SUCCEEDED", progress: 100, finishedAt: new Date() },
    });
    return;
  }

  for (let i = 0; i < cleaned.length; i++) {
    const item = cleaned[i];
    await send({ type: "summary", message: `第 ${i + 1} 条内容生成摘要` });
    const keywords =
      query.keywords.map((kw) => kw.name).join("，") || "无关键词";
    const prompt = stripPromptLike(
      `请基于关键词：${keywords}，用 2-3 句中文解释下面内容的要点和价值：\n${item.text}`
    );
    const summary = await llmGateway.json<{
      summary: string;
      relevance: boolean;
    }>("content-summary", {
      prompt: redact(prompt),
      schema: SummarySchema,
      temperature: 0.3,
      metadata: { queryId, source: item.platform },
    });

    const content = await prisma.content.create({
      data: {
        title:
          item.title ??
          (summary.summary.slice(0, 40).replace(/\s+/g, " ").trim() ||
            `来源 ${item.platform}`),
        summary: summary.summary,
        markdown: item.markdown,
        platform: item.platform,
        type: mapContentType(item.sourceType),
        time: item.time ?? new Date(),
        url: item.url,
        meta: {
          sourceId: item.sourceId,
          sourceType: item.sourceType,
        },
      },
    });

    if (query.keywords.length) {
      await prisma.contentKeyword.createMany({
        data: query.keywords.map((keyword) => ({
          contentId: content.id,
          keywordId: keyword.id,
        })),
        skipDuplicates: true,
      });
    }

    const progress = Math.min(
      100,
      Math.floor(((i + 1) / cleaned.length) * 100)
    );
    await prisma.queryRun.update({
      where: { id: runId },
      data: { progress },
    });
    await send({ type: "progress", message: "入库完成", progress });
  }

  await prisma.queryRun.update({
    where: { id: runId },
    data: { status: "SUCCEEDED", finishedAt: new Date(), progress: 100 },
  });
  await send({ type: "done", message: "任务完成", progress: 100 });
}

function mapContentType(sourceType: SourceType): ContentType {
  switch (sourceType) {
    case SourceType.DARKNET:
      return ContentType.Darknet;
    default:
      return ContentType.Web;
  }
}

function cleanAndDedup(items: CleanItem[]): CleanItem[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const signature = `${item.platform}-${
      item.title ?? item.text.slice(0, 40)
    }`;
    if (seen.has(signature)) return false;
    seen.add(signature);
    return true;
  });
}

async function fetchBySources(
  sources: SourceWithRelations[]
): Promise<CleanItem[]> {
  const results: CleanItem[] = [];
  for (const source of sources) {
    try {
      const fetched = await fetchFromSource(source);
      results.push(...fetched);
    } catch (error) {
      await publishTaskEvent(source?.id ?? "unknown", {
        type: "error",
        message: `抓取来源 ${source.name} 失败：${(error as Error).message}`,
      });
    }
  }
  return results;
}

async function fetchFromSource(
  source: SourceWithRelations
): Promise<CleanItem[]> {
  switch (source.type) {
    case SourceType.WEB:
      return fetchHtmlSource(source as WebSource);
    case SourceType.DARKNET:
      return fetchHtmlSource(source as DarknetSource);
    case SourceType.SEARCH_ENGINE:
      return fetchSearchSource(source as SearchEngineSource);
    case SourceType.SOCIAL_MEDIA:
      return fetchSocialSource(source as SocialMediaSource);
    default:
      return [];
  }
}

async function fetchHtmlSource(
  source: WebSource | DarknetSource
): Promise<CleanItem[]> {
  const fallbackUrl = source.description || `https://example.com/${source.id}`;
  let url = fallbackUrl;
  if (isWebSource(source) && source.web?.url) {
    url = source.web.url;
  } else if (isDarknetSource(source) && source.darknet?.url) {
    url = source.darknet.url;
  }
  const html = await fetchWithTimeout(url);
  const { title, text, markdown } = toMarkdown(html);
  return [
    {
      title,
      text,
      markdown,
      platform: source.name,
      url,
      time: new Date(),
      sourceId: source.id,
      sourceType: source.type,
    },
  ];
}

async function fetchSearchSource(
  source: SearchEngineSource
): Promise<CleanItem[]> {
  const apiUrl = source.search?.apiEndpoint;
  if (!apiUrl) {
    return [
      {
        text: `搜索引擎 ${source.name} 未配置 API，使用默认查询 ${
          source.search?.query || "unknown"
        }`,
        markdown: `搜索引擎 ${source.name} 结果占位`,
        platform: source.name,
        time: new Date(),
        sourceId: source.id,
        sourceType: source.type,
      },
    ];
  }
  const payload = {
    query: source.search.query,
    options: source.search.options,
  };
  const response = await fetchWithTimeout(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = parseSearchResult(response);
  if (!data.length) {
    return [
      {
        text: `搜索引擎 ${source.name} 返回空数据`,
        markdown: `空数据`,
        platform: source.name,
        time: new Date(),
        sourceId: source.id,
        sourceType: source.type,
      },
    ];
  }
  return data.map((item) => ({
    title: item.title,
    text: item.text,
    markdown: item.markdown,
    platform: source.name,
    url: item.url,
    time: item.time ? new Date(item.time) : new Date(),
    sourceId: source.id,
    sourceType: source.type,
  }));
}

async function fetchSocialSource(
  source: SocialMediaSource
): Promise<CleanItem[]> {
  const config = source.social?.config || {};
  const markdown = Object.entries(config)
    .map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
    .join("\n");
  return [
    {
      title: `${source.social?.platform || "Social"} ${source.name}`,
      text: `社交平台 ${source.name} 配置：${JSON.stringify(config)}`,
      markdown,
      platform: source.name,
      time: new Date(),
      sourceId: source.id,
      sourceType: source.type,
    },
  ];
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {}
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);
  const response = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(timeout);
  if (!response.ok) {
    throw new Error(`请求 ${url} 失败 (${response.status})`);
  }
  return response.text();
}

function toMarkdown(html: string) {
  const $ = load(html);
  $("script, style, noscript").remove();
  const title = $("title").first().text().trim();
  const paragraphs = $("p")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((text) => text);
  const markdown = paragraphs.join("\n\n");
  const text = markdown.replace(/\s+/g, " ").trim();
  return {
    title: title || "网页内容",
    text: text || markdown,
    markdown: markdown || text,
  };
}

type SearchResultItem = {
  title?: string;
  snippet?: string;
  summary?: string;
  link?: string;
  publishedAt?: string;
};

function parseSearchResult(payload: string) {
  try {
    const json = JSON.parse(payload);
    if (Array.isArray(json.items)) {
      return (json.items as SearchResultItem[]).map((item) => ({
        title: item.title,
        text: item.snippet || item.summary || "",
        markdown: item.snippet || item.summary || "",
        url: item.link,
        time: item.publishedAt,
      }));
    }
  } catch {
    // ignore
  }
  return [];
}
