using AgileFlow.Application.DTOs;
using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;

namespace AgileFlow.Application.UseCases;

public class ColumnUseCases
{
    private readonly IColumnRepository _repository;

    public ColumnUseCases(IColumnRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<ColumnDto>> GetByProjectAsync(Guid projectId)
    {
        var columns = await _repository.GetByProjectIdAsync(projectId);
        return columns.Select(ToDto);
    }

    public async Task<ColumnDto> CreateAsync(CreateColumnRequest request)
    {
        var existing = await _repository.GetByProjectIdAsync(request.ProjectId);
        var order = existing.Any() ? existing.Max(c => c.Order) + 1 : 1;

        var column = new Column
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            ProjectId = request.ProjectId,
            Order = order
        };

        var created = await _repository.CreateAsync(column);
        return ToDto(created);
    }

    public async Task<ColumnDto?> UpdateAsync(Guid id, UpdateColumnRequest request)
    {
        var column = await _repository.GetByIdAsync(id);
        if (column is null) return null;

        column.Name = request.Name;
        var updated = await _repository.UpdateAsync(column);
        return ToDto(updated);
    }

    public async Task<(bool Success, string Error)> DeleteAsync(Guid id)
    {
        var column = await _repository.GetByIdAsync(id);
        if (column is null) return (false, "not_found");

        var hasTasks = await _repository.HasTasksAsync(id);
        if (hasTasks) return (false, "has_tasks");

        await _repository.DeleteAsync(id);
        return (true, string.Empty);
    }

    public async Task ReorderAsync(Guid projectId, ReorderColumnsRequest request)
    {
        await _repository.ReorderAsync(projectId, request.OrderedIds);
    }

    private static ColumnDto ToDto(Column c) => new()
    {
        Id = c.Id,
        Name = c.Name,
        Order = c.Order,
        ProjectId = c.ProjectId
    };
}