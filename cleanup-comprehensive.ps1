# Comprehensive Cleanup Script - Remove ALL non-TIM components
# This script will be more aggressive and thorough

$ErrorActionPreference = "Continue"

Write-Host "=== COMPREHENSIVE CLEANUP - Removing ALL non-TIM components ===" -ForegroundColor Cyan
Write-Host ""

# Define all non-TIM tenant patterns
$nonTIMPatterns = @(
    "genertel", "intesa", "fca", "yolo", "santalucia", "civibank", 
    "carrefour", "leasys", "mediaworld", "mopar", "ravenna", "imagin",
    "chubb", "axa", "sara-sereneta", "ge-motor", "ge-home", "helbiz",
    "bs", "cb", "pc", "pet-exclusive", "mybroker"
)

# Directories to clean
$directoriesToClean = @(
    "src\app\components\public",
    "src\app\modules\checkout\checkout-step\checkout-step-insurance-info",
    "src\app\modules\checkout\checkout-step\checkout-step-complete\stepper-complete-layouts",
    "src\app\modules\checkout\checkout-card",
    "src\app\modules\checkout\login-register",
    "src\app\modules\security\components",
    "src\app\modules\preventivatore",
    "src\app\modules\private-area\components"
)

$totalRemoved = 0

foreach ($dir in $directoriesToClean) {
    if (Test-Path $dir) {
        Write-Host "Cleaning directory: $dir" -ForegroundColor Yellow
        
        foreach ($pattern in $nonTIMPatterns) {
            $items = Get-ChildItem -Path $dir -Recurse -Directory -ErrorAction SilentlyContinue | 
                     Where-Object { $_.Name -match $pattern -and $_.Name -notmatch "tim" }
            
            foreach ($item in $items) {
                try {
                    $relativePath = $item.FullName.Replace((Get-Location).Path + "\", "")
                    Write-Host "  Removing: $relativePath" -ForegroundColor Red
                    Remove-Item -Path $item.FullName -Recurse -Force -ErrorAction Stop
                    $totalRemoved++
                }
                catch {
                    Write-Host "  Error: $_" -ForegroundColor DarkRed
                }
            }
        }
    }
}

Write-Host ""
Write-Host "=== Cleanup Complete ===" -ForegroundColor Green
Write-Host "Total directories removed: $totalRemoved" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Clean up module imports" -ForegroundColor Gray
Write-Host "2. Remove unused routes" -ForegroundColor Gray
Write-Host "3. Test compilation" -ForegroundColor Gray
