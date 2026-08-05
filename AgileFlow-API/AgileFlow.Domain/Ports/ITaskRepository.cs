using AgileFlow.Domain.Entities;

namespace AgileFlow.Domain.Ports;

public interface ITaskRepository
{
    Task<IEnumerable<TaskItem>> GetByColumnIdAsync(Guid columnId);
    Task<IEnumerable<TaskItem>> GetByProjectIdAsync(Guid projectId);
    Task<TaskItem?> GetByIdAsync(Guid id);
    Task<TaskItem> CreateAsync(TaskItem task);
    Task<TaskItem> UpdateAsync(TaskItem task);
    Task DeleteAsync(Guid id);
    Task MoveAsync(Guid taskId, Guid newColumnId, int newOrder);
    Task ReorderAsync(Guid columnId, List<Guid> orderedIds);
}