# 🧵 Weave CLI

[![npm version](https://img.shields.io/npm/v/weaver-cli)](https://www.npmjs.com/package/weaver-cli)

**AI-first project scaffolding and task breakdown tool**  
Powered by OpenAI · Designed for developers

> ⚠️ **Exploration Project:** Weave is a learning-driven CLI tool created to explore and understand the principles of the [Model Context Protocol (MCP)](https://modelcontextprotocol.io).  
> It demonstrates how AI-first workflows can be modeled with local context, structured tasks, and generative assistance — all from your terminal.

---

## ✨ What is Weave?

Weave helps you think and build in collaboration with AI. It’s a CLI for developers who want to:

- ✅ Create structured AI-ready projects
- ✅ Generate tasks and subtasks using OpenAI
- ✅ Get implementation help and starter code with `ai-help`
- ✅ Export context and task progress in Markdown or JSON
- ✅ Store local project state in `.mcp/` with multi-project switching

---

## 🚀 Getting Started

### Install globally

```bash
npm install -g weave-cli
```

### Initialize your workspace

```bash
weave init
```

Creates:

- `.mcp/` directory to track selected project
- `projects/` directory to store your work
- `~/.weave/config.json` for your API key

### Set your OpenAI API key

```bash
weave config
```

---

## 🛠️ Workflow Overview

### Create a new project

```bash
weave new voyager
```

### Generate top-level tasks using GPT

```bash
weave generate-tasks
```

### Break down a task into subtasks

```bash
weave breakdown 1
```

### Get AI help or starter code for a task

```bash
weave ai-help 1.2
```

AI help is saved to both `tasks.json` and as Markdown in `ai-help/`

---

## 📦 Export Your Project

Export as Markdown or JSON:

```bash
weave export md
weave export json
```

Includes:

- Project context
- Tasks + subtasks
- Task status
- Embedded GPT help (Markdown only)

---

## 🧠 Data Structure

All data is stored locally:

```
.
├── .mcp/                       # Tracks current project
├── projects/
│   └── <projectName>/
│       ├── context.json
│       ├── tasks.json
│       └── ai-help/
│           └── *.md           # GPT responses per task
└── ~/.weave/config.json       # API key and optional project root
```

---

## 🤝 Contributing

This is an evolving learning tool — feedback and contributions welcome as we refine the developer-AI collaboration story.

---

## 🏷 Version

**v1.0.0** — Exploration Release

- AI-first project creation
- GPT-generated task planning
- Implementation advice and code assistance
- Context-aware Markdown exports
