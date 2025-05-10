import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { readJson } from "../helpers";
import { Task } from "../types/task";
import { ContextMeta, ProjectContext } from "../types/context";
import { ensureApiKey } from "../lib/config";
import { Configuration, OpenAIApi } from "openai";
import { getOpenAI } from "../lib/openai";

export async function breakdownTask(projectName: string, taskId: number) {
  const openai = getOpenAI();
  const contextPath = path.resolve("projects", projectName, "context.json");
  const tasksPath = path.resolve("projects", projectName, "tasks.json");

  if (!fs.existsSync(contextPath) || !fs.existsSync(tasksPath)) {
    console.error(chalk.red("❌ Missing context.json or tasks.json."));
    return;
  }

  const context = readJson<ProjectContext>(contextPath);
  const tasks = readJson<Task[]>(tasksPath);

  const task = tasks[taskId - 1];
  if (!task) {
    console.error(chalk.red(`❌ Task ${taskId} not found.`));
    return;
  }

  const spinner = ora(`🧠 Breaking down: "${task.title}"...`).start();

  const prompt = `
        You are a senior technical planner.

        Break down the following high-level task into 3–6 subtasks that are clearly actionable.

        Project: ${context.name}
        Goal: ${context.goals[0]}
        Main Task: ${task.title}

        Respond in this format:
        [
        { "title": "...", "status": "not_started" },
        ...
        ]
  `.trim();

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const result = completion.data.choices[0].message?.content;
    const subtasks = JSON.parse(result || "[]");

    task.subtasks = subtasks;
    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));

    spinner.succeed("✅ Subtasks added!");
  } catch (err: any) {
    spinner.fail("❌ Failed to break down task.");
    console.error(err.message);
  }
}
