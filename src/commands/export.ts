import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { Task } from '../types/task';
import { ProjectContext } from '../types/context';

export async function exportProject(projectName: string, format?: 'md' | 'json') {
  const contextPath = path.resolve('projects', projectName, 'context.json');
  const tasksPath = path.resolve('projects', projectName, 'tasks.json');
  const outDir = path.resolve('exports');

  if (!fs.existsSync(contextPath) || !fs.existsSync(tasksPath)) {
    console.log(chalk.red('❌ Missing context or tasks.'));
    return;
  }

  if (!format) {
    const res = await prompts({
      type: 'select',
      name: 'format',
      message: 'Choose export format',
      choices: [
        { title: 'Markdown (.md)', value: 'md' },
        { title: 'JSON (.json)', value: 'json' }
      ]
    });
    format = res.format;
    if (!format) {
      console.log(chalk.yellow('⚠️ Export cancelled.'));
      return;
    }
  }

  const context: ProjectContext = JSON.parse(fs.readFileSync(contextPath, 'utf-8'));
  const tasks: Task[] = JSON.parse(fs.readFileSync(tasksPath, 'utf-8'));

  fs.mkdirSync(outDir, { recursive: true });

  const fileName = `${projectName}.${format}`;
  const outPath = path.join(outDir, fileName);

  if (format === 'json') {
    const exportData = { context, tasks };
    fs.writeFileSync(outPath, JSON.stringify(exportData, null, 2));
    console.log(chalk.green(`✅ Exported project to ${outPath}`));
    return;
  }

  const markdown = generateMarkdown(projectName, context, tasks);
  fs.writeFileSync(outPath, markdown);
  console.log(chalk.green(`✅ Exported project to ${outPath}`));
}

function generateMarkdown(name: string, context: ProjectContext, tasks: Task[]): string {
  const lines: string[] = [];

  lines.push(`# 📁 Project: ${name}`);
  lines.push(`> ${context.description}\n`);
  lines.push(`**Goal:** ${context.goals[0]}`);
  lines.push(`**Tools:** ${context.tools.join(', ')}`);
  lines.push(`**Constraints:** ${context.constraints.join(', ')}`);
  lines.push('\n---\n');

  lines.push(`## ✅ Tasks`);

  tasks.forEach((task, index) => {
    lines.push(`### ${index + 1}. ${task.title} \`${task.status}\``);
    if (task.subtasks?.length) {
      task.subtasks.forEach((sub, i) => {
        const check = sub.status === 'done' ? 'x' : ' ';
        lines.push(`- [${check}] ${sub.title}`);
      });
    }
    lines.push('');
  });

  return lines.join('\n');
}