import prisma from "@/lib/prisma";
import { json, badRequest, conflict, serverError } from "@/app/api/_utils/http";
import { SourceCreateSchema, SourceQuerySchema } from "@/app/api/_utils/zod";
import { Prisma } from "@/lib/generated/prisma";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = SourceQuerySchema.safeParse(
      Object.fromEntries(searchParams)
    );
    if (!parsed.success)
      return badRequest("Invalid query parameters", parsed.error.message);

    const { q, type, active, page, pageSize } = parsed.data;
    const where: Prisma.SourceWhereInput = {};
    if (q) where.name = { contains: q, mode: "insensitive" };
    if (type) where.type = type;
    if (active) where.active = active === "true";

    const [total, items] = await Promise.all([
      prisma.source.count({ where }),
      prisma.source.findMany({
        where,
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
    const parsed = SourceCreateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Invalid source payload", parsed.error.message);

    const created = await prisma.source.create({
      data: parsed.data as Prisma.SourceCreateInput,
    });
    return json(created, 201);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return conflict("Source name already exists");
    return serverError(e);
  }
}
