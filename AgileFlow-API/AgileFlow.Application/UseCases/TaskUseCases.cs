using AgileFlow.Application.DTOs;
using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;

namespace AgileFlow.Application.UseCases;

public class TaskUseCases
{
    private readonly ITaskRepository _repository;

    public TaskUseCases(ITaskRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<TaskDto>> GetByProjectAsync(Guid projectId)
    {
        var tasks = await _repository.GetByProjectIdAsync(projectId);
        return tasks.Select(ToDto);
    }

    public async Task<TaskDto> CreateAsync(CreateTaskRequest request)
    {
        var existing = await _repository.GetByColumnIdAsync(request.ColumnId);
        var order = existing.Any() ? existing.Max(t => t.Order) + 1 : 1;

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Priority = request.Priority,
            ColumnId = request.ColumnId,
            AssigneeId = request.AssigneeId,
            Order = order,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _repository.CreateAsync(task);
        return ToDto(created);
    }

    public async Task<TaskDto?> UpdateAsync(Guid id, UpdateTaskRequest request)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task is null) return null;

        task.Title = request.Title;
        task.Description = request.Description;
        task.Priority = request.Priority;
        task.AssigneeId = request.AssigneeId;

        var updated = await _repository.UpdateAsync(task);
        return ToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task is null) return false;
        await _repository.DeleteAsync(id);
        return true;
    }

    public async Task<TaskDto?> MoveAsync(Guid id, MoveTaskRequest request)
    {
        var task = await _repository.GetByIdAsync(id);
        if (task is null) return null;
        await _repository.MoveAsync(id, request.NewColumnId, request.NewOrder);
        task = await _repository.GetByIdAsync(id);
        return ToDto(task!);
    }

    public async Task ReorderAsync(Guid columnId, ReorderTasksRequest request)
    {
        await _repository.ReorderAsync(columnId, request.OrderedIds);
    }

    private static TaskDto ToDto(TaskItem t) => new()
    {
        Id = t.Id,
        Title = t.Title,
        Description = t.Description,
        Priority = t.Priority,
        ColumnId = t.ColumnId,
        AssigneeId = t.AssigneeId,
        AssigneeName = t.Assignee?.Name,
        Order = t.Order,
        CreatedAt = t.CreatedAt
    };
}