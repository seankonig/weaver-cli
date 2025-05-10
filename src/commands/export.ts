import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";
import prompts from "prompts";
import { Task } from "../types/task";
import { ProjectContext } from "../types/context";
import { loadAiHelpMarkdown } from "../helpers";

export async function exportProject(projectName: string, format?: "md" | "json") {
  const contextPath = path.resolve("projects", projectName, "context.json");
  const tasksPath = path.resolve("projects", projectName, "tasks.json");

  if (!fs.existsSync(contextPath) || !fs.existsSync(tasksPath)) {
    console.log(chalk.red("❌ Missing context or tasks."));
    return;
  }

  // Prompt for format if not passed
  if (!format) {
    const res = await prompts({
      type: "select",
      name: "format",
      message: "Choose export format",
      choices: [
        { title: "Markdown (.md)", value: "md" },
        { title: "JSON (.json)", value: "json" },
      ],
    });
    format = res.format;
    if (!format) {
      console.log(chalk.yellow("⚠️ Export cancelled."));
      return;
    }
  }

  const defaultPath = path.join(os.homedir(), "weave-exports", `${projectName}.${format}`);

  const { location } = await prompts({
    type: "text",
    name: "location",
    message: "Where should the export file be saved?",
    initial: defaultPath,
  });

  if (!location) {
    console.log(chalk.yellow("⚠️ Export cancelled."));
    return;
  }

  const outPath = resolveExportPath(location);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  const context: ProjectContext = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
  const tasks: Task[] = JSON.parse(fs.readFileSync(tasksPath, "utf-8"));

  if (format === "json") {
    fs.writeFileSync(outPath, JSON.stringify({ context, tasks }, null, 2));
  } else {
    const markdown = generateMarkdown(projectName, context, tasks);
    fs.writeFileSync(outPath, markdown);
  }

  console.log(chalk.green(`✅ Project exported to ${outPath}`));
}

function generateMarkdown(name: string, context: ProjectContext, tasks: Task[]): string {
  const lines: string[] = [];

  // Header
  lines.push(`# 📁 Project: ${name}`);
  lines.push(`> ${context.description.trim()}`);
  lines.push("");
  lines.push(`**Goal:** ${context.goals[0]}`);
  lines.push(`**Tools:** \`${context.tools.join("`, `")}\``);
  lines.push(`**Constraints:** ${context.constraints.join("; ")}`);
  lines.push("\n---\n");

  // Tasks Section
  lines.push(`## ✅ Task Overview`);

  if (!tasks.length) {
    lines.push(`_No tasks available._\n`);
    return lines.join("\n");
  }

  tasks.forEach((task, index) => {
    lines.push(`### ${index + 1}. ${task.title}`);
    lines.push(`**Status:** ${renderStatusBadge(task.status)}`);
    if (task.description) {
      lines.push(`${task.description.trim()}`);
    }

    const taskHelp = loadAiHelpMarkdown(name, task.title);
    if (taskHelp) {
      lines.push(`\n**🧠 AI Help:**\n`);
      lines.push(taskHelp);
    }

    if (task.subtasks?.length) {
      lines.push("\n**Subtasks:**");
      task.subtasks.forEach((sub) => {
        const box = sub.status === "done" ? "x" : sub.status === "in_progress" ? "-" : " ";
        lines.push(`- [${box}] ${sub.title}`);

        const subHelp = loadAiHelpMarkdown(name, sub.title);
        if (subHelp) {
          lines.push(`  > 💡`);
          lines.push(
            `\n${subHelp
              .split("\n")
              .map((line) => `    ${line}`)
              .join("\n")}`
          );
        }
      });
    }

    lines.push(""); // spacing between tasks
  });

  return lines.join("\n");
}

function renderStatusBadge(status: Task["status"]): string {
  switch (status) {
    case "done":
      return "🟢 `done`";
    case "in_progress":
      return "🟡 `in_progress`";
    case "not_started":
    default:
      return "⚪️ `not_started`";
  }
}

function resolveExportPath(inputPath: string): string {
  return path.resolve(inputPath.replace(/^~(?=$|\/|\\)/, os.homedir()));
}
