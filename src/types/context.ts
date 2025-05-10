export interface ContextMeta {
  current_task: string;
  history: string[];
}

export interface Agent {
  id?: string;
  name?: string;
  type?: string;
  // Add more as needed later
}

export interface User {
  id?: string;
  name?: string;
  role?: string;
  // Extend with email, org, etc. later
}

export interface ProjectContext {
  name: string;
  description: string;
  goals: string[];
  tools: string[];
  constraints: string[];
  users: User[];
  agents: Agent[];
  context: ContextMeta;
}
