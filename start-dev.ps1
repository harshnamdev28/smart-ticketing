# Smart Campus Ticketing - Development Startup Script
# This script starts both backend and frontend servers

Write-Host "🎓 Smart Campus Ticketing - Starting Development Servers" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if backend .env exists
if (-Not (Test-Path "d:\ABC\.env")) {
    Write-Host "❌ Backend .env file not found!" -ForegroundColor Red
    Write-Host "   Please copy .env.example to .env and configure it." -ForegroundColor Yellow
    exit 1
}

# Check if frontend .env exists
if (-Not (Test-Path "d:\ABC\frontend abc\smart-campus-ticketing\.env")) {
    Write-Host "❌ Frontend .env file not found!" -ForegroundColor Red
    Write-Host "   Please copy .env.example to .env in the frontend folder." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Environment files found" -ForegroundColor Green
Write-Host ""

# Start Backend Server
Write-Host "🚀 Starting Backend Server (port 5000)..." -ForegroundColor Cyan
$backendJob = Start-Job -ScriptBlock {
    Set-Location "d:\ABC"
    node server.js
}

Start-Sleep -Seconds 3

# Check if backend started successfully
if ($backendJob.State -eq "Running") {
    Write-Host "   ✅ Backend server started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend server failed to start" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Start Frontend Server
Write-Host "🚀 Starting Frontend Server (port 3000)..." -ForegroundColor Cyan
$frontendJob = Start-Job -ScriptBlock {
    Set-Location "d:\ABC\frontend abc\smart-campus-ticketing"
    npm run dev
}

Start-Sleep -Seconds 5

# Check if frontend started successfully
if ($frontendJob.State -eq "Running") {
    Write-Host "   ✅ Frontend server started" -ForegroundColor Green
} else {
    Write-Host "   ❌ Frontend server failed to start" -ForegroundColor Red
    Stop-Job $backendJob
    Remove-Job $backendJob
    exit 1
}

Write-Host ""
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Both servers are running!" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
Write-Host ""

# Wait for user to press Ctrl+C
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        # Check if jobs are still running
        if ($backendJob.State -ne "Running") {
            Write-Host "❌ Backend server stopped unexpectedly" -ForegroundColor Red
            break
        }
        if ($frontendJob.State -ne "Running") {
            Write-Host "❌ Frontend server stopped unexpectedly" -ForegroundColor Red
            break
        }
    }
}
finally {
    Write-Host ""
    Write-Host "🛑 Stopping servers..." -ForegroundColor Yellow
    Stop-Job $backendJob -ErrorAction SilentlyContinue
    Stop-Job $frontendJob -ErrorAction SilentlyContinue
    Remove-Job $backendJob -ErrorAction SilentlyContinue
    Remove-Job $frontendJob -ErrorAction SilentlyContinue
    Write-Host "✅ Servers stopped" -ForegroundColor Green
}
