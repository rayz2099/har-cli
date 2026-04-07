export type SelectMode = "path" | "url" | "prefix";

export type OutputFormat = "text" | "json";

export interface CliResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ScanOptions {
  files: string[];
  where: string;
  select: SelectMode;
  prefixDepth: number;
  format: OutputFormat;
  dedupe: boolean;
}

export interface NormalizedEntry {
  sourceFile: string;
  method: string;
  url: string;
  path: string;
  httpStatus: number;
  mimeType?: string;
  body: unknown;
}
