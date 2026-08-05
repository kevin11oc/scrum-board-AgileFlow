using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class TaskRepository : ITaskRepository
{
    private readonly AgileFlowDbContext _context;

    public TaskRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<TaskItem>> GetByColumnIdAsync(Guid columnId) =>
        await _context.Tasks
            .Include(t => t.Assignee)
            .Where(t => t.ColumnId == columnId)
            .OrderBy(t => t.Order)
            .ToListAsync();

    public async Task<IEnumerable<TaskItem>> GetByProjectIdAsync(Guid projectId) =>
        await _context.Tasks
            .Include(t => t.Assignee)
            .Where(t => t.Column.ProjectId == projectId)
            .OrderBy(t => t.ColumnId)
            .ThenBy(t => t.Order)
            .ToListAsync();

    public async Task<TaskItem?> GetByIdAsync(Guid id) =>
        await _context.Tasks
            .Include(t => t.Assignee)
            .FirstOrDefaultAsync(t => t.Id == id);

    public async Task<TaskItem> CreateAsync(TaskItem task)
    {
        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task<TaskItem> UpdateAsync(TaskItem task)
    {
        _context.Tasks.Update(task);
        await _context.SaveChangesAsync();
        return task;
    }

    public async Task DeleteAsync(Guid id)
    {
        var task = await _context.Tasks.FindAsync(id);
        if (task is not null)
        {
            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();
        }
    }

    public async Task MoveAsync(Guid taskId, Guid newColumnId, int newOrder)
    {
        var task = await _context.Tasks.FindAsync(taskId);
        if (task is null) return;

        task.ColumnId = newColumnId;
        task.Order = newOrder;
        await _context.SaveChangesAsync();
    }

    public async Task ReorderAsync(Guid columnId, List<Guid> orderedIds)
    {
        var tasks = await _context.Tasks
            .Where(t => t.ColumnId == columnId)
            .ToListAsync();

        for (int i = 0; i < orderedIds.Count; i++)
        {
            var task = tasks.FirstOrDefault(t => t.Id == orderedIds[i]);
            if (task is not null) task.Order = i + 1;
        }

        await _context.SaveChangesAsync();
    }
}