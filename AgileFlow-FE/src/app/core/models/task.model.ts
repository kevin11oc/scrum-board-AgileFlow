export interface Task {
  id: string;
  title: string;
  description: string;
  priority: string;
  columnId: string;
  assigneeId?: string;
  assigneeName?: string;
  order: number;
  createdAt: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  priority: string;
  columnId: string;
  assigneeId?: string;
}

export interface UpdateTaskRequest {
  title: string;
  description: string;
  priority: string;
  assigneeId?: string;
}

export interface MoveTaskRequest {
  newColumnId: string;
  newOrder: number;
}

export interface ReorderTasksRequest {
  orderedIds: string[];
}
