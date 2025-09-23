import { z } from 'zod'


export const LangEnum = z.enum(['zh', 'en', 'ja', 'auto']).optional()


export const CategoryCreateSchema = z.object({
name: z.string().min(1).max(64)
})


export const CategoryUpdateSchema = z.object({
name: z.string().min(1).max(64).optional()
})


export const KeywordCreateSchema = z.object({
name: z.string().min(1).max(64),
description: z.string().max(500).optional().nullable(),
lang: LangEnum,
categoryId: z.string().cuid().optional().nullable(),
includes: z.array(z.string().min(1).max(40)).max(200).default([]),
excludes: z.array(z.string().min(1).max(40)).max(200).default([]),
enableAiExpand: z.boolean().optional().default(false),
synonyms: z.array(z.string().min(1).max(40)).max(400).optional().default([]), // 允许直接传入（若有后台AI）
active: z.boolean().optional().default(true)
})


export const KeywordUpdateSchema = KeywordCreateSchema.partial()


export const KeywordQuerySchema = z.object({
q: z.string().optional(),
categoryId: z.string().cuid().optional(),
lang: z.enum(['zh', 'en', 'ja', 'auto']).optional(),
active: z.enum(['true', 'false']).optional(),
page: z.coerce.number().min(1).default(1),
pageSize: z.coerce.number().min(1).max(100).default(20)
})


export type KeywordQuery = z.infer<typeof KeywordQuerySchema>