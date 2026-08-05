using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class ColumnRepository : IColumnRepository
{
    private readonly AgileFlowDbContext _context;

    public ColumnRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Column>> GetByProjectIdAsync(Guid projectId) =>
        await _context.Columns
            .Where(c => c.ProjectId == projectId)
            .OrderBy(c => c.Order)
            .ToListAsync();

    public async Task<Column?> GetByIdAsync(Guid id) =>
        await _context.Columns.FindAsync(id);

    public async Task<Column> CreateAsync(Column column)
    {
        _context.Columns.Add(column);
        await _context.SaveChangesAsync();
        return column;
    }

    public async Task<Column> UpdateAsync(Column column)
    {
        _context.Columns.Update(column);
        await _context.SaveChangesAsync();
        return column;
    }

    public async Task DeleteAsync(Guid id)
    {
        var column = await _context.Columns.FindAsync(id);
        if (column is not null)
        {
            _context.Columns.Remove(column);
            await _context.SaveChangesAsync();
        }
    }

    public async Task ReorderAsync(Guid projectId, List<Guid> orderedIds)
    {
        var columns = await _context.Columns
            .Where(c => c.ProjectId == projectId)
            .ToListAsync();

        for (int i = 0; i < orderedIds.Count; i++)
        {
            var column = columns.FirstOrDefault(c => c.Id == orderedIds[i]);
            if (column is not null) column.Order = i + 1;
        }

        await _context.SaveChangesAsync();
    }

    public async Task<bool> HasTasksAsync(Guid columnId) =>
        await _context.Tasks.AnyAsync(t => t.ColumnId == columnId);
}