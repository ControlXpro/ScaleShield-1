# Resamples the giant 750x750 / 427 KB source PNGs down to web-appropriate sizes.
# Run once:  powershell -ExecutionPolicy Bypass -File .\optimize-images.ps1
#
# Outputs:
#   favicon-small.png   64 x 64   (browser tab)
#   logo-small.png      120 x 120 (nav at 30px, 4x DPI-ready)

Add-Type -AssemblyName System.Drawing

function Resize-Png {
    param([string]$Source, [string]$Dest, [int]$Size)

    $src = [System.Drawing.Image]::FromFile($Source)
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.PixelOffsetMode   = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($src, 0, 0, $Size, $Size)
    $bmp.Save($Dest, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose(); $bmp.Dispose(); $src.Dispose()

    $sizeKb = [Math]::Round((Get-Item $Dest).Length / 1KB, 1)
    Write-Host "Wrote $Dest ($Size x $Size, $sizeKb KB)"
}

$here = Split-Path -Parent $MyInvocation.MyCommand.Path

Resize-Png -Source (Join-Path $here "favicon.png") -Dest (Join-Path $here "favicon-small.png") -Size 64
Resize-Png -Source (Join-Path $here "logo.png")    -Dest (Join-Path $here "logo-small.png")    -Size 120

Write-Host ""
Write-Host "Done. In index.html, the script will now reference favicon-small.png and logo-small.png automatically."
