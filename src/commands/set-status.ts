import fs from "fs";
import path from "path";
import chalk from "chalk";
import prompts from "prompts";
import { Task, TaskStatus } from "../types/task";
import { readJson } from "../helpers";

export async function setTaskStatus(projectName: string, taskRef: string) {
  const tasksPath = path.resolve("projects", projectName, "tasks.json");
  const parts = taskRef.split(".").map((n) => parseInt(n, 10));

  if (parts.some(isNaN)) {
    console.log(chalk.red(`❌ Invalid task reference: "${taskRef}"`));
    return;
  }

  const [taskIndex, subIndex] = parts.map((n) => n - 1);

  if (!fs.existsSync(tasksPath)) {
    console.log(chalk.red("❌ tasks.json not found."));
    return;
  }

  const tasks: Task[] = readJson<Task[]>(tasksPath);

  const parentTask = tasks[taskIndex];
  if (!parentTask) {
    console.log(chalk.red(`❌ Task ${parts[0]} not found.`));
    return;
  }

  let targetTask = parentTask;

  if (typeof subIndex === "number") {
    if (!parentTask.subtasks || !parentTask.subtasks[subIndex]) {
      console.log(chalk.red(`❌ Subtask ${parts[1]} not found under task ${parts[0]}.`));
      return;
    }
    targetTask = parentTask.subtasks[subIndex];
  }

  const statusPrompt = await prompts({
    type: "select",
    name: "status",
    message: `Update status for "${targetTask.title}"`,
    choices: [
      { title: "Not Started", value: "not_started" },
      { title: "In Progress", value: "in_progress" },
      { title: "Done", value: "done" },
    ],
  });

  if (!statusPrompt.status) return;
  targetTask.status = statusPrompt.status;

  // Auto-update parent if needed
  if (typeof subIndex === "number" && parentTask.subtasks) {
    const allDone = parentTask.subtasks.every((t) => t.status === "done");
    const anyInProgress = parentTask.subtasks.some((t) => t.status === "in_progress");
    parentTask.status = allDone ? "done" : anyInProgress ? "in_progress" : "not_started";
  }

  fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
  console.log(chalk.green(`✔ Status updated for task ${taskRef}.`));
}
