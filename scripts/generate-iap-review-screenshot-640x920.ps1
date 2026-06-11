$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$workspace = (Resolve-Path ".").Path
$outputDir = Join-Path $workspace "marketing\subscription-review"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$outputPath = Join-Path $outputDir "meeting-recall-pro-iap-review-640x920.png"

$width = 640
$height = 920
$bitmap = New-Object System.Drawing.Bitmap($width, $height)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

function Color($hex) {
  return [System.Drawing.ColorTranslator]::FromHtml($hex)
}

function Brush($hex) {
  return New-Object System.Drawing.SolidBrush((Color $hex))
}

function Pen($hex, $width = 1) {
  return New-Object System.Drawing.Pen((Color $hex), $width)
}

function Font($size, $style = [System.Drawing.FontStyle]::Regular) {
  return New-Object System.Drawing.Font("Segoe UI", $size, $style, [System.Drawing.GraphicsUnit]::Pixel)
}

function Rect($x, $y, $w, $h) {
  return New-Object System.Drawing.RectangleF($x, $y, $w, $h)
}

function RoundedRectPath($x, $y, $w, $h, $r) {
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $d = $r * 2
  $path.AddArc($x, $y, $d, $d, 180, 90)
  $path.AddArc($x + $w - $d, $y, $d, $d, 270, 90)
  $path.AddArc($x + $w - $d, $y + $h - $d, $d, $d, 0, 90)
  $path.AddArc($x, $y + $h - $d, $d, $d, 90, 90)
  $path.CloseFigure()
  return $path
}

function FillRoundedRect($x, $y, $w, $h, $r, $brush) {
  $path = RoundedRectPath $x $y $w $h $r
  $graphics.FillPath($brush, $path)
  $path.Dispose()
}

function DrawRoundedRect($x, $y, $w, $h, $r, $pen) {
  $path = RoundedRectPath $x $y $w $h $r
  $graphics.DrawPath($pen, $path)
  $path.Dispose()
}

function DrawText($text, $font, $brush, $x, $y, $w, $h) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Near
  $format.LineAlignment = [System.Drawing.StringAlignment]::Near
  $graphics.DrawString($text, $font, $brush, (Rect $x $y $w $h), $format)
  $format.Dispose()
}

function DrawCenteredText($text, $font, $brush, $x, $y, $w, $h) {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::Center
  $format.LineAlignment = [System.Drawing.StringAlignment]::Center
  $graphics.DrawString($text, $font, $brush, (Rect $x $y $w $h), $format)
  $format.Dispose()
}

$bg = Brush "#ffffff"
$text = Brush "#101318"
$muted = Brush "#6f7785"
$blue = Brush "#4b7de6"
$blueSoft = Brush "#eef3ff"
$red = Brush "#ef233c"
$divider = Pen "#dfe3e8" 1

$graphics.FillRectangle($bg, 0, 0, $width, $height)

# App mark
$markX = 48
$markY = 42
$graphics.FillEllipse($red, $markX + 18, $markY + 32, 18, 18)
$logoPen = Pen "#101318" 4
$logoPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$logoPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($logoPen, $markX + 27, $markY + 0, $markX + 27, $markY + 20)
$graphics.DrawLine($logoPen, $markX + 0, $markY + 18, $markX + 14, $markY + 32)
$graphics.DrawLine($logoPen, $markX + 54, $markY + 18, $markX + 40, $markY + 32)
DrawText "Meeting Recall Pro" (Font 26 ([System.Drawing.FontStyle]::Bold)) $text 112 48 420 36

DrawText "Save more meetings." (Font 46 ([System.Drawing.FontStyle]::Bold)) $text 48 128 540 56
DrawText "Keep your workflow moving." (Font 38 ([System.Drawing.FontStyle]::Bold)) $text 48 184 540 52
DrawText "Record, save, share, and open your meeting files in NotebookLM." (Font 23) $muted 50 252 520 66

$featureY = 345
$features = @(
  "Unlimited saved recordings",
  "Calendar-based meeting names",
  "Playback and sharing",
  "Fast NotebookLM handoff"
)

foreach ($feature in $features) {
  $graphics.FillEllipse($blue, 54, $featureY + 9, 10, 10)
  DrawText $feature (Font 22 ([System.Drawing.FontStyle]::Bold)) $text 86 $featureY 480 34
  $featureY += 42
}

$cardX = 40
$cardW = 560
$yearlyY = 548
$monthlyY = 672

FillRoundedRect $cardX $yearlyY $cardW 100 18 $blueSoft
DrawRoundedRect $cardX $yearlyY $cardW 100 18 (Pen "#4b7de6" 3)
FillRoundedRect 450 ($yearlyY + 18) 104 28 14 $blue
DrawCenteredText "Best Value" (Font 14 ([System.Drawing.FontStyle]::Bold)) (Brush "#ffffff") 450 ($yearlyY + 18) 104 28
DrawText "Yearly" (Font 24 ([System.Drawing.FontStyle]::Bold)) $text 70 ($yearlyY + 18) 180 32
DrawText '$29.99/year' (Font 30 ([System.Drawing.FontStyle]::Bold)) $text 70 ($yearlyY + 48) 220 38
DrawText "7-day free trial - Save 37%" (Font 18) $muted 310 ($yearlyY + 53) 230 26

FillRoundedRect $cardX $monthlyY $cardW 94 18 (Brush "#ffffff")
DrawRoundedRect $cardX $monthlyY $cardW 94 18 (Pen "#dfe3e8" 2)
DrawText "Monthly" (Font 24 ([System.Drawing.FontStyle]::Bold)) $text 70 ($monthlyY + 18) 180 32
DrawText '$3.99/month' (Font 30 ([System.Drawing.FontStyle]::Bold)) $text 70 ($monthlyY + 48) 230 38
DrawText "7-day free trial" (Font 18) $muted 372 ($monthlyY + 52) 170 26

$ctaY = 804
FillRoundedRect 40 $ctaY 560 58 29 $blue
DrawCenteredText "Start Free Trial" (Font 22 ([System.Drawing.FontStyle]::Bold)) (Brush "#ffffff") 40 $ctaY 560 58

DrawCenteredText "Restore Purchases   Terms   Privacy" (Font 16) $blue 40 872 560 28

$bitmap.SetResolution(72, 72)
$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$bg.Dispose()
$text.Dispose()
$muted.Dispose()
$blue.Dispose()
$blueSoft.Dispose()
$red.Dispose()
$divider.Dispose()
$logoPen.Dispose()

Write-Output $outputPath
