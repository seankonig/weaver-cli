import chalk from "chalk";
import fs from "fs";
import os from "os";
import path from "path";

const configDir = path.join(os.homedir(), ".weave");
const configPath = path.join(configDir, "config.json");

type Config = {
  openaiApiKey: string;
};

export function getConfig(): Config | null {
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, "utf-8"));
}

export function ensureApiKey(): string {
  const apiKey = getOpenAIKey();
  if (!apiKey) {
    console.log(
      chalk.red("❌ OpenAI API key not found.\n") +
        chalk.gray("Run ") +
        chalk.cyan("weave config") +
        chalk.gray(" to set it.")
    );
    process.exit(1);
  }
  return apiKey;
}

export function setConfig(config: Config) {
  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
}

export function getOpenAIKey(): string | null {
  const config = getConfig();
  return config?.openaiApiKey ?? null;
}
