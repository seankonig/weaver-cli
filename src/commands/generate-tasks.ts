import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { Task } from "../types/task";
import { ensureApiKey } from "../lib/config";
import { Configuration, OpenAIApi } from "openai";
import { getOpenAI } from "../lib/openai";

export async function generateTasks(projectName: string) {
  const openai = getOpenAI();

  const projectPath = path.resolve("projects", projectName);
  const contextPath = path.join(projectPath, "context.json");
  const tasksPath = path.join(projectPath, "tasks.json");

  if (!fs.existsSync(contextPath)) {
    console.error(chalk.red("❌ context.json not found. Make sure you created the project first."));
    process.exit(1);
  }

  const context = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
  const spinner = ora("🤖 Generating tasks from project goal...").start();

  const prompt = `
    You are an expert technical planner.
    Given the following project context, generate a list of 5–10 high-level engineering tasks:

    Project Name: ${context.name}
    Description: ${context.description}
    Goal: ${context.goals[0]}
    Tools: ${context.tools.join(", ") || "none"}
    Constraints: ${context.constraints.join(", ") || "none"}

    Respond with a JSON array of task objects with this format:
    [{ "title": "...", "status": "not_started" }]
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5,
    });

    const response = completion.data.choices[0].message?.content;

    const tasks: Task[] = JSON.parse(response || "[]");
    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));
    spinner.succeed("✅ Tasks generated and saved to tasks.json!");
    console.log("");
    console.log("Run `weave list` to see the generated tasks.");
    console.log("You can also run `weave breakdown <taskId>` to generate subtasks for a specific task.");
    console.log("");
  } catch (err: any) {
    spinner.fail("❌ Failed to generate tasks.");
    console.error(err.message);
  }
}
