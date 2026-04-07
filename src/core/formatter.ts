import { buildPrefix } from "./uri";
import type { NormalizedEntry, OutputFormat, SelectMode } from "./types";

/**
 * 将命中的 entry 渲染为 text/json 输出。
 */
export function formatEntries(
  entries: NormalizedEntry[],
  select: SelectMode,
  format: OutputFormat,
  dedupe: boolean,
  prefixDepth: number,
): string {
  if (format === "json") {
    const serialized = dedupe ? dedupeJsonEntries(entries, select, prefixDepth) : entries.map((entry) => toJsonEntry(entry, prefixDepth));
    return `${JSON.stringify(serialized, null, 2)}\n`;
  }

  const lines = entries.map((entry) => selectText(entry, select, prefixDepth));
  const rendered = dedupe ? Array.from(new Set(lines)) : lines;
  return rendered.length === 0 ? "" : `${rendered.join("\n")}\n`;
}

function dedupeJsonEntries(entries: NormalizedEntry[], select: SelectMode, prefixDepth: number): Array<Record<string, unknown>> {
  const seen = new Set<string>();
  const results: Array<Record<string, unknown>> = [];

  for (const entry of entries) {
    const key = selectText(entry, select, prefixDepth);
    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    results.push(toJsonEntry(entry, prefixDepth));
  }

  return results;
}

function toJsonEntry(entry: NormalizedEntry, prefixDepth: number): Record<string, unknown> {
  return {
    sourceFile: entry.sourceFile,
    method: entry.method,
    url: entry.url,
    path: entry.path,
    prefix: buildPrefix(entry.path, prefixDepth),
    httpStatus: entry.httpStatus,
    body: entry.body,
  };
}

function selectText(entry: NormalizedEntry, select: SelectMode, prefixDepth: number): string {
  switch (select) {
    case "url":
      return entry.url;
    case "prefix":
      return buildPrefix(entry.path, prefixDepth);
    case "path":
    default:
      return entry.path;
  }
}
