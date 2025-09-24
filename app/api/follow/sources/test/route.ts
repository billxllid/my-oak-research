import { badRequest, json, serverError } from "@/app/api/_utils/http";
import {
  RedditCfg,
  SourceCreateSchema,
  TelegramCfg,
  XCfg,
} from "@/app/api/_utils/zod";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SourceCreateSchema.safeParse(body);
    if (!parsed.success)
      return badRequest("Invalid source payload", parsed.error.message);

    const { type, url, config, headers } = parsed.data;

    let ok = false;
    let message = "";
    switch (type) {
      case "RSS":
      case "RSSHUB": {
        if (!url) {
          ok = false;
          message = "URL required";
          break;
        }
        const r = await fetch(url, {
          method: "GET",
          headers: headers || undefined,
          cache: "no-store",
        });
        ok = r.ok;
        const ct = r.headers.get("content-type") || "";
        message = r.ok ? `HTTP ${r.status} ${ct}` : `HTTP ${r.status}`;
        break;
      }
      case "REDDIT": {
        const sub =
          (config as z.infer<typeof RedditCfg>)?.subreddit ||
          (config as z.infer<typeof RedditCfg>)?.sort;
        if (!sub) {
          message = "subreddit required";
          break;
        }
        ok = true;
        message = `Subreddit: ${sub}`;
        break;
      }
      case "TELEGRAM": {
        const ch =
          (config as z.infer<typeof TelegramCfg>)?.channel ||
          (config as z.infer<typeof TelegramCfg>)?.apiToken;
        if (!ch) {
          message = "channel required";
          break;
        }
        ok = true;
        message = `Channel: ${ch}`;
        break;
      }
      case "X": {
        const q =
          (config as z.infer<typeof XCfg>)?.query ||
          (config as z.infer<typeof XCfg>)?.user ||
          (config as z.infer<typeof XCfg>)?.listId;
        if (!q) {
          message = "query/user/listId required";
          break;
        }
        ok = true;
        message = `OK: ${q}`;
        break;
      }
      case "CUSTOM": {
        ok = true;
        message = "Config accepted";
        break;
      }
    }

    return json({ ok, message });
  } catch (e) {
    return serverError(e);
  }
}
