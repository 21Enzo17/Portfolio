# Script para generar todos los tamaños de favicon
# Requiere ImageMagick instalado: https://imagemagick.org/script/download.php#windows

$srcIcon = "src\favicon.ico"
$assetsDir = "src\assets\favicon"

Write-Host "Generando favicons desde $srcIcon..." -ForegroundColor Green

# Verificar que existe el archivo fuente
if (-not (Test-Path $srcIcon)) {
    Write-Host "ERROR: No se encuentra $srcIcon" -ForegroundColor Red
    Write-Host "Por favor, copia tu nuevo favicon.ico optimizado a src\favicon.ico" -ForegroundColor Yellow
    exit 1
}

# Crear directorio si no existe
if (-not (Test-Path $assetsDir)) {
    New-Item -ItemType Directory -Path $assetsDir -Force
}

# Verificar que ImageMagick está instalado
try {
    magick -version | Out-Null
} catch {
    Write-Host "ERROR: ImageMagick no está instalado" -ForegroundColor Red
    Write-Host "Descárgalo desde: https://imagemagick.org/script/download.php#windows" -ForegroundColor Yellow
    Write-Host "O usa la opción online: https://favicon.io/favicon-converter/" -ForegroundColor Cyan
    exit 1
}

# Generar diferentes tamaños
Write-Host "Generando favicon-16x16.png..." -ForegroundColor Cyan
magick "$srcIcon[0]" -resize 16x16 "$assetsDir\favicon-16x16.png"

Write-Host "Generando favicon-32x32.png..." -ForegroundColor Cyan
magick "$srcIcon[0]" -resize 32x32 "$assetsDir\favicon-32x32.png"

Write-Host "Generando apple-touch-icon.png..." -ForegroundColor Cyan
magick "$srcIcon[0]" -resize 180x180 "$assetsDir\apple-touch-icon.png"

Write-Host "Generando favicon.png (512x512)..." -ForegroundColor Cyan
magick "$srcIcon[0]" -resize 512x512 "$assetsDir\favicon.png"

Write-Host "¡Favicons generados exitosamente!" -ForegroundColor Green
Write-Host "Archivos creados en: $assetsDir" -ForegroundColor Yellow
