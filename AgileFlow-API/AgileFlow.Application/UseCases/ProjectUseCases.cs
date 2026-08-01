using AgileFlow.Application.DTOs;
using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;

namespace AgileFlow.Application.UseCases;

public class ProjectUseCases
{
    private readonly IProjectRepository _repository;

    public ProjectUseCases(IProjectRepository repository)
    {
        _repository = repository;
    }

    public async Task<PagedResult<ProjectDto>> GetPagedAsync(string? search, int page, int pageSize)
    {
        var (items, total) = await _repository.GetPagedAsync(search, page, pageSize);
        return new PagedResult<ProjectDto>
        {
            Items = items.Select(p => ToDto(p)),
            Total = total,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<ProjectDto> CreateAsync(CreateProjectRequest request)
    {
        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            StartDate = request.StartDate.ToUniversalTime(),
            EndDate = request.EndDate.ToUniversalTime(),
            Status = request.Status,
            CreatedAt = DateTime.UtcNow
        };
        var created = await _repository.CreateAsync(project);
        return ToDto(created);
    }

    public async Task<ProjectDto?> UpdateAsync(Guid id, UpdateProjectRequest request)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project is null) return null;

        project.Name = request.Name;
        project.Description = request.Description;
        project.StartDate = request.StartDate.ToUniversalTime();
        project.EndDate = request.EndDate.ToUniversalTime();
        project.Status = request.Status;

        var updated = await _repository.UpdateAsync(project);
        return ToDto(updated);
    }

    public async Task<bool> DeleteAsync(Guid id)
    {
        var project = await _repository.GetByIdAsync(id);
        if (project is null) return false;
        await _repository.DeleteAsync(id);
        return true;
    }

    private static ProjectDto ToDto(Project p) => new()
    {
        Id = p.Id,
        Name = p.Name,
        Description = p.Description,
        StartDate = p.StartDate,
        EndDate = p.EndDate,
        Status = p.Status,
        CreatedAt = p.CreatedAt
    };
}