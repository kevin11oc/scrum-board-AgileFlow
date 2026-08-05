export interface Column {
  id: string;
  name: string;
  order: number;
  projectId: string;
}

export interface CreateColumnRequest {
  name: string;
  projectId: string;
}

export interface UpdateColumnRequest {
  name: string;
}

export interface ReorderColumnsRequest {
  orderedIds: string[];
}
