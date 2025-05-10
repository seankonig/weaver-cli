import fs from "fs";

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getProject(): string {
  return fs.readFileSync(".mcp/current-project.txt", "utf-8").trim();
}
