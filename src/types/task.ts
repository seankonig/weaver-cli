export type TaskStatus = 'not_started' | 'in_progress' | 'done';

export interface Task {
  title: string;
  status: TaskStatus;
  description?: string;
  subtasks?: Task[];
}

