import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { Subject } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';
import { Task } from '../models/task.model';
import { Column } from '../models/column.model';

@Injectable({ providedIn: 'root' })
export class SignalRService {
  public hubConnection: signalR.HubConnection | null = null;

  taskCreated$ = new Subject<Task>();
  taskUpdated$ = new Subject<Task>();
  taskDeleted$ = new Subject<string>();
  taskMoved$ = new Subject<Task>();
  columnCreated$ = new Subject<Column>();
  columnUpdated$ = new Subject<Column>();
  columnDeleted$ = new Subject<string>();

  constructor(private authService: AuthService) { }

  startConnection(): void {
    const token = this.authService.getToken();
    if (!token) return;

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${environment.apiUrl.replace('/api', '')}/hubs/board`, {
        accessTokenFactory: () => token
      })
      .withAutomaticReconnect()
      .build();

    this.registerEvents();

    this.hubConnection.start().catch(err => console.error('SignalR error:', err));
  }

  joinBoard(projectId: string): void {
    this.hubConnection?.invoke('JoinBoard', projectId);
  }

  leaveBoard(projectId: string): void {
    this.hubConnection?.invoke('LeaveBoard', projectId);
  }

  stopConnection(): void {
    this.hubConnection?.stop();
  }

  private registerEvents(): void {
    if (!this.hubConnection) return;

    this.hubConnection.on('TaskCreated', (task: Task) => this.taskCreated$.next(task));
    this.hubConnection.on('TaskUpdated', (task: Task) => this.taskUpdated$.next(task));
    this.hubConnection.on('TaskDeleted', (id: string) => this.taskDeleted$.next(id));
    this.hubConnection.on('TaskMoved', (task: Task) => this.taskMoved$.next(task));
    this.hubConnection.on('ColumnCreated', (col: Column) => this.columnCreated$.next(col));
    this.hubConnection.on('ColumnUpdated', (col: Column) => this.columnUpdated$.next(col));
    this.hubConnection.on('ColumnDeleted', (id: string) => this.columnDeleted$.next(id));
  }
}
