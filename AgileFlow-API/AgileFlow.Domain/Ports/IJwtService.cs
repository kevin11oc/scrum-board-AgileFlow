using AgileFlow.Domain.Entities;

namespace AgileFlow.Application.Ports;

public interface IJwtService
{
    string GenerateToken(User user);
}