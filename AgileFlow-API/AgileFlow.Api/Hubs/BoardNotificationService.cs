using AgileFlow.Application.DTOs;
using Microsoft.AspNetCore.SignalR;

namespace AgileFlow.Api.Hubs;

public class BoardNotificationService
{
    private readonly IHubContext<BoardHub> _hubContext;

    public BoardNotificationService(IHubContext<BoardHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task NotifyTaskCreated(string projectId, TaskDto task)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("TaskCreated", task);
    }

    public async Task NotifyTaskUpdated(string projectId, TaskDto task)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("TaskUpdated", task);
    }

    public async Task NotifyTaskDeleted(string projectId, Guid taskId)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("TaskDeleted", taskId);
    }

    public async Task NotifyTaskMoved(string projectId, TaskDto task)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("TaskMoved", task);
    }

    public async Task NotifyColumnCreated(string projectId, ColumnDto column)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("ColumnCreated", column);
    }

    public async Task NotifyColumnUpdated(string projectId, ColumnDto column)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("ColumnUpdated", column);
    }

    public async Task NotifyColumnDeleted(string projectId, Guid columnId)
    {
        await _hubContext.Clients.Group($"board-{projectId}")
            .SendAsync("ColumnDeleted", columnId);
    }
}