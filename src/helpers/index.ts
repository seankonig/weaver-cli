import fs from "fs";
import os from "os";
import path from "path";

export function readJson<T>(filePath: string): T {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function getProject(): string {
  return fs.readFileSync(".mcp/current-project.txt", "utf-8").trim();
}

export function expandTilde(pathStr: string): string {
  if (pathStr.startsWith("~")) {
    return pathStr.replace("~", os.homedir());
  }
  return pathStr;
}

export function saveAiHelpMarkdown(projectName: string, taskTitle: string, content: string) {
  const helpDir = path.join("projects", projectName, "ai-help");
  fs.mkdirSync(helpDir, { recursive: true });

  const taskSlug = taskTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filePath = path.join(helpDir, `${taskSlug}.md`);
  fs.writeFileSync(filePath, content);
}

export function loadAiHelpMarkdown(projectName: string, taskTitle: string): string | null {
  const slug = taskTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const filePath = path.join("projects", projectName, "ai-help", `${slug}.md`);

  if (fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, "utf-8");
  }

  return null;
}
