using AgileFlow.Domain.Entities;
using AgileFlow.Domain.Ports;
using AgileFlow.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace AgileFlow.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AgileFlowDbContext _context;

    public UserRepository(AgileFlowDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<User>> GetAllAsync() =>
        await _context.Users.OrderBy(u => u.Name).ToListAsync();
}