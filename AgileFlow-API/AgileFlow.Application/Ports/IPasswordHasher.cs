namespace AgileFlow.Application.Ports;

public interface IPasswordHasher
{
    bool Verify(string password, string hash);
}