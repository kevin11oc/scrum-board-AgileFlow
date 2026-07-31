FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["AgileFlow.Api/AgileFlow.Api.csproj", "AgileFlow.Api/"]
COPY ["AgileFlow.Application/AgileFlow.Application.csproj", "AgileFlow.Application/"]
COPY ["AgileFlow.Domain/AgileFlow.Domain.csproj", "AgileFlow.Domain/"]
COPY ["AgileFlow.Infrastructure/AgileFlow.Infrastructure.csproj", "AgileFlow.Infrastructure/"]
RUN dotnet restore "AgileFlow.Api/AgileFlow.Api.csproj"
COPY . .
WORKDIR "/src/AgileFlow.Api"
RUN dotnet build -c Release -o /app/build

FROM build AS publish
RUN dotnet publish -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "AgileFlow.Api.dll"]