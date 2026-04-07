/**
 * 生成 CLI 帮助文本，统一维护参数说明与示例。
 */
export function renderHelp(programName = "har-cli"): string {
  return [
    `Usage:`,
    `  ${programName} <har-file...> [--where <expr>] [--select <mode>] [--prefix-depth <n>] [--format <mode>] [--no-dedupe]`,
    `  ${programName} help`,
    `  ${programName} completions fish`,
    ``,
    `Options:`,
    `  --where <expr>         过滤表达式，默认: http.status == 403 or body.status == 1`,
    `  --select <mode>        输出模式: path | url | prefix，默认 path`,
    `  --prefix-depth <n>     prefix 模式下按前 n 段聚合，默认 2`,
    `  --format <mode>        输出格式: text | json，默认 text`,
    `  --no-dedupe            关闭去重输出`,
    `  -h, --help             显示帮助`,
    ``,
    `Examples:`,
    `  ${programName} sample.har`,
    `  ${programName} sample.har --where 'body.status == 1 and http.status == 403'`,
    `  ${programName} sample.har --select prefix --prefix-depth 2`,
  ].join("\n");
}
