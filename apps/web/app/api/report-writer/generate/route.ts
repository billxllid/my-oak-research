import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { llmGateway } from "@/lib/llm-gateway";
import { stripPromptLike, redact } from "@/lib/security";
import { ReportGenerateSchema, ReportLLMOutputSchema } from "../schemas";

const respond = (data: unknown) => NextResponse.json({ success: true, data });

const fail = (message: string, status = 400, details?: unknown) =>
  NextResponse.json(
    { success: false, error: { message, details }, data: null },
    { status }
  );

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const parse = ReportGenerateSchema.safeParse(body);
  if (!parse.success) {
    return fail("Invalid request", 400, parse.error.flatten());
  }

  const userId = req.headers.get("x-user-id") ?? null;

  const template = parse.data.templateId
    ? await prisma.reportTemplate.findUnique({
        where: { id: parse.data.templateId },
      })
    : null;

  const materialOverview =
    parse.data.materials
      ?.map(
        (material) =>
          `${material.sourceType}:${material.sourceId} ${
            material.title ? `(${material.title})` : ""
          }`
      )
      .join("\n") || "No materials provided.";

  const prompt = [
    template ? `Template: ${template.name}` : "No template selected",
    template?.markdown ? `Template content:\n${template.markdown}` : null,
    `Materials:\n${materialOverview}`,
    `Task:\n${stripPromptLike(parse.data.prompt)}`,
  ]
    .filter(Boolean)
    .join("\n\n");

  const llmResponse = await llmGateway.json("report-generate", {
    prompt,
    model: parse.data.options?.model,
    temperature: parse.data.options?.temperature,
    metadata: redact({
      userId,
      templateId: parse.data.templateId,
      materials: parse.data.materials,
    }),
  });

  const checked = ReportLLMOutputSchema.safeParse(llmResponse);
  if (!checked.success) {
    return fail("LLM output invalid", 422, checked.error.flatten());
  }

  const report = await prisma.report.create({
    data: {
      title: checked.data.title,
      summary: checked.data.summary,
      markdown: checked.data.markdown,
      status: "DRAFT",
      templateId: parse.data.templateId,
      authorId: userId,
      metadata: checked.data.sections
        ? { sections: checked.data.sections }
        : undefined,
      materials: {
        create:
          parse.data.materials?.map((material) => ({
            sourceType: material.sourceType,
            sourceId: material.sourceId,
            title: material.title,
            snippet: material.snippet,
            metadata: material.metadata,
          })) ?? [],
      },
    },
    include: {
      materials: true,
      template: true,
    },
  });

  return respond(report);
}
