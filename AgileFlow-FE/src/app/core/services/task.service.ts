import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateTaskRequest, MoveTaskRequest, ReorderTasksRequest, Task, UpdateTaskRequest } from '../models/task.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private url(projectId: string) {
    return `${environment.apiUrl}/projects/${projectId}/tasks`;
  }

  constructor(private http: HttpClient) { }

  getAll(projectId: string): Observable<Task[]> {
    return this.http.get<Task[]>(this.url(projectId));
  }

  create(projectId: string, request: CreateTaskRequest): Observable<Task> {
    return this.http.post<Task>(this.url(projectId), request);
  }

  update(projectId: string, id: string, request: UpdateTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.url(projectId)}/${id}`, request);
  }

  delete(projectId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(projectId)}/${id}`);
  }

  move(projectId: string, id: string, request: MoveTaskRequest): Observable<Task> {
    return this.http.put<Task>(`${this.url(projectId)}/${id}/move`, request);
  }

  reorder(projectId: string, columnId: string, request: ReorderTasksRequest): Observable<void> {
    return this.http.put<void>(`${this.url(projectId)}/column/${columnId}/reorder`, request);
  }
}
