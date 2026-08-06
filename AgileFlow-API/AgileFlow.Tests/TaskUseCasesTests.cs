using AgileFlow.Application.DTOs;
using AgileFlow.Application.UseCases;
using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using FluentAssertions;
using Moq;

namespace AgileFlow.Tests;

public class TaskUseCasesTests
{
    private readonly Mock<ITaskRepository> _repositoryMock;
    private readonly TaskUseCases _useCases;

    public TaskUseCasesTests()
    {
        _repositoryMock = new Mock<ITaskRepository>();
        _useCases = new TaskUseCases(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldAssignCorrectOrder_WhenColumnHasTasks()
    {
        // Arrange — columna con 2 tareas existentes
        var columnId = Guid.NewGuid();
        var existingTasks = new List<TaskItem>
        {
            new() { Id = Guid.NewGuid(), ColumnId = columnId, Order = 1, Title = "T1", Description = "", Priority = "low" },
            new() { Id = Guid.NewGuid(), ColumnId = columnId, Order = 2, Title = "T2", Description = "", Priority = "low" }
        };

        _repositoryMock.Setup(r => r.GetByColumnIdAsync(columnId))
            .ReturnsAsync(existingTasks);

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync((TaskItem t) => t);

        var request = new CreateTaskRequest
        {
            Title = "Nueva tarea",
            Description = "",
            Priority = "medium",
            ColumnId = columnId
        };

        // Act
        var result = await _useCases.CreateAsync(request);

        // Assert — la nueva tarea debe tener Order = 3
        result.Order.Should().Be(3);
    }

    [Fact]
    public async Task CreateAsync_ShouldAssignOrderOne_WhenColumnIsEmpty()
    {
        // Arrange
        var columnId = Guid.NewGuid();

        _repositoryMock.Setup(r => r.GetByColumnIdAsync(columnId))
            .ReturnsAsync(new List<TaskItem>());

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<TaskItem>()))
            .ReturnsAsync((TaskItem t) => t);

        var request = new CreateTaskRequest
        {
            Title = "Primera tarea",
            Description = "",
            Priority = "high",
            ColumnId = columnId
        };

        // Act
        var result = await _useCases.CreateAsync(request);

        // Assert
        result.Order.Should().Be(1);
    }
}