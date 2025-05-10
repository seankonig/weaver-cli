import path from "path";
import fs from "fs";
import ora from "ora";
import chalk from "chalk";
import boxen from "boxen";
import { initProjectStructure } from "./init.js";
import { promptForProjectDetails } from "./prompts.js";

export async function createProject(name: string): Promise<string> {
  const projectPath = path.resolve("projects", name);
  if (fs.existsSync(projectPath)) {
    throw new Error(`🚫 Project "${name}" already exists.`);
  }

  const details = await promptForProjectDetails();

  const spinner = ora("🧵 Weaving your project...").start();
  try {
    initProjectStructure(projectPath, name, details);
    spinner.succeed("✨ Context saved!");

    console.log(
      boxen(
        chalk.green(`🎉 Project '${name}' created!\n\n`) +
          chalk.white(`📝 Description: `) +
          chalk.gray(details.description) +
          "\n" +
          chalk.white(`🎯 Goal: `) +
          chalk.gray(details.goal) +
          "\n" +
          chalk.white(`🛠 Tools: `) +
          chalk.gray(details.tools.join(", ")) +
          "\n" +
          chalk.white(`⚠️  Constraints: `) +
          chalk.gray(details.constraints.join(", ")) +
          "\n\n" +
          chalk.cyan(`→ Run \`weave generate-tasks\` to get started.`),
        { padding: 1, borderStyle: "round", borderColor: "cyan" }
      )
    );
  } catch (err) {
    spinner.fail("❌ Project creation failed");
    throw err;
  }

  const mcpDir = path.resolve(".mcp");
  const projectTracker = path.join(mcpDir, "current-project.txt");

  fs.mkdirSync(mcpDir, { recursive: true });
  fs.writeFileSync(projectTracker, name);

  return projectPath;
}
