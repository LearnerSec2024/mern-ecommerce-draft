param(
  [switch]$Install,
  [switch]$Seed,
  [switch]$SkipSeed
)

$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
$backend = Join-Path $root "backend"
$frontend = Join-Path $root "frontend"

Write-Host ""
Write-Host "Starting MERN Ecommerce App..." -ForegroundColor Cyan
Write-Host "Project root: $root"
Write-Host ""

if (-not (Test-Path $backend)) {
  throw "Backend folder not found: $backend"
}

if (-not (Test-Path $frontend)) {
  throw "Frontend folder not found: $frontend"
}

Write-Host "Checking MongoDB service..." -ForegroundColor Yellow

$mongoService = Get-Service MongoDB -ErrorAction SilentlyContinue

if ($mongoService) {
  if ($mongoService.Status -ne "Running") {
    Write-Host "MongoDB is stopped. Starting MongoDB..." -ForegroundColor Yellow
    Start-Service MongoDB
    Start-Sleep -Seconds 3
  } else {
    Write-Host "MongoDB is already running." -ForegroundColor Green
  }
} else {
  Write-Warning "MongoDB Windows service was not found. Make sure MongoDB is running manually."
}

function Ensure-EnvFile {
  param(
    [string]$Folder
  )

  $envFile = Join-Path $Folder ".env"
  $exampleFile = Join-Path $Folder ".env.example"

  if (-not (Test-Path $envFile) -and (Test-Path $exampleFile)) {
    Write-Host "Creating .env from .env.example in $Folder" -ForegroundColor Yellow
    Copy-Item $exampleFile $envFile
  }
}

Ensure-EnvFile $backend
Ensure-EnvFile $frontend

function Ensure-Dependencies {
  param(
    [string]$Folder,
    [string]$Name
  )

  $nodeModules = Join-Path $Folder "node_modules"

  if ($Install -or -not (Test-Path $nodeModules)) {
    Write-Host "Installing $Name dependencies..." -ForegroundColor Yellow
    Push-Location $Folder
    npm install
    Pop-Location
  } else {
    Write-Host "$Name dependencies already installed." -ForegroundColor Green
  }
}

Ensure-Dependencies $backend "backend"
Ensure-Dependencies $frontend "frontend"

function Invoke-DatabaseSeedIfNeeded {
  if ($SkipSeed) {
    Write-Host "Skipping database seed check because -SkipSeed was provided." -ForegroundColor Yellow
    return
  }

  if ($Seed) {
    Write-Host "Force seeding database because -Seed was provided..." -ForegroundColor Yellow
    Push-Location $backend
    npm run seed
    Pop-Location
    return
  }

  Write-Host "Checking whether product catalogue is seeded..." -ForegroundColor Yellow

  Push-Location $backend

$checkScript = @"
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Product from './models/Product.js';

dotenv.config();

try {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI is missing from backend/.env');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGO_URI);

  const productCount = await Product.countDocuments({ isActive: true });

  console.log(productCount);

  await mongoose.disconnect();

  if (productCount > 0) {
    process.exit(0);
  }

  process.exit(2);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
"@

$checkScript | node --input-type=module -

  $checkScript | node -

  $seedCheckExitCode = $LASTEXITCODE

  if ($seedCheckExitCode -eq 0) {
    Write-Host "Product catalogue already has data. Skipping seed." -ForegroundColor Green
  } elseif ($seedCheckExitCode -eq 2) {
    Write-Host "No products found. Seeding database now..." -ForegroundColor Yellow
    npm run seed
  } else {
    Pop-Location
    throw "Could not check database seed status."
  }

  Pop-Location
}

Invoke-DatabaseSeedIfNeeded

Write-Host ""
Write-Host "Starting backend in a new PowerShell window..." -ForegroundColor Cyan
$backendCommand = "Set-Location -LiteralPath '$backend'; npm run dev"
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $backendCommand

Start-Sleep -Seconds 4

Write-Host "Starting frontend in a new PowerShell window..." -ForegroundColor Cyan
$frontendCommand = "Set-Location -LiteralPath '$frontend'; npm run dev"
Start-Process powershell.exe -ArgumentList "-NoExit", "-ExecutionPolicy", "Bypass", "-Command", $frontendCommand

Start-Sleep -Seconds 5

Write-Host ""
Write-Host "Opening app in browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "App startup triggered successfully." -ForegroundColor Green
Write-Host "Backend:  http://localhost:5000/api/health"
Write-Host "Frontend: http://localhost:5173"
Write-Host ""
Write-Host "To stop the app, press Ctrl + C in the backend and frontend terminal windows."