export interface Project {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

export interface CreateProjectRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface UpdateProjectRequest {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
}

export interface PagedResult<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
}