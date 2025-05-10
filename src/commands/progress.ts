import fs from "fs";
import path from "path";
import chalk from "chalk";
import { Task } from "../types/task";

export function showProgress(projectName: string, taskId?: number) {
  const tasksPath = path.resolve("projects", projectName, "tasks.json");

  if (!fs.existsSync(tasksPath)) {
    console.log(chalk.yellow(`⚠️ No tasks.json found for project "${projectName}".`));
    return;
  }

  const tasks: Task[] = JSON.parse(fs.readFileSync(tasksPath, "utf-8"));

  if (taskId !== undefined) {
    const task = tasks[taskId - 1];
    if (!task) {
      console.log(chalk.red(`❌ Task ${taskId} not found.`));
      return;
    }

    return showTaskProgress(task, `${taskId}. ${task.title}`);
  }

  console.log(chalk.cyan(`\n📈 Progress for ${projectName}:\n`));

  tasks.forEach((task, index) => {
    if (task.subtasks && task.subtasks.length > 0) {
      showTaskProgress(task, `${index + 1}. ${task.title}`);
    }
  });

  console.log("");
}

function showTaskProgress(task: Task, label: string) {
  const subtasks = task.subtasks ?? [];
  const total = subtasks.length;
  const completed = subtasks.filter((t) => t.status === "done").length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const bar = drawProgressBar(percent);
  console.log(`${chalk.bold(label)}\n${bar} ${chalk.gray(`${percent}%`)} (${completed}/${total})\n`);
}

function drawProgressBar(percent: number, width = 20) {
  const filled = Math.round((percent / 100) * width);
  const empty = width - filled;
  return chalk.green("[" + "■".repeat(filled) + chalk.gray("·".repeat(empty)) + "]");
}
