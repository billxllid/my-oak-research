import prisma from "@/lib/prisma";
import {
  json,
  badRequest,
  notFound,
  conflict,
  serverError,
} from "@/app/api/_utils/http";
import { SourceUpdateSchema } from "@/app/api/_utils/zod";
import { Prisma } from "@/lib/generated/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const item = await prisma.source.findUnique({ where: { id: params.id } });
    if (!item) return notFound("Source not found");
    return json(item);
  } catch (e) {
    return serverError(e);
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = SourceUpdateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Invalid source payload", parsed.error.message);

    const exists = await prisma.source.findUnique({ where: { id: params.id } });
    if (!exists) return notFound("Source not found");

    const updated = await prisma.source.update({
      where: { id: params.id },
      data: parsed.data as Prisma.SourceUpdateInput,
    });
    return json(updated);
  } catch (e: unknown) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002")
      return conflict("Source name already exists");
    return serverError(e);
  }
}

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.source.delete({ where: { id: params.id } });
    return json({ ok: true });
  } catch (e) {
    return serverError(e);
  }
}
