# Run the NovaUni FastAPI backend
# Usage: .\run_app.ps1

Write-Host "Starting NovaUni API server..." -ForegroundColor Green

# Navigate to the script directory 
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location -Path $scriptPath

# Check if uvicorn is installed
try {
    $uvicornVersion = python -c "import uvicorn; print(uvicorn.__version__)"
    Write-Host "Using uvicorn version: $uvicornVersion" -ForegroundColor Cyan
} catch {
    Write-Host "Warning: Uvicorn not found or error checking version" -ForegroundColor Yellow
    Write-Host "Attempting to install uvicorn..." -ForegroundColor Yellow
    python -m pip install uvicorn
}

# Start the FastAPI application
Write-Host "Starting FastAPI app at http://127.0.0.1:8000" -ForegroundColor Green
python -m uvicorn main:app --reload
