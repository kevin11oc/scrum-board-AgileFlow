using AgileFlow.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace AgileFlow.Infrastructure.Persistence.Configurations;

public class TaskConfiguration : IEntityTypeConfiguration<TaskItem>
{
    public void Configure(EntityTypeBuilder<TaskItem> builder)
    {
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Title).IsRequired().HasMaxLength(300);
        builder.Property(t => t.Description).HasMaxLength(2000);
        builder.Property(t => t.Priority).IsRequired().HasMaxLength(20);
        builder.HasOne(t => t.Assignee)
               .WithMany()
               .HasForeignKey(t => t.AssigneeId)
               .OnDelete(DeleteBehavior.SetNull);
    }
}