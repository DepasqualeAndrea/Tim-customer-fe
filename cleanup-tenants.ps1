# TIM Customer FE - Cleanup Script
# Rimuove tutti i componenti non-TIM dalla repository

$ErrorActionPreference = "Continue"
$removedFiles = @()
$errors = @()

# Lista dei pattern da rimuovere (tenant non-TIM)
$tenantsToRemove = @(
    "*genertel*",
    "*intesa*",
    "*fca*",
    "*yolo*",
    "*santalucia*",
    "*civibank*",
    "*carrefour*",
    "*leasys*",
    "*mediaworld*",
    "*mopar*",
    "*ravenna*",
    "*imagin*",
    "*chubb*",
    "*axa*",
    "*sara-sereneta*",
    "*ge-motor*",
    "*ge-home*",
    "*helbiz*"
)

# Eccezioni - file che contengono i pattern ma sono condivisi/necessari
$exceptions = @(
    "*shared*",
    "*core*",
    "*models*",
    "*services*",
    "*guards*"
)

Write-Host "=== TIM Customer FE - Cleanup Script ===" -ForegroundColor Cyan
Write-Host "Inizio pulizia componenti non-TIM..." -ForegroundColor Yellow
Write-Host ""

# Funzione per verificare se un file è un'eccezione
function Is-Exception {
    param($filePath)
    foreach ($exception in $exceptions) {
        if ($filePath -like $exception) {
            return $true
        }
    }
    return $false
}

# Cerca e rimuovi file per ogni tenant
foreach ($pattern in $tenantsToRemove) {
    Write-Host "Cercando file con pattern: $pattern" -ForegroundColor Gray
    
    $files = Get-ChildItem -Path "src\app\components" -Recurse -Filter $pattern -ErrorAction SilentlyContinue
    
    foreach ($file in $files) {
        if (-not (Is-Exception $file.FullName)) {
            try {
                $relativePath = $file.FullName.Replace((Get-Location).Path, ".")
                Write-Host "  Rimuovendo: $relativePath" -ForegroundColor Red
                Remove-Item -Path $file.FullName -Recurse -Force -ErrorAction Stop
                $removedFiles += $relativePath
            }
            catch {
                $errors += "Errore rimuovendo $($file.FullName): $_"
                Write-Host "  ERRORE: $_" -ForegroundColor Red
            }
        }
    }
}

# Salva log
$logContent = @"
# Cleanup Log - $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")

## File Rimossi ($($removedFiles.Count))
$($removedFiles | ForEach-Object { "- $_" } | Out-String)

## Errori ($($errors.Count))
$($errors | ForEach-Object { "- $_" } | Out-String)
"@

$logContent | Out-File -FilePath "CLEANUP_LOG.txt" -Encoding UTF8

Write-Host ""
Write-Host "=== Cleanup Completato ===" -ForegroundColor Green
Write-Host "File rimossi: $($removedFiles.Count)" -ForegroundColor Cyan
Write-Host "Errori: $($errors.Count)" -ForegroundColor $(if ($errors.Count -gt 0) { "Red" } else { "Green" })
Write-Host "Log salvato in: CLEANUP_LOG.txt" -ForegroundColor Gray
