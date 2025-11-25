import { z } from "zod";

const stripJson = (val: unknown) => {
  if (typeof val === "string") {
    try {
      return JSON.parse(val);
    } catch {
      return val;
    }
  }
  return val;
};

const jsonish = () =>
  z
    .union([z.record(z.string(), z.any()), z.string(), z.undefined(), z.null()])
    .transform((val) => (typeof val === "string" ? stripJson(val) : val))
    .optional();

export const TemplateCreateSchema = z.object({
  name: z.string().min(1).max(128),
  description: z.string().max(500).optional().nullable(),
  markdown: z.string().optional().nullable(),
  metadata: jsonish(),
});

export const TemplateUpdateSchema = TemplateCreateSchema.partial();

export const MaterialSourceSchema = z.enum(["FAVORITE", "KNOWLEDGE"]);

export const MaterialSchema = z.object({
  sourceType: MaterialSourceSchema,
  sourceId: z.string().cuid(),
  title: z.string().max(256).optional().nullable(),
  snippet: z.string().max(1024).optional().nullable(),
  metadata: jsonish(),
});

export const ReportCreateSchema = z.object({
  title: z.string().min(1).max(256),
  summary: z.string().max(1000).optional().nullable(),
  markdown: z.string().optional().nullable(),
  templateId: z.string().cuid().optional(),
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]).optional(),
  metadata: jsonish(),
  materials: z.array(MaterialSchema).optional(),
});

export const ReportUpdateSchema = ReportCreateSchema.partial();

export const ReportListQuerySchema = z.object({
  status: z.enum(["DRAFT", "REVIEW", "PUBLISHED"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(50).default(20),
});

export const ReportGenerateSchema = z.object({
  prompt: z.string().min(20),
  templateId: z.string().cuid().optional(),
  materials: z.array(MaterialSchema).optional(),
  options: z
    .object({
      model: z.string().optional(),
      temperature: z.number().min(0).max(1).optional(),
    })
    .optional(),
});

export const ReportSectionSchema = z.object({
  heading: z.string().min(1),
  content: z.string().min(1),
  references: z.array(z.string()).optional(),
});

export const ReportLLMOutputSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  markdown: z.string().min(1),
  sections: z.array(ReportSectionSchema).optional(),
});
