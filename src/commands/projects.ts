import fs from "fs";
import path from "path";
import chalk from "chalk";

export function listProjects() {
  const projectsDir = path.resolve("projects");
  const current = fs.existsSync(".mcp/current-project.txt")
    ? fs.readFileSync(".mcp/current-project.txt", "utf-8").trim()
    : null;

  if (!fs.existsSync(projectsDir)) {
    console.log(chalk.yellow("⚠️ No projects found."));
    return;
  }

  const dirs = fs.readdirSync(projectsDir).filter((entry) => fs.statSync(path.join(projectsDir, entry)).isDirectory());

  if (dirs.length === 0) {
    console.log(chalk.gray("📭 No projects have been created yet."));
    return;
  }

  console.log(chalk.cyan("🧵 Your Weave Projects:\n"));

  dirs.forEach((name) => {
    const isActive = name === current;
    const prefix = isActive ? chalk.green("→") : " ";
    const label = isActive ? chalk.bold(name) : chalk.white(name);
    console.log(`${prefix} ${label}`);
  });
  console.log("");
  console.log(chalk.gray("Use `weave use <project>` to switch to a different project."));
  console.log(chalk.gray("Use `weave new <project>` to create a new project."));
  console.log("");
}
