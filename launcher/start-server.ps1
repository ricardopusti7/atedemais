<#
PowerShell launcher: stop any process listening on port 8000 and start a new python http.server in the project folder.
Usage: Right-click -> Run with PowerShell, or run from an elevated PowerShell prompt.
#>
param(
    [string]$ProjectPath = "D:\Design\Programas\Sinônimos",
    [int]$Port = 8000
)

Write-Host "Launcher: stopping processes listening on port $Port (if any)" -ForegroundColor Cyan
# Find PIDs listening on the port using netstat
$net = netstat -ano | Select-String ":$Port "
if ($net) {
    $pids = $net | ForEach-Object {
        $parts = ($_ -split '\s+')
        $parts[-1]
    } | Select-Object -Unique
    foreach ($pid in $pids) {
        try {
            Write-Host "Killing PID $pid" -ForegroundColor Yellow
            taskkill /PID $pid /F | Out-Null
        } catch {
            # Use format operator to avoid any interpolation/parser issues with $_ or $pid
            Write-Host ('Failed to kill PID {0}: {1}' -f $pid, $_) -ForegroundColor Red
        }
    }
} else {
    Write-Host "No process found on port $Port" -ForegroundColor Green
}

# Start server in a new PowerShell window so it stays open
Write-Host "Starting python http.server in $ProjectPath on port $Port" -ForegroundColor Cyan
$cmd = "cd '$ProjectPath'; python -m http.server $Port"
Start-Process -FilePath pwsh -ArgumentList "-NoExit", "-Command", $cmd

Write-Host "Launcher finished. A new PowerShell window should be running the server." -ForegroundColor Green
