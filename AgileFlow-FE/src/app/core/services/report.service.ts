import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportService {
  constructor(private http: HttpClient) { }

  download(projectId: string, format: 'pdf' | 'excel'): Observable<Blob> {
    return this.http.get(
      `${environment.apiUrl}/projects/${projectId}/reports/${format}`,
      { responseType: 'blob' }
    );
  }
}
