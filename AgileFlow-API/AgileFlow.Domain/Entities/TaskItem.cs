namespace AgileFlow.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Priority { get; set; } = "medium";
    public Guid? AssigneeId { get; set; }
    public User? Assignee { get; set; }
    public Guid ColumnId { get; set; }
    public Column Column { get; set; } = null!;
    public int Order { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}