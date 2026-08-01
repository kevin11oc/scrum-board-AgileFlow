using AgileFlow.Domain.Entities;

namespace AgileFlow.Domain.Ports;

public interface IProjectRepository
{
    Task<(IEnumerable<Project> Items, int Total)> GetPagedAsync(string? search, int page, int pageSize);
    Task<Project?> GetByIdAsync(Guid id);
    Task<Project> CreateAsync(Project project);
    Task<Project> UpdateAsync(Project project);
    Task DeleteAsync(Guid id);
}