# hello_IT Support Toolkit - Main Menu
# Usage: irm https://raw.githubusercontent.com/YOUR_USERNAME/hello-IT-toolkit/main/menu.ps1 | iex

$host.UI.RawUI.WindowTitle = "hello_IT Support Toolkit"
$ErrorActionPreference = "SilentlyContinue"

# Color functions
function Write-Header {
    Clear-Host
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "     hello_IT Support Toolkit v1.0         " -ForegroundColor Yellow
    Write-Host "   Professional IT Automation Scripts      " -ForegroundColor Green
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

# Script URLs (Update with your GitHub username)
$gitUser = "YOUR_GITHUB_USERNAME"
$repo = "hello-IT-toolkit"
$branch = "main"
$baseUrl = "https://raw.githubusercontent.com/$gitUser/$repo/$branch/scripts/"

# Menu function
function Show-Menu {
    Write-Header
    Write-Host "ADMINISTRATION TOOLS:" -ForegroundColor Yellow
    Write-Host "  1.  Create hello_IT Admin Account" -ForegroundColor White
    Write-Host "  2.  Remove hello_IT Admin Account" -ForegroundColor White
    Write-Host "  3.  Launch All Admin Tools" -ForegroundColor White
    Write-Host ""
    Write-Host "DIAGNOSTICS:" -ForegroundColor Yellow
    Write-Host "  4.  System Information Collector" -ForegroundColor White
    Write-Host "  5.  Network Diagnostics" -ForegroundColor White
    Write-Host "  6.  Disk Space Monitor" -ForegroundColor White
    Write-Host "  7.  Windows Update Check" -ForegroundColor White
    Write-Host ""
    Write-Host "NETWORKING:" -ForegroundColor Yellow
    Write-Host "  8.  Internet Speed Test" -ForegroundColor White
    Write-Host "  9.  ISP Router Quick Access" -ForegroundColor White
    Write-Host " 10.  WiFi Password Recovery" -ForegroundColor White
    Write-Host " 11.  Enable Remote Desktop" -ForegroundColor White
    Write-Host ""
    Write-Host "UTILITIES:" -ForegroundColor Yellow
    Write-Host " 12.  Printer Management" -ForegroundColor White
    Write-Host " 13.  Firewall Configuration" -ForegroundColor White
    Write-Host " 14.  Software Bulk Installer" -ForegroundColor White
    Write-Host " 15.  Virus Scan & Cleanup" -ForegroundColor White
    Write-Host " 16.  Registry Backup & Restore" -ForegroundColor White
    Write-Host ""
    Write-Host " 0.  Exit" -ForegroundColor Red
    Write-Host ""
}

# Execute script from GitHub
function Run-Script {
    param([string]$scriptName)
    
    try {
        Write-Host "Downloading and executing $scriptName..." -ForegroundColor Cyan
        $script = Invoke-WebRequest -Uri "$baseUrl$scriptName" -UseBasicParsing
        Invoke-Expression $script.Content
    } catch {
        Write-Host "Error: Could not download script. Check your internet connection." -ForegroundColor Red
        Write-Host $_.Exception.Message -ForegroundColor Red
    }
}

# Main loop
do {
    Show-Menu
    $choice = Read-Host "Select an option"
    
    switch ($choice) {
        "1" { Run-Script "admin-account-create.ps1" }
        "2" { Run-Script "admin-account-remove.ps1" }
        "3" { Run-Script "admin-tools-launcher.ps1" }
        "4" { Run-Script "system-info.ps1" }
        "5" { Run-Script "network-diagnostics.ps1" }
        "6" { Run-Script "disk-monitor.ps1" }
        "7" { Run-Script "windows-update.ps1" }
        "8" { Run-Script "speed-test.ps1" }
        "9" { Run-Script "router-access.ps1" }
        "10" { Run-Script "wifi-recovery.ps1" }
        "11" { Run-Script "rdp-enable.ps1" }
        "12" { Run-Script "printer-management.ps1" }
        "13" { Run-Script "firewall-config.ps1" }
        "14" { Run-Script "software-installer.ps1" }
        "15" { Run-Script "virus-scan.ps1" }
        "16" { Run-Script "registry-backup.ps1" }
        "0" { 
            Write-Host "Thank you for using hello_IT Toolkit!" -ForegroundColor Green
            exit
        }
        default {
            Write-Host "Invalid option. Please try again." -ForegroundColor Red
        }
    }
    
    if ($choice -ne "0") {
        Write-Host ""
        Write-Host "Press any key to continue..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
    
} while ($choice -ne "0")
