import { z } from "zod";

export const LangEnum = z
  .enum(["zh", "en", "ja", "auto"])
  .optional()
  .default("auto");

export const CategoryCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(64),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
});

export const CategoryUpdateSchema = z.object({
  name: z.string().min(1, "Name is required").max(64).optional(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
});

const SPLIT_RE = /[,\n\r，、;；\t]+/g;

const cuid = z.cuid();
const cuidOpt = z.cuid().optional().nullable();

function toStringArray(input: unknown): string[] {
  if (Array.isArray(input)) {
    return input.map((x) => String(x).trim()).filter(Boolean);
  }
  const raw = String(input ?? "").trim();
  if (!raw) return [];
  return raw
    .split(SPLIT_RE)
    .map((s) => s.trim())
    .filter(Boolean);
}

function uniq(arr: string[]) {
  return Array.from(new Set(arr));
}

function delimitedStringArray({
  itemMax,
  totalMax,
  itemMin = 1,
  minItems = 0,
}: {
  itemMax: number;
  totalMax: number;
  itemMin?: number;
  minItems?: number;
}) {
  return z
    .preprocess(
      (val) => toStringArray(val),
      z.array(z.string().min(itemMin).max(itemMax))
    )
    .transform(uniq)
    .refine((arr) => arr.length >= minItems, {
      message: `Must have at least ${minItems} items`,
    })
    .refine((arr) => arr.length <= totalMax, {
      message: `Must be less than ${totalMax} items`,
    })
    .default([]);
}

export const KeywordCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(64),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional()
    .nullable(),
  lang: LangEnum,
  categoryId: cuidOpt,
  includes: delimitedStringArray({ minItems: 1, itemMax: 40, totalMax: 200 }),
  excludes: delimitedStringArray({ minItems: 0, itemMax: 40, totalMax: 200 }),
  enableAiExpand: z.boolean().optional().default(false),
  synonyms: delimitedStringArray({
    minItems: 0,
    itemMax: 40,
    totalMax: 400,
  }).optional(),
  active: z.boolean().optional().default(true),
});

export const KeywordUpdateSchema = KeywordCreateSchema.partial();

export const KeywordQuerySchema = z.object({
  q: z.string().optional(),
  categoryId: cuidOpt,
  lang: LangEnum,
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type KeywordQuery = z.infer<typeof KeywordQuerySchema>;

export const SourceTypeEnum = z.enum([
  "WEB",
  "DARKNET",
  "SEARCH_ENGINE",
  "SOCIAL_MEDIA",
]);
export const CrawlerEngineEnum = z.enum([
  "FETCH",
  "CHEERIO",
  "PLAYWRIGHT",
  "PUPPETEER",
  "CUSTOM",
]);
export const SearchEngineKindEnum = z.enum([
  "GOOGLE",
  "BING",
  "DDG",
  "SEARXNG",
  "CUSTOM",
]);
export const SocialPlatformEnum = z.enum(["X", "TELEGRAM", "REDDIT"]);

function parseJson(val: unknown) {
  if (val === "") return undefined;
  if (typeof val === "string") {
    try {
      const parse = JSON.parse(val);
      return parse;
    } catch (error) {
      return val;
    }
  }
  return val;
}

export const WebConfigInput = z.object({
  url: z.url(),
  headers: z.preprocess((val) => parseJson(val), z.record(z.string(), z.string()).optional().nullable()),
  crawlerEngine: CrawlerEngineEnum.optional().default("FETCH"),
  render: z.boolean().optional().default(false),
  parseRules: z.preprocess((val) => parseJson(val), z.record(z.string(), z.any()).optional().nullable()),
  robotsRespect: z.boolean().optional().default(true),
  proxyId: cuidOpt,
});

export const DarknetConfigInput = z.object({
  url: z.string().min(1), // .onion 也可能不是严格的 url()，放宽
  headers: z.preprocess((val) => {
    if (typeof val === "string") {
      return JSON.parse(val);
    }
    return val;
  }, z.record(z.string(), z.string()).optional().nullable()),
  crawlerEngine: CrawlerEngineEnum.optional().default("FETCH"),
  // Darknet 通常强制使用代理（TOR/SOCKS5）
  proxyId: cuid,
  render: z.boolean().optional().default(false),
  parseRules: z.preprocess((val) => {
    if (typeof val === "string") {
      return JSON.parse(val);
    }
    return val;
  }, z.record(z.string(), z.any()).optional().nullable()),
});

export const SearchEngineConfigInput = z.object({
  engine: SearchEngineKindEnum,
  query: z.string().min(1),
  region: z.string().optional().nullable(),
  lang: LangEnum,
  apiEndpoint: z.string().url().optional().nullable(),
  options: z.record(z.string(), z.any()).optional().nullable(),
  credentialId: cuidOpt,
});

export const SocialConfigByPlatform =  z.discriminatedUnion("platform", [
  z.object({
    platform: z.literal("X"),
    config: z
      .object({
        user: z.string().optional(),
        listId: z.string().optional(),
        query: z.string().optional(),
      })
      .refine((v) => v.user || v.listId || v.query, {
        message: "X: provide at least one of user/listId/query",
      }),
    credentialId: cuidOpt,
    proxyId: cuidOpt,
  }),
  z.object({
    platform: z.literal("TELEGRAM"),
    config: z.object({
      channel: z.string().min(1), // @xxx 或数字id
      mode: z.enum(["history", "updates"]).optional(),
    }),
    credentialId: cuidOpt,
    proxyId: cuidOpt,
  }),
  z.object({
    platform: z.literal("REDDIT"),
    config: z.object({
      subreddit: z.string().min(1),
      sort: z.enum(["hot", "new", "top"]).optional(),
    }),
    credentialId: cuidOpt,
    proxyId: cuidOpt,
  }),
]);

export const SourceBaseCreate = z.object({
  name: z.string().min(1).max(64),
  description: z.string().optional().nullable(),
  type: SourceTypeEnum,
  active: z.boolean().optional().default(true),
  rateLimit: z.number().int().min(1).max(600).optional().nullable(),
  proxyId: cuidOpt,
  credentialId: cuidOpt,
});

export const WebSourceCreateSchema = SourceBaseCreate.extend({
  type: z.literal("WEB"),
  web: WebConfigInput,
});

export const DarknetSourceCreateSchema = SourceBaseCreate.extend({
  type: z.literal("DARKNET"),
  proxyId: cuid,
  darknet: DarknetConfigInput,
});

export const SearchEngineSourceCreateSchema = SourceBaseCreate.extend({
  type: z.literal("SEARCH_ENGINE"),
  search: SearchEngineConfigInput,
});

export const SocialMediaSourceCreateSchema = SourceBaseCreate.extend({
  type: z.literal("SOCIAL_MEDIA"),
  social: SocialConfigByPlatform,
});

export const SourceCreateSchema = z.discriminatedUnion("type", [
  WebSourceCreateSchema,
  DarknetSourceCreateSchema,
  SearchEngineSourceCreateSchema,
  SocialMediaSourceCreateSchema,
]);

// 为社交媒体更新创建单独的 schema
export const SocialConfigUpdateInput = z.object({
  platform: SocialPlatformEnum.optional(),
  config: z.any().optional(),
  credentialId: cuidOpt,
  proxyId: cuidOpt,
});

export const SourceUpdateSchema = z.object({
  name: z.string().min(1).max(64).optional(),
  description: z.string().optional().nullable(),
  active: z.boolean().optional(),
  rateLimit: z.number().int().min(1).max(600).optional().nullable(),
  proxyId: cuidOpt,
  credentialId: cuidOpt,
  // 子配置：
  web: WebConfigInput.partial().optional(),
  darknet: DarknetConfigInput.partial().optional(),
  search: SearchEngineConfigInput.partial().optional(),
  social: SocialConfigUpdateInput.optional(),
});

export const SourceQuerySchema = z.object({
  q: z.string().optional(),
  type: SourceTypeEnum.optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export const SourceTestSchema = SourceCreateSchema;

// Proxy schemas
export const ProxyTypeEnum = z.enum([
  "HTTP",
  "HTTPS", 
  "SOCKS4",
  "SOCKS5",
  "TOR",
]);

export const ProxyCreateSchema = z.object({
  name: z.string().min(1, "Name is required").max(64),
  type: ProxyTypeEnum,
  url: z.string().min(1, "URL is required").url("Invalid URL format"),
  active: z.boolean().optional().default(true),
});

export const ProxyUpdateSchema = ProxyCreateSchema.partial();

export const ProxyQuerySchema = z.object({
  q: z.string().optional(),
  type: ProxyTypeEnum.optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type ProxyQuery = z.infer<typeof ProxyQuerySchema>;