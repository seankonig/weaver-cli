#!/usr/bin/env node

import { Command } from "commander";
import chalk from "chalk";
import dotenv from "dotenv";
import { createProject } from "./project";
import { useProject } from "./commands/use";
import { listProjects } from "./commands/projects";
import { listTasks } from "./commands/list";
import { generateTasks } from "./commands/generate-tasks";
import fs from "fs";
import { showStatus } from "./commands/status";
import { breakdownTask } from "./commands/breakdown";
import { getProject } from "./helpers";
import { showProgress } from "./commands/progress";
import { setTaskStatus } from "./commands/set-status";
import { configureWeave } from "./commands/configure";
import { exportProject } from "./commands/export";
dotenv.config();

const program = new Command();

program.name("weave").description(chalk.cyan("🧵 Weave — AI-First Project CLI")).version("0.1.0");

// Future: dynamically load command modules
program
  .command("config")
  .description("Set your OpenAI API key")
  .action(() => {
    configureWeave();
  });

program
  .command("new <name>")
  .description("Create a new project")
  .action(async (name) => {
    try {
      const projectPath = await createProject(name);
      console.log(chalk.green(`✔ Project setup complete at ${projectPath}`));
    } catch (err: any) {
      console.error(chalk.red(err.message));
    }
  });

program
  .command("projects")
  .description("List all known projects")
  .action(() => {
    listProjects();
  });

program
  .command("status")
  .description("Show currently selected project and goal")
  .action(() => {
    showStatus();
  });

program
  .command("list [id]")
  .description("List tasks or subtasks if a task ID is provided")
  .action((id?: string) => {
    const currentProject = getProject();
    listTasks(currentProject, id ? parseInt(id, 10) : undefined);
  });

program
  .command("use <name>")
  .description("Switch to an existing project")
  .action((name) => {
    useProject(name);
  });

program
  .command("generate-tasks")
  .description("Generate a list of tasks from project context")
  .action(() => {
    const currentProject = getProject();

    generateTasks(currentProject);
  });

program
  .command("breakdown <taskId>")
  .description("Generate subtasks for a top-level task")
  .action((taskId: string) => {
    const currentProject = getProject();
    breakdownTask(currentProject, parseInt(taskId, 10));
  });

program
  .command("progress [id]")
  .description("Show task or project-wide progress")
  .action((id?: string) => {
    const currentProject = getProject();
    showProgress(currentProject, id ? parseInt(id, 10) : undefined);
  });

program
  .command("set-status <id>")
  .description("Update the status of a task or subtask (e.g. 2 or 2.1)")
  .action((ref: string) => {
    const currentProject = getProject();
    setTaskStatus(currentProject, ref); // ✅ one ref only
  });

program
  .command("export [format]")
  .description("Export project as markdown or JSON")
  .action((format?: string) => {
    const currentProject = fs.readFileSync(".mcp/current-project.txt", "utf-8").trim();

    if (format && !["md", "json"].includes(format)) {
      console.log(chalk.red('❌ Invalid format. Use "md" or "json".'));
      return;
    }

    exportProject(currentProject, format as "md" | "json" | undefined);
  });

program.parse(process.argv);
