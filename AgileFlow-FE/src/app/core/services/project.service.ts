import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateProjectRequest, PagedResult, Project, UpdateProjectRequest } from '../models/project.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProjectService {
    private readonly url = `${environment.apiUrl}/projects`;

    constructor(private http: HttpClient) { }

    getAll(search?: string, page = 1, pageSize = 10): Observable<PagedResult<Project>> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        if (search) params = params.set('search', search);
        return this.http.get<PagedResult<Project>>(this.url, { params });
    }

    create(request: CreateProjectRequest): Observable<Project> {
        return this.http.post<Project>(this.url, request);
    }

    update(id: string, request: UpdateProjectRequest): Observable<Project> {
        return this.http.put<Project>(`${this.url}/${id}`, request);
    }

    delete(id: string): Observable<void> {
        return this.http.delete<void>(`${this.url}/${id}`);
    }
}