import { z, ZodType } from "zod";

type JsonRequest = {
  prompt: string;
  schema?: ZodType;
  model?: string;
  temperature?: number;
  metadata?: Record<string, unknown>;
};

const DEFAULT_LLMSUMMARY = (prompt: string) => {
  const snippet = prompt
    .split("\n")
    .filter((line) => line.trim().length > 0)
    .slice(0, 3)
    .join(" ");
  return snippet.slice(0, 200);
};

export const llmGateway = {
  async json<T>(task: string, request: JsonRequest): Promise<T> {
    const gatewayUrl = process.env.LLM_GATEWAY_URL;
    let output: unknown;
    if (gatewayUrl) {
      const url = new URL(gatewayUrl);
      url.pathname = url.pathname.replace(/\/$/, "") + "/json";
      const response = await fetch(url.toString(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task,
          prompt: request.prompt,
          model: request.model,
          temperature: request.temperature ?? 0.3,
          metadata: request.metadata,
        }),
      });
      if (!response.ok) {
        const text = await response.text().catch(() => "failed");
        throw new Error(`LLM Gateway error (${response.status}): ${text}`);
      }
      output = await response.json();
    } else {
      output = {
        summary: DEFAULT_LLMSUMMARY(request.prompt),
        relevance: true,
      };
    }

    if (request.schema) {
      return request.schema.parse(output) as T;
    }
    return output as T;
  },
};
