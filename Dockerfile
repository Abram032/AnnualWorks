# Building app
FROM mcr.microsoft.com/dotnet/sdk:3.1-buster AS build

RUN curl --silent --location https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install --yes nodejs

WORKDIR /src
COPY . .

RUN dotnet restore "./NCU.AnnualWorks.sln"

RUN dotnet publish "./NCU.AnnualWorks.sln" -c Release -o /app

# Release container
FROM mcr.microsoft.com/dotnet/aspnet:3.1-buster-slim as publish

WORKDIR /app

COPY --from=build /app .

ENTRYPOINT ["dotnet", "NCU.AnnualWorks.dll"]