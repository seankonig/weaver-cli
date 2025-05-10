import fs from "fs";
import path from "path";
import chalk from "chalk";

export function showStatus() {
  const projectFile = path.resolve(".mcp/current-project.txt");

  if (!fs.existsSync(projectFile)) {
    console.log(chalk.yellow("⚠️ No project currently selected."));
    return;
  }

  const name = fs.readFileSync(".mcp/current-project.txt", "utf-8").trim();
  const contextPath = path.resolve("projects", name, "context.json");

  if (!fs.existsSync(contextPath)) {
    console.log(chalk.red(`❌ Project "${name}" is selected but has no context.json.`));
    return;
  }

  const context = JSON.parse(fs.readFileSync(contextPath, "utf-8"));
  console.log(chalk.bold(`\n📍 Current Project: ${chalk.cyan(name)}`));
  console.log(`📝 ${context.description}`);
  console.log(`🎯 Goal: ${chalk.gray(context.goals?.[0] || "No goal defined")}`);
  console.log("");
}
