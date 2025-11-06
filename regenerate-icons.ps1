# PowerShell script to regenerate PWA icons from SVG
# This creates placeholder instructions for now

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PWA Icon Regeneration" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$svgPath = "src/assets/icons/temple-favicon.svg"
$iconsDir = "src/assets/icons"

Write-Host "Source SVG: $svgPath" -ForegroundColor Green
Write-Host ""

# Icon sizes needed for PWA
$sizes = @(72, 96, 128, 144, 152, 192, 384, 512)

Write-Host "OPTION 1: Use Online Tool (Recommended)" -ForegroundColor Yellow
Write-Host "1. Go to: https://www.pwabuilder.com/imageGenerator" -ForegroundColor White
Write-Host "2. Upload: $svgPath" -ForegroundColor White
Write-Host "3. Download the generated icons" -ForegroundColor White
Write-Host "4. Extract all PNG files to: $iconsDir" -ForegroundColor White
Write-Host ""

Write-Host "OPTION 2: Manual Creation" -ForegroundColor Yellow
Write-Host "Required icon sizes:" -ForegroundColor White
foreach ($size in $sizes) {
    Write-Host "  - icon-${size}x${size}.png" -ForegroundColor Gray
}
Write-Host ""

Write-Host "OPTION 3: Quick Fix (Use existing largest icon)" -ForegroundColor Yellow
Write-Host "If you just need to fix the error quickly:" -ForegroundColor White
Write-Host "Copy icon-512x512.png to all smaller sizes" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Apply quick fix now? (y/n)"

if ($choice -eq "y" -or $choice -eq "Y") {
    $sourceIcon = Join-Path $iconsDir "icon-512x512.png"
    
    if (Test-Path $sourceIcon) {
        Write-Host ""
        Write-Host "Copying icon-512x512.png to all sizes..." -ForegroundColor Green
        
        foreach ($size in $sizes) {
            if ($size -ne 512) {
                $targetIcon = Join-Path $iconsDir "icon-${size}x${size}.png"
                Copy-Item $sourceIcon $targetIcon -Force
                Write-Host "  Created: icon-${size}x${size}.png" -ForegroundColor Gray
            }
        }
        
        Write-Host ""
        Write-Host "Done! All icons updated." -ForegroundColor Green
        Write-Host "Note: These are not optimized sizes, just copies of the 512x512 icon." -ForegroundColor Yellow
        Write-Host "For production, use Option 1 to generate properly sized icons." -ForegroundColor Yellow
    } else {
        Write-Host "Error: icon-512x512.png not found!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
