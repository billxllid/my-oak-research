import prisma from "@/lib/prisma";
import { json, badRequest, conflict, serverError } from "@/app/api/_utils/http";
import { CategoryCreateSchema } from "@/app/api/_utils/zod";
import { Prisma } from "@/lib/generated/prisma";

export async function GET() {
  try {
    const list = await prisma.category.findMany({ orderBy: { name: "asc" } });
    return json(list);
  } catch (e) {
    return serverError(e);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CategoryCreateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Invalid category payload", parsed.error.flatten());

    const created = await prisma.category.create({
      data: { name: parsed.data.name },
    });
    return json(created, 201);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return conflict("Category name already exists");
    return serverError(e);
  }
}
