using AgileFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Persistence;

public class AgileFlowDbContext : DbContext
{
    public AgileFlowDbContext(DbContextOptions<AgileFlowDbContext> options) : base(options) { }

    public DbSet<User> Users => Set<User>();
    public DbSet<Project> Projects => Set<Project>();
    public DbSet<Column> Columns => Set<Column>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AgileFlowDbContext).Assembly);
        base.OnModelCreating(modelBuilder);
    }
}