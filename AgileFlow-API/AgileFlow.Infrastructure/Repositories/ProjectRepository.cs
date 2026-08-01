using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class ProjectRepository : IProjectRepository
{
    private readonly AgileFlowDbContext _context;

    public ProjectRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<(IEnumerable<Project> Items, int Total)> GetPagedAsync(string? search, int page, int pageSize)
    {
        var query = _context.Projects.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(p => p.Name.ToLower().Contains(search.ToLower()));

        var total = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.CreatedAt)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, total);
    }

    public async Task<Project?> GetByIdAsync(Guid id) =>
        await _context.Projects.FindAsync(id);

    public async Task<Project> CreateAsync(Project project)
    {
        _context.Projects.Add(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task<Project> UpdateAsync(Project project)
    {
        _context.Projects.Update(project);
        await _context.SaveChangesAsync();
        return project;
    }

    public async Task DeleteAsync(Guid id)
    {
        var project = await _context.Projects.FindAsync(id);
        if (project is not null)
        {
            _context.Projects.Remove(project);
            await _context.SaveChangesAsync();
        }
    }
}