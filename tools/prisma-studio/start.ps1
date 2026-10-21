param([switch]$Pull)

$ErrorActionPreference = 'Stop'
$toolDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
$repositoryDirectory = (Resolve-Path (Join-Path $toolDirectory '..\..')).Path
$localEnvironmentFile = Join-Path $repositoryDirectory '.env'

if (-not (Test-Path -LiteralPath $localEnvironmentFile)) {
    throw 'The repository-local .env file is missing.'
}

$settings = @{}
Get-Content -LiteralPath $localEnvironmentFile | ForEach-Object {
    if ($_ -match '^\s*(DB_URL|DB_PASSWORD)=(.*)$') {
        $settings[$matches[1]] = $matches[2].Trim()
    }
}

if ($settings.DB_URL -ne 'jdbc:postgresql://localhost:5432/ibi' -or [string]::IsNullOrWhiteSpace($settings.DB_PASSWORD)) {
    throw 'Expected a local PostgreSQL ibi database and a password in the repository-local .env file.'
}

$encodedPassword = [Uri]::EscapeDataString($settings.DB_PASSWORD)
$env:DATABASE_URL = "postgresql://ibi_studio_ro:${encodedPassword}@localhost:5432/ibi"

try {
    Push-Location $toolDirectory
    if ($Pull) {
        npm run db:pull
    } else {
        npm run studio
    }
    if ($LASTEXITCODE -ne 0) {
        throw "Prisma CLI exited with code $LASTEXITCODE."
    }
} finally {
    Pop-Location
    Remove-Item Env:DATABASE_URL -ErrorAction SilentlyContinue
}
