# Generate silent MP3 placeholders
$b64 = "//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAADhAC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAA4Th9Y3gAAAAAAD/+xDEAAPAAAGkAAAAIAAANIAAAARMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV"
$bytes = [System.Convert]::FromBase64String($b64)
@("hanuman-chalisa.mp3", "hanuman-aarti.mp3", "om-chant.mp3") | ForEach-Object {
    [System.IO.File]::WriteAllBytes("src\assets\audio\$_", $bytes)
    Write-Host "Created: $_" -ForegroundColor Green
}
Write-Host "Done! Replace with real audio for production." -ForegroundColor Yellow
