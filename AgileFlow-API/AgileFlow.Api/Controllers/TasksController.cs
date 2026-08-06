using AgileFlow.Api.Hubs;
using AgileFlow.Application.DTOs;
using AgileFlow.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgileFlow.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly TaskUseCases _useCases;
    private readonly BoardNotificationService _notifications;

    public TasksController(TaskUseCases useCases, BoardNotificationService notifications)
    {
        _useCases = useCases;
        _notifications = notifications;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(Guid projectId)
    {
        var result = await _useCases.GetByProjectAsync(projectId);
        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateTaskRequest request)
    {
        var result = await _useCases.CreateAsync(request);
        await _notifications.NotifyTaskCreated(projectId.ToString(), result);
        return CreatedAtAction(nameof(GetAll), new { projectId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid projectId, Guid id, [FromBody] UpdateTaskRequest request)
    {
        var result = await _useCases.UpdateAsync(id, request);
        if (result is null) return NotFound();
        await _notifications.NotifyTaskUpdated(projectId.ToString(), result);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid projectId, Guid id)
    {
        var deleted = await _useCases.DeleteAsync(id);
        if (!deleted) return NotFound();
        await _notifications.NotifyTaskDeleted(projectId.ToString(), id);
        return NoContent();
    }

    [HttpPut("{id}/move")]
    public async Task<IActionResult> Move(Guid projectId, Guid id, [FromBody] MoveTaskRequest request)
    {
        var result = await _useCases.MoveAsync(id, request);
        if (result is null) return NotFound();
        await _notifications.NotifyTaskMoved(projectId.ToString(), result);
        return Ok(result);
    }

    [HttpPut("column/{columnId}/reorder")]
    public async Task<IActionResult> Reorder(Guid projectId, Guid columnId, [FromBody] ReorderTasksRequest request)
    {
        await _useCases.ReorderAsync(columnId, request);
        return NoContent();
    }
}