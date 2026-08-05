using AgileFlow.Domain.Entities;

namespace AgileFlow.Domain.Ports;

public interface IColumnRepository
{
    Task<IEnumerable<Column>> GetByProjectIdAsync(Guid projectId);
    Task<Column?> GetByIdAsync(Guid id);
    Task<Column> CreateAsync(Column column);
    Task<Column> UpdateAsync(Column column);
    Task DeleteAsync(Guid id);
    Task ReorderAsync(Guid projectId, List<Guid> orderedIds);
    Task<bool> HasTasksAsync(Guid columnId);
}