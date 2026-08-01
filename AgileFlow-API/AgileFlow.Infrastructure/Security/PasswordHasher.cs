using AgileFlow.Application.Ports;

namespace AgileFlow.Infrastructure.Security;

public class PasswordHasher : IPasswordHasher
{
    public bool Verify(string password, string hash)
    {
        return BCrypt.Net.BCrypt.Verify(password, hash);
    }
}