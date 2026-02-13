# Fix Broken Imports - Remove references to deleted tenant components

$ErrorActionPreference = "Continue"

Write-Host "=== Fixing Broken Imports ===" -ForegroundColor Cyan
Write-Host ""

# Files with broken imports (from grep search)
$filesToFix = @(
    "src\app\routing.module.ts",
    "src\app\app.module.ts",
    "src\app\modules\tenants\tim\tim-employees.module.ts",
    "src\app\modules\tenants\tim\tim-customers.module.ts",
    "src\app\modules\security\components\login-form\login-form.component.ts",
    "src\app\modules\security\components\register-form\register-form.component.ts",
    "src\app\modules\security\components\business-registration-form\business-registration-form.component.ts",
    "src\app\modules\preventivatore\preventivatore.module.ts",
    "src\app\modules\preventivatore\preventivatore-loader.component.ts",
    "src\app\modules\preventivatore\preventivatore-kentico\preventivatore-kentico.component.ts",
    "src\app\modules\checkout\services\checkout-gtm.service.ts",
    "src\app\modules\checkout\product-checkout-step-controllers\product-checkout-step.service.ts",
    "src\app\core\services\insurances.service.ts"
)

# Patterns to remove (import statements)
$patternsToRemove = @(
    ".*import.*genertel.*",
    ".*import.*intesa.*",
    ".*import.*fca.*",
    ".*import.*yolo.*",
    ".*import.*carrefour.*",
    ".*import.*helbiz.*",
    ".*import.*mopar.*"
)

$totalLinesRemoved = 0

foreach ($file in $filesToFix) {
    if (Test-Path $file) {
        Write-Host "Processing: $file" -ForegroundColor Yellow
        
        $content = Get-Content $file -Raw
        $originalLineCount = ($content -split "`n").Count
        
        foreach ($pattern in $patternsToRemove) {
            $content = $content -replace "(?m)^$pattern`r?`n", ""
        }
        
        $newLineCount = ($content -split "`n").Count
        $linesRemoved = $originalLineCount - $newLineCount
        
        if ($linesRemoved -gt 0) {
            $content | Set-Content $file -NoNewline
            Write-Host "  Removed $linesRemoved import lines" -ForegroundColor Green
            $totalLinesRemoved += $linesRemoved
        } else {
            Write-Host "  No changes needed" -ForegroundColor Gray
        }
    } else {
        Write-Host "  File not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "=== Fix Complete ===" -ForegroundColor Green
Write-Host "Total import lines removed: $totalLinesRemoved" -ForegroundColor Cyan
