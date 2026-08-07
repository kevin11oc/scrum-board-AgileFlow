using AgileFlow.Domain.Entities;

namespace AgileFlow.Domain.Ports;

public interface IUserRepository
{
    Task<IEnumerable<User>> GetAllAsync();
}