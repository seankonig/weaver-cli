import fs from "fs";
import path from "path";
import chalk from "chalk";
import ora from "ora";
import { Task } from "../types/task";
import { ProjectContext } from "../types/context";
import { ensureApiKey } from "../lib/config";
import { Configuration, OpenAIApi } from "openai";
import { getOpenAI } from "../lib/openai";
import { saveAiHelpMarkdown } from "../helpers";

const openai = getOpenAI();

export async function aiHelp(projectName: string, taskRef: string) {
  const contextPath = path.resolve("projects", projectName, "context.json");
  const tasksPath = path.resolve("projects", projectName, "tasks.json");

  if (!fs.existsSync(contextPath) || !fs.existsSync(tasksPath)) {
    console.log(chalk.red("❌ Missing context or tasks."));
    return;
  }

  const context: ProjectContext = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
  const tasks: Task[] = JSON.parse(fs.readFileSync(tasksPath, "utf-8"));

  const parts = taskRef.split(".").map((n) => parseInt(n, 10) - 1);
  const [taskIndex, subIndex] = parts;

  const parentTask = tasks[taskIndex];
  if (!parentTask) {
    console.log(chalk.red(`❌ Task ${parts[0] + 1} not found.`));
    return;
  }

  let target = parentTask;
  if (typeof subIndex === "number") {
    if (!parentTask.subtasks || !parentTask.subtasks[subIndex]) {
      console.log(chalk.red(`❌ Subtask ${parts[1] + 1} not found.`));
      return;
    }
    target = parentTask.subtasks[subIndex];
  }

  const spinner = ora("💡 Generating AI help...").start();

  const prompt = `
You are an expert AI project assistant.

Given the context of a software project and a task, either:
1. Help clarify or define the task in more detail.
2. Suggest how to implement it.
3. If appropriate, generate helpful starter code.

# Project
${context.name}

# Goal
${context.goals[0]}

# Tools
${context.tools.join(", ")}

# Task
"${target.title}"

Respond with practical help. Include code if needed.
`;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-4",
      temperature: 0.4,
      messages: [
        { role: "system", content: "You are a technical project assistant." },
        { role: "user", content: prompt },
      ],
    });

    const content = completion.data.choices[0].message?.content?.trim() ?? "";

    spinner.stop();
    target.aiHelp = content;

    saveAiHelpMarkdown(projectName, target.title, content);

    fs.writeFileSync(tasksPath, JSON.stringify(tasks, null, 2));

    console.log(chalk.bold(`\n🧠 AI Help for "${target.title}":\n`));
    console.log(content);
    console.log("");
    console.log(chalk.green("✅ AI help saved to:"));
  } catch (err: any) {
    spinner.fail("❌ Failed to generate AI help.");
    console.error(err.message);
  }
}
