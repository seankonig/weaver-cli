import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Task } from "../types/task";
import { readJson } from "../helpers";

export function listTasks(projectName: string, taskId?: number) {
  const tasksPath = path.resolve("projects", projectName, "tasks.json");

  if (!fs.existsSync(tasksPath)) {
    console.log(chalk.yellow(`⚠️ No tasks.json found for project "${projectName}".`));
    return;
  }

  const tasks: Task[] = readJson<Task[]>(tasksPath);

  if (taskId !== undefined) {
    const task = tasks[taskId - 1];
    if (!task) {
      console.log(chalk.red(`❌ Task ${taskId} not found.`));
      return;
    }

    console.log(chalk.cyan(`\n📂 Subtasks for: ${task.title}\n`));

    if (!task.subtasks || task.subtasks.length === 0) {
      console.log(chalk.gray("📭 No subtasks defined."));
      return;
    }

    task.subtasks.forEach((sub, index) => {
      const statusColor = getStatusColor(sub.status);
      console.log(`${chalk.dim(` ${index + 1}.`)} ${sub.title} ${statusColor(`[${sub.status}]`)}`);
    });

    console.log("");
    return;
  }

  // list all top-level tasks
  console.log(chalk.cyan(`\n📋 Tasks for ${projectName}:\n`));

  tasks.forEach((task, index) => {
    const statusColor = getStatusColor(task.status);
    const subtaskCount = task.subtasks?.length || 0;
    const subtaskHint = subtaskCount > 0 ? chalk.gray(` (+${subtaskCount} subtasks)`) : "";

    const prefix = `${chalk.bold(`${index + 1}.`)} ${task.title} ${statusColor(`[${task.status}]`)}${subtaskHint}`;
    console.log(prefix);

    // 🔍 Detect "should be done"
    if (subtaskCount > 0 && task.status !== "done" && task.subtasks?.every((sub) => sub.status === "done")) {
      console.log(chalk.yellow("   ⚠️ All subtasks complete — consider marking this task as done."));
    }
  });

  console.log("");
  console.log("Run `weave list <taskId>` to see subtasks for a specific task.");
  console.log("Run `weave breakdown <taskId>` to generate subtasks for a top-level task.");
  console.log("");
}

function getStatusColor(status: Task["status"]) {
  switch (status) {
    case "done":
      return chalk.green;
    case "in_progress":
      return chalk.yellow;
    case "not_started":
      return chalk.blue;
    default:
      return chalk.white;
  }
}
