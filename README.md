# Weave CLI — AI-First Project Tracker

## 🚀 Overview
**Weave** is a local, open-source CLI tool for managing AI-first projects using structured context. It helps you:
- Define clear project goals
- Use AI to break down tasks and subtasks
- Get help from LLMs contextually (code, tests, plans)
- Track progress and collaborate with AI like a teammate

You own your data. You bring your own API key.

---

## 📁 File Structure
```bash
weave-cli/
├── projects/
│   ├── axis-pms/
│   │   ├── context.json
│   │   ├── tasks.json
│   │   └── history/
│   │       └── 2025-05-09.md
├── .mcp/
│   └── current-project.txt
├── prompts/
│   ├── generate-tasks.txt
│   ├── breakdown-task.txt
│   ├── ai-help.txt
│   ├── test-plan.txt
│   ├── commit-message.txt
│   └── translate-code.txt
├── src/
│   ├── commands/
│   │   ├── new.ts
│   │   ├── use.ts
│   │   ├── generateTasks.ts
│   │   ├── addTask.ts
│   │   ├── breakdown.ts
│   │   ├── aiHelp.ts
│   │   ├── testPlan.ts
│   │   └── commit.ts
│   ├── lib/
│   │   ├── context.ts
│   │   ├── tasks.ts
│   │   ├── openai.ts
│   │   └── utils.ts
│   └── index.ts
├── .env.example
├── weave.config.json
├── package.json
└── README.md
```

---

## 🌱 MVP Commands

```bash
weave new <project-name>
weave use <project-name>
weave status
weave generate-tasks
weave add-task
weave breakdown <task-id>
weave ai-help <task-id>
weave test-plan <task-id>
weave commit <task-id>
```

Each command uses the MCP context from `context.json` and task data from `tasks.json`.

---

## 🔐 Environment
```env
# .env.example
OPENAI_API_KEY=sk-...
```

---

## ✨ Philosophy
- AI is not an assistant — it’s a collaborator
- Structure everything for portability and clarity
- No backend required, but extensible to one
- CLI-first, dev-first, open-first

---

Let’s get the repo scaffolding going next!
