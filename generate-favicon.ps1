# PowerShell script to convert SVG to favicon using online service or manual process
# This script provides instructions and creates the necessary HTML updates

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Temple Favicon Generation Guide" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "✅ SVG file created at: src/assets/icons/temple-favicon.svg" -ForegroundColor Green
Write-Host ""

Write-Host "📋 OPTION 1: Use Online Converter (Recommended)" -ForegroundColor Yellow
Write-Host "   1. Go to https://favicon.io/favicon-converter/" -ForegroundColor White
Write-Host "   2. Upload: src/assets/icons/temple-favicon.svg" -ForegroundColor White
Write-Host "   3. Download the generated favicon package" -ForegroundColor White
Write-Host "   4. Extract and copy these files:" -ForegroundColor White
Write-Host "      - favicon.ico → src/favicon.ico" -ForegroundColor Gray
Write-Host "      - favicon-16x16.png → src/assets/icons/" -ForegroundColor Gray
Write-Host "      - favicon-32x32.png → src/assets/icons/" -ForegroundColor Gray
Write-Host "      - apple-touch-icon.png → src/assets/icons/" -ForegroundColor Gray
Write-Host ""

Write-Host "📋 OPTION 2: Use RealFaviconGenerator (Advanced)" -ForegroundColor Yellow
Write-Host "   1. Go to https://realfavicongenerator.net/" -ForegroundColor White
Write-Host "   2. Upload: src/assets/icons/temple-favicon.svg" -ForegroundColor White
Write-Host "   3. Customize if needed" -ForegroundColor White
Write-Host "   4. Download and extract to appropriate folders" -ForegroundColor White
Write-Host ""

Write-Host "📋 OPTION 3: Manual SVG Usage (Quick & Simple)" -ForegroundColor Yellow
Write-Host "   Modern browsers support SVG favicons directly!" -ForegroundColor White
Write-Host "   The script will now update your index.html to use the SVG..." -ForegroundColor White
Write-Host ""

# Ask user which option they prefer
$choice = Read-Host "Which option do you prefer? (1/2/3)"

if ($choice -eq "3") {
    Write-Host "✅ Updating index.html to use SVG favicon..." -ForegroundColor Green
    
    # Read index.html
    $indexPath = "src/index.html"
    $content = Get-Content $indexPath -Raw
    
    # Check if SVG favicon line already exists
    if ($content -notmatch 'temple-favicon.svg') {
        # Add SVG favicon reference (backup original first)
        Copy-Item $indexPath "$indexPath.backup"
        
        # Update the favicon line
        $content = $content -replace '<link rel="icon" type="image/x-icon" href="favicon.ico">', 
@'
<link rel="icon" type="image/svg+xml" href="assets/icons/temple-favicon.svg">
  <link rel="icon" type="image/x-icon" href="favicon.ico">
'@
        
        Set-Content $indexPath $content
        Write-Host "✅ index.html updated successfully!" -ForegroundColor Green
        Write-Host "   Backup saved at: src/index.html.backup" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  SVG favicon already referenced in index.html" -ForegroundColor Yellow
    }
} else {
    Write-Host "ℹ️  Please follow the online converter instructions above." -ForegroundColor Cyan
    Write-Host "   After downloading, run this script again with option 3 to update HTML." -ForegroundColor Cyan
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Clear browser cache (Ctrl + Shift + Delete)" -ForegroundColor White
Write-Host "2. Hard refresh (Ctrl + F5)" -ForegroundColor White
Write-Host "3. Or test in Incognito mode" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
