import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Column, CreateColumnRequest, ReorderColumnsRequest, UpdateColumnRequest } from '../models/column.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ColumnService {
  private url(projectId: string) {
    return `${environment.apiUrl}/projects/${projectId}/columns`;
  }

  constructor(private http: HttpClient) { }

  getAll(projectId: string): Observable<Column[]> {
    return this.http.get<Column[]>(this.url(projectId));
  }

  create(projectId: string, request: CreateColumnRequest): Observable<Column> {
    return this.http.post<Column>(this.url(projectId), request);
  }

  update(projectId: string, id: string, request: UpdateColumnRequest): Observable<Column> {
    return this.http.put<Column>(`${this.url(projectId)}/${id}`, request);
  }

  delete(projectId: string, id: string): Observable<void> {
    return this.http.delete<void>(`${this.url(projectId)}/${id}`);
  }

  reorder(projectId: string, request: ReorderColumnsRequest): Observable<void> {
    return this.http.put<void>(`${this.url(projectId)}/reorder`, request);
  }
}
