import path from "path";
import { ensureDir, writeJson } from "../lib/fs";


export function initProjectStructure(
  projectPath: string,
  name: string,
  details: {
    description: string;
    goal: string;
    tools: string[];
    constraints: string[];
  }
) {
  ensureDir(projectPath);
  ensureDir(path.join(projectPath, "history"));

  writeJson(path.join(projectPath, "context.json"), {
    name,
    description: details.description,
    goals: [details.goal],
    tools: details.tools,
    constraints: details.constraints,
    users: [],
    agents: [],
    context: { current_task: "", history: [] },
  });

  writeJson(path.join(projectPath, "tasks.json"), []);
}
