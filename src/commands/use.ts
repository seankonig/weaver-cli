import fs from 'fs';
import path from 'path';
import chalk from 'chalk';

export function useProject(name: string) {
  const projectPath = path.resolve('projects', name);
  const configDir = path.resolve('.mcp');

  if (!fs.existsSync(projectPath)) {
    console.error(chalk.red(`❌ Project "${name}" does not exist.`));
    process.exit(1);
  }

  fs.mkdirSync(configDir, { recursive: true });
  fs.writeFileSync(path.join(configDir, 'current-project.txt'), name);
  console.log(chalk.green(`✔ Now using project: ${name}`));
}