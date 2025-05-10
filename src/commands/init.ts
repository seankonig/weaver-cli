import fs from "fs";
import path from "path";
import os from "os";
import chalk from "chalk";

export function initializeWorkspace() {
  const mcpDir = path.resolve(".mcp");
  const projectsDir = path.resolve("projects");
  const configDir = path.join(os.homedir(), ".weave");
  const configPath = path.join(configDir, "config.json");

  // Create .mcp
  if (!fs.existsSync(mcpDir)) {
    fs.mkdirSync(mcpDir);
    fs.writeFileSync(path.join(mcpDir, "current-project.txt"), "");
    console.log(chalk.green("✔ Created .mcp/ and initialized current-project.txt"));
  } else {
    console.log(chalk.gray("ℹ️ .mcp/ already exists"));
  }

  // Create projects/
  if (!fs.existsSync(projectsDir)) {
    fs.mkdirSync(projectsDir);
    console.log(chalk.green("✔ Created projects/ directory"));
  } else {
    console.log(chalk.gray("ℹ️ projects/ already exists"));
  }

  // Create ~/.weave/config.json if missing
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir);
  }

  if (!fs.existsSync(configPath)) {
    fs.writeFileSync(configPath, JSON.stringify({ openaiApiKey: "", projectRoot: process.cwd() }, null, 2));
    console.log(chalk.green(`✔ Created default config at ${configPath}`));
  } else {
    console.log(chalk.gray(`ℹ️ Config already exists at ${configPath}`));
  }

  console.log(
    chalk.blue("\n🚀 Workspace ready! Use ") + chalk.cyan("weave new <project>") + chalk.blue(" to get started.")
  );
}
