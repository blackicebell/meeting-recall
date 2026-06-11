$ErrorActionPreference = "Stop"

Add-Type -AssemblyName System.Drawing

$workspace = (Resolve-Path ".").Path
$outputDir = Join-Path $workspace "marketing\subscription-review"
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$outputPath = Join-Path $outputDir "meeting-recall-pro-paywall-review.png"

$width = 1290
$height = 2796
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

function DrawText($text, $font, $brush, $x, $y, $w, $h, $align = "Near") {
  $format = New-Object System.Drawing.StringFormat
  $format.Alignment = [System.Drawing.StringAlignment]::$align
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
$subtle = Brush "#9aa1ad"
$blue = Brush "#4b7de6"
$blueSoft = Brush "#eef3ff"
$red = Brush "#ef233c"
$green = Brush "#2da44e"
$line = Pen "#dfe3e8" 2
$softLine = Pen "#edf0f3" 2

$graphics.FillRectangle($bg, 0, 0, $width, $height)

# Status bar
DrawText "9:41" (Font 42 ([System.Drawing.FontStyle]::Bold)) $text 76 42 200 60
DrawCenteredText "Meeting Recall" (Font 30 ([System.Drawing.FontStyle]::Bold)) $muted 0 52 $width 50

# Small logo mark
$markX = 100
$markY = 180
$graphics.FillEllipse($red, $markX + 26, $markY + 46, 32, 32)
$logoPen = Pen "#101318" 8
$logoPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$logoPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$graphics.DrawLine($logoPen, $markX + 42, $markY + 0, $markX + 42, $markY + 28)
$graphics.DrawLine($logoPen, $markX + 4, $markY + 28, $markX + 22, $markY + 48)
$graphics.DrawLine($logoPen, $markX + 80, $markY + 28, $markX + 62, $markY + 48)
$graphics.DrawString("Meeting Recall Pro", (Font 46 ([System.Drawing.FontStyle]::Bold)), $text, $markX + 120, $markY + 4)

# Header
DrawText "Save more meetings." (Font 78 ([System.Drawing.FontStyle]::Bold)) $text 92 330 1100 96
DrawText "Keep your workflow moving." (Font 78 ([System.Drawing.FontStyle]::Bold)) $text 92 420 1100 96
DrawText "Record, save, share, and open your meeting files in NotebookLM." (Font 36) $muted 96 545 1040 110

# Feature list
$featureY = 710
$features = @(
  "Unlimited saved recordings",
  "Calendar-based meeting names",
  "Playback and sharing",
  "Fast NotebookLM handoff"
)

foreach ($feature in $features) {
  $graphics.FillEllipse($blue, 114, $featureY + 20, 18, 18)
  DrawText $feature (Font 34 ([System.Drawing.FontStyle]::Bold)) $text 172 ($featureY + 2) 850 50
  $featureY += 82
}

# Plan cards
$cardX = 76
$cardW = 1138
$yearlyY = 1138
$monthlyY = 1398

FillRoundedRect $cardX $yearlyY $cardW 220 34 $blueSoft
DrawRoundedRect $cardX $yearlyY $cardW 220 34 (Pen "#4b7de6" 5)
FillRoundedRect 944 ($yearlyY + 34) 180 50 25 $blue
DrawCenteredText "Best Value" (Font 24 ([System.Drawing.FontStyle]::Bold)) (Brush "#ffffff") 944 ($yearlyY + 34) 180 50
DrawText "Yearly" (Font 42 ([System.Drawing.FontStyle]::Bold)) $text 126 ($yearlyY + 44) 420 58
DrawText '$29.99/year' (Font 48 ([System.Drawing.FontStyle]::Bold)) $text 126 ($yearlyY + 105) 420 68
DrawText "7-day free trial - Save 37%" (Font 30) $muted 126 ($yearlyY + 168) 680 44
$graphics.FillEllipse($blue, 1104, $yearlyY + 125, 26, 26)

FillRoundedRect $cardX $monthlyY $cardW 196 34 (Brush "#ffffff")
DrawRoundedRect $cardX $monthlyY $cardW 196 34 (Pen "#dfe3e8" 3)
DrawText "Monthly" (Font 42 ([System.Drawing.FontStyle]::Bold)) $text 126 ($monthlyY + 42) 420 58
DrawText '$3.99/month' (Font 48 ([System.Drawing.FontStyle]::Bold)) $text 126 ($monthlyY + 102) 460 68
DrawText "7-day free trial" (Font 30) $muted 666 ($monthlyY + 104) 360 50

# CTA
$ctaY = 1698
FillRoundedRect 76 $ctaY 1138 104 52 $blue
DrawCenteredText "Start Free Trial" (Font 36 ([System.Drawing.FontStyle]::Bold)) (Brush "#ffffff") 76 $ctaY 1138 104

DrawCenteredText "7-day free trial. Cancel anytime before renewal." (Font 27) $muted 76 ($ctaY + 134) 1138 48

# Links
DrawCenteredText "Restore Purchases     Terms     Privacy" (Font 25 ([System.Drawing.FontStyle]::Regular)) $blue 76 ($ctaY + 204) 1138 44

# Secondary exit action
DrawCenteredText "Maybe Later" (Font 28 ([System.Drawing.FontStyle]::Bold)) $muted 76 ($ctaY + 280) 1138 44

# Home indicator
FillRoundedRect 478 2700 334 10 5 (Brush "#101318")

$bitmap.Save($outputPath, [System.Drawing.Imaging.ImageFormat]::Png)

$graphics.Dispose()
$bitmap.Dispose()
$bg.Dispose()
$text.Dispose()
$muted.Dispose()
$subtle.Dispose()
$blue.Dispose()
$blueSoft.Dispose()
$red.Dispose()
$green.Dispose()
$line.Dispose()
$softLine.Dispose()
$logoPen.Dispose()

Write-Output $outputPath
