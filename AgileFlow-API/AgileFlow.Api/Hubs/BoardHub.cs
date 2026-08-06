using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;

namespace AgileFlow.Api.Hubs;

[Authorize]
public class BoardHub : Hub
{
    public async Task JoinBoard(string projectId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"board-{projectId}");
    }

    public async Task LeaveBoard(string projectId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"board-{projectId}");
    }
}