import { describe, expect, test } from "bun:test";
import { resolve } from "node:path";
import { executeCli } from "../src/cli";

const fixturePath = resolve(import.meta.dir, "fixtures", "sample.har");

describe("executeCli", () => {
  test("默认规则输出去重后的 path 列表", async () => {
    const result = await executeCli([fixturePath]);

    expect(result.exitCode).toBe(0);
    expect(result.stderr).toBe("");
    expect(result.stdout).toBe("/api/user/info\n/api/order/create\n/api/admin/report\n");
  });

  test("支持 where 表达式同时匹配 body 与 http", async () => {
    const result = await executeCli([
      fixturePath,
      "--where",
      "body.status == 1 and http.status == 403",
    ]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toBe("/api/admin/report\n");
  });

  test("支持 help 子命令", async () => {
    const result = await executeCli(["help"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Usage:");
    expect(result.stdout).toContain("--where");
  });

  test("支持输出 fish completion", async () => {
    const result = await executeCli(["completions", "fish"]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("complete -c har-cli");
    expect(result.stdout).toContain("-l where");
  });
});
