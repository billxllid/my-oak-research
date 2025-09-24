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
  categoryId: z.string().optional().nullable(),
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
  categoryId: z.string().cuid().optional(),
  lang: z.enum(["zh", "en", "ja", "auto"]).optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});

export type KeywordQuery = z.infer<typeof KeywordQuerySchema>;

export const SourceTypeEnum = z.enum([
  "RSS",
  "RSSHUB",
  "REDDIT",
  "TELEGRAM",
  "X",
  "CUSTOM",
]);

// 为不同类型的必填项做条件校验
export const RSSLike = z.object({ url: z.string().url("Invalid URL") });
export const RedditCfg = z.object({
  subreddit: z.string().min(1),
  sort: z.enum(["hot", "new", "top"]).default("hot").optional(),
});
export const TelegramCfg = z.object({
  channel: z.string().min(1), // e.g. @xxx 或数字ID
  apiToken: z.string().min(1).optional(), // 若用bot拉取
});
export const XCfg = z
  .object({
    listId: z.string().optional(),
    user: z.string().optional(),
    query: z.string().optional(),
    bearerToken: z.string().optional(),
  })
  .refine((v) => v.listId || v.user || v.query, {
    message: "Provide at least one of listId/user/query",
  });

export const SourceCreateSchema = z
  .object({
    name: z.string().min(1).max(64),
    type: SourceTypeEnum,
    url: z.string().url().optional().nullable(),
    config: z.record(z.string(), z.any()).optional().nullable(),
    headers: z.record(z.string(), z.any()).optional().nullable(),
    auth: z.record(z.string(), z.any()).optional().nullable(),
    rateLimit: z.number().int().min(1).max(600).optional().nullable(),
    active: z.boolean().optional().default(true),
    lastStatus: z.string().optional().nullable(),
  })
  .superRefine((data, ctx) => {
    switch (data.type) {
      case "RSS":
      case "RSSHUB": {
        const r = RSSLike.safeParse({ url: data.url });
        if (!r.success)
          r.error.issues.forEach((i) => ctx.addIssue(i.toString()));
        break;
      }
      case "REDDIT": {
        const r = RedditCfg.safeParse(data.config);
        if (!r.success)
          r.error.issues.forEach((i) => ctx.addIssue(i.toString()));
        break;
      }
      case "TELEGRAM": {
        const r = TelegramCfg.safeParse(data.config);
        if (!r.success)
          r.error.issues.forEach((i) => ctx.addIssue(i.toString()));
        break;
      }
      case "X": {
        const r = XCfg.safeParse(data.config);
        if (!r.success)
          r.error.issues.forEach((i) => ctx.addIssue(i.toString()));
        break;
      }
      case "CUSTOM": {
        if (!data.url && !data.config)
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Provide at least url or config for CUSTOM",
          });
        break;
      }
    }
  });

export const SourceUpdateSchema = SourceCreateSchema.partial();

export const SourceQuerySchema = z.object({
  q: z.string().optional(),
  type: SourceTypeEnum.optional(),
  active: z.enum(["true", "false"]).optional(),
  page: z.coerce.number().min(1).default(1),
  pageSize: z.coerce.number().min(1).max(100).default(20),
});
