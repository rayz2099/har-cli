import { buildUriView } from "./uri";
import type { NormalizedEntry } from "./types";

interface HarFile {
  log?: {
    entries?: HarEntry[];
  };
}

interface HarEntry {
  request?: {
    method?: string;
    url?: string;
  };
  response?: {
    status?: number;
    content?: {
      mimeType?: string;
      text?: string;
      encoding?: string;
    };
  };
}

/**
 * 读取并归一化多个 HAR 文件，供过滤与输出阶段复用。
 */
export async function readHarEntries(files: string[], prefixDepth: number): Promise<NormalizedEntry[]> {
  const results: NormalizedEntry[] = [];

  for (const file of files) {
    const parsed = JSON.parse(await Bun.file(file).text()) as HarFile;
    const entries = parsed.log?.entries ?? [];

    for (const entry of entries) {
      const requestUrl = entry.request?.url;
      if (!requestUrl) {
        continue;
      }

      const uri = buildUriView(requestUrl, prefixDepth);
      results.push({
        sourceFile: file,
        method: entry.request?.method ?? "GET",
        url: uri.url,
        path: uri.path,
        httpStatus: entry.response?.status ?? 0,
        mimeType: entry.response?.content?.mimeType,
        body: parseBody(entry.response?.content?.text, entry.response?.content?.encoding),
      });
    }
  }

  return results;
}

/**
 * 仅在响应体是合法 JSON 时返回对象，否则返回 undefined。
 */
function parseBody(contentText?: string, encoding?: string): unknown {
  if (typeof contentText !== "string") {
    return undefined;
  }

  const decoded = encoding === "base64"
    ? Buffer.from(contentText, "base64").toString("utf8")
    : contentText;

  try {
    return JSON.parse(decoded);
  } catch {
    return undefined;
  }
}
