using AgileFlow.Application.DTOs;
using AgileFlow.Application.UseCases;
using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using FluentAssertions;
using Moq;

namespace AgileFlow.Tests;

public class ProjectUseCasesTests
{
    private readonly Mock<IProjectRepository> _repositoryMock;
    private readonly ProjectUseCases _useCases;

    public ProjectUseCasesTests()
    {
        _repositoryMock = new Mock<IProjectRepository>();
        _useCases = new ProjectUseCases(_repositoryMock.Object);
    }

    [Fact]
    public async Task CreateAsync_ShouldReturnProjectDto_WhenValidRequest()
    {
        // Arrange
        var request = new CreateProjectRequest
        {
            Name = "Test Project",
            Description = "Description",
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(30),
            Status = "active"
        };

        _repositoryMock.Setup(r => r.CreateAsync(It.IsAny<Project>()))
            .ReturnsAsync((Project p) => p);

        // Act
        var result = await _useCases.CreateAsync(request);

        // Assert
        result.Should().NotBeNull();
        result.Name.Should().Be(request.Name);
        result.Status.Should().Be("active");
    }

    [Fact]
    public async Task UpdateAsync_ShouldReturnNull_WhenProjectNotFound()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Project?)null);

        // Act
        var result = await _useCases.UpdateAsync(Guid.NewGuid(), new UpdateProjectRequest
        {
            Name = "Updated",
            Description = "Updated",
            StartDate = DateTime.UtcNow,
            EndDate = DateTime.UtcNow.AddDays(10),
            Status = "active"
        });

        // Assert
        result.Should().BeNull();
    }

    [Fact]
    public async Task DeleteAsync_ShouldReturnFalse_WhenProjectNotFound()
    {
        // Arrange
        _repositoryMock.Setup(r => r.GetByIdAsync(It.IsAny<Guid>()))
            .ReturnsAsync((Project?)null);

        // Act
        var result = await _useCases.DeleteAsync(Guid.NewGuid());

        // Assert
        result.Should().BeFalse();
    }
}