# Re-encodes the 3 background JPGs at quality 78 - visually identical,
# typically 40-60 percent smaller files.
# Run once: powershell -ExecutionPolicy Bypass -File .\optimize-jpgs.ps1

Add-Type -AssemblyName System.Drawing

function Reencode-Jpeg {
    param([string]$Source, [int]$Quality = 78)

    $beforeKb = [Math]::Round((Get-Item $Source).Length / 1KB, 1)
    $tmp = "$Source.tmp"
    $img = [System.Drawing.Image]::FromFile($Source)

    $codecs = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders()
    $jpegCodec = $codecs | Where-Object { $_.MimeType -eq "image/jpeg" } | Select-Object -First 1

    $params = New-Object System.Drawing.Imaging.EncoderParameters 1
    $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)

    $img.Save($tmp, $jpegCodec, $params)
    $img.Dispose()

    Move-Item -Path $tmp -Destination $Source -Force

    $afterKb = [Math]::Round((Get-Item $Source).Length / 1KB, 1)
    $saved = [Math]::Round((1 - $afterKb / $beforeKb) * 100, 1)
    Write-Host "$([System.IO.Path]::GetFileName($Source))  $beforeKb KB -> $afterKb KB  (saved $saved percent)"
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path
Reencode-Jpeg -Source (Join-Path $here "hero-bg.jpg")
Reencode-Jpeg -Source (Join-Path $here "onyx-bg.jpg")
Reencode-Jpeg -Source (Join-Path $here "pricing-bg.jpg")

Write-Host ""
Write-Host "Done. Originals are overwritten."
