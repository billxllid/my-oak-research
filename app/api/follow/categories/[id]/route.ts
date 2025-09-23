import prisma from "@/lib/prisma";
import {
  json,
  badRequest,
  notFound,
  conflict,
  serverError,
} from "@/app/api/_utils/http";
import { CategoryUpdateSchema } from "@/app/api/_utils/zod";
import { Prisma } from "@/lib/generated/prisma";

export async function PATCH(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await _.json();
    const parsed = CategoryUpdateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Invalid category payload", parsed.error.flatten());

    const exists = await prisma.category.findUnique({ where: { id } });
    if (!exists) return notFound("Category not found");

    const updated = await prisma.category.update({
      where: { id },
      data: parsed.data,
    });
    return json(updated);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return conflict("Category name already exists");
    return serverError(e);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    // 可选：阻止删除仍被使用的分类
    const count = await prisma.keyword.count({ where: { categoryId: id } });
    if (count > 0)
      return conflict(
        "Category is in use by keywords; migrate or remove those first"
      );

    await prisma.category.delete({ where: { id } });
    return json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
