using AgileFlow.Domain.Entities;

namespace AgileFlow.Domain.Ports;

public interface IAuthRepository
{
    Task<User?> GetByEmailAsync(string email);
}