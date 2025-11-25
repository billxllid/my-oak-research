import prisma from "@/lib/prisma";
import { json, badRequest, conflict, serverError } from "@/app/api/_utils/http";
import { KeywordCreateSchema, KeywordQuerySchema } from "@/app/api/_utils/zod";
import { Prisma } from "@/app/generated/prisma";
import { z } from "zod";

function normalizeTokens(arr: string[]) {
  const seen = new Set<string>();
  return arr
    .map((s) => s.trim())
    .filter((s) => s.length > 0)
    .map((s) => s.toLowerCase())
    .filter((s) => (seen.has(s) ? false : (seen.add(s), true)));
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = KeywordQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );
    if (!parsed.success)
      return badRequest(
        "Invalid query parameters",
        z.flattenError(parsed.error)
      );

    const { q, categoryId, lang, active, page, pageSize } = parsed.data;
    const where: Record<string, unknown> = {};
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (categoryId) where.categoryId = categoryId;
    if (lang) where.lang = lang;
    if (active) where.active = active === "true";

    const [total, items] = await Promise.all([
      prisma.keyword.count({ where }),
      prisma.keyword.findMany({
        where,
        include: { category: true },
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return json({ total, page, pageSize, items });
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = KeywordCreateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest(
        "Invalid keyword payload",
        z.flattenError(parsed.error)
      );

    const data = parsed.data;
    const includes = normalizeTokens(data.includes);
    const excludes = normalizeTokens(data.excludes);
    const synonyms = normalizeTokens(data.synonyms || []);

    // 可选：交叉检查，排除重叠
    const excludeSet = new Set(excludes);
    const includesClean = includes.filter((w) => !excludeSet.has(w));
    const synonymsClean = synonyms.filter(
      (w) => !excludeSet.has(w) && !includesClean.includes(w)
    );

    const created = await prisma.keyword.create({
      data: {
        name: data.name,
        description: data.description ?? undefined,
        lang: data.lang,
        categoryId: data.categoryId ?? undefined,
        includes: includesClean,
        excludes,
        synonyms: synonymsClean,
        active: data.active,
        enableAiExpand: data.enableAiExpand,
      },
      include: { category: true },
    });

    // TODO: 若需要 AI 扩展，可在此触发队列任务，异步回填 synonyms
    // if (data.enableAiExpand) queue.add('keywords.aiExpand', { keywordId: created.id })

    return json(created, 201);
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      // Check which field caused the unique constraint violation
      if ((e.meta?.target as string[])?.includes("name")) {
        return conflict(
          "Keyword name already exists. Please choose a different name."
        );
      }
      return conflict("A keyword with this name already exists");
    }
    return serverError(e);
  }
}
