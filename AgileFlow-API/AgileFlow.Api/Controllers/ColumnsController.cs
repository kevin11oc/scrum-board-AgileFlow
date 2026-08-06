using AgileFlow.Api.Hubs;
using AgileFlow.Application.DTOs;
using AgileFlow.Application.UseCases;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AgileFlow.Api.Controllers;

[ApiController]
[Route("api/projects/{projectId}/columns")]
[Authorize]
public class ColumnsController : ControllerBase
{
    private readonly ColumnUseCases _useCases;
    private readonly BoardNotificationService _notifications;

    public ColumnsController(ColumnUseCases useCases, BoardNotificationService notifications)
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
    public async Task<IActionResult> Create(Guid projectId, [FromBody] CreateColumnRequest request)
    {
        request.ProjectId = projectId;
        var result = await _useCases.CreateAsync(request);
        await _notifications.NotifyColumnCreated(projectId.ToString(), result);
        return CreatedAtAction(nameof(GetAll), new { projectId }, result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid projectId, Guid id, [FromBody] UpdateColumnRequest request)
    {
        var result = await _useCases.UpdateAsync(id, request);
        if (result is null) return NotFound();
        await _notifications.NotifyColumnUpdated(projectId.ToString(), result);
        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid projectId, Guid id)
    {
        var (success, error) = await _useCases.DeleteAsync(id);
        if (!success && error == "not_found") return NotFound();
        if (!success && error == "has_tasks")
            return BadRequest(new { message = "No se puede eliminar una columna que contiene tareas." });
        await _notifications.NotifyColumnDeleted(projectId.ToString(), id);
        return NoContent();
    }

    [HttpPut("reorder")]
    public async Task<IActionResult> Reorder(Guid projectId, [FromBody] ReorderColumnsRequest request)
    {
        await _useCases.ReorderAsync(projectId, request);
        return NoContent();
    }
}