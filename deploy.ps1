# Script de despliegue para Windows PowerShell
param(
    [string]$Platform = "vercel"
)

Write-Host "🚀 Iniciando proceso de despliegue de TaskMaster Pro..." -ForegroundColor Cyan

function Write-Success {
    param([string]$Message)
    Write-Host "✅ $Message" -ForegroundColor Green
}

function Write-Error {
    param([string]$Message)
    Write-Host "❌ Error: $Message" -ForegroundColor Red
    exit 1
}

function Write-Info {
    param([string]$Message)
    Write-Host "ℹ️  $Message" -ForegroundColor Blue
}

function Write-Warning {
    param([string]$Message)
    Write-Host "⚠️  $Message" -ForegroundColor Yellow
}

# Verificar si Node.js está instalado
try {
    $nodeVersion = node -v
    Write-Success "Node.js $nodeVersion detectado"
} catch {
    Write-Error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
}

# Limpiar caché y dependencias anteriores
Write-Info "Limpiando caché y dependencias anteriores..."
if (Test-Path "node_modules") { Remove-Item -Recurse -Force "node_modules" }
if (Test-Path "package-lock.json") { Remove-Item -Force "package-lock.json" }
if (Test-Path "dist") { Remove-Item -Recurse -Force "dist" }
if (Test-Path ".angular") { Remove-Item -Recurse -Force ".angular" }

# Instalar dependencias
Write-Info "Instalando dependencias..."
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falló la instalación de dependencias"
}
Write-Success "Dependencias instaladas correctamente"

# Ejecutar tests
Write-Info "Ejecutando tests..."
npm run test:ci
if ($LASTEXITCODE -ne 0) {
    Write-Error "Los tests fallaron"
}
Write-Success "Todos los tests pasaron"

# Construir para producción
Write-Info "Construyendo aplicación para producción..."
npm run build:prod
if ($LASTEXITCODE -ne 0) {
    Write-Error "Falló la construcción"
}
Write-Success "Aplicación construida correctamente"

# Verificar que los archivos de salida existen
if (-not (Test-Path "dist/todo-list")) {
    Write-Error "Los archivos de construcción no se generaron correctamente"
}
Write-Success "Archivos de construcción verificados"

Write-Host ""
Write-Host "🎉 ¡Aplicación lista para desplegar!" -ForegroundColor Green
Write-Host ""
Write-Host "Opciones de despliegue disponibles:" -ForegroundColor Cyan
Write-Host "1. Vercel: npm run deploy:vercel" -ForegroundColor White
Write-Host "2. Netlify: npm run deploy:netlify" -ForegroundColor White
Write-Host "3. Docker: npm run docker:build && npm run docker:run" -ForegroundColor White
Write-Host "4. Manual: Subir carpeta dist/todo-list a tu servidor" -ForegroundColor White
Write-Host ""
Write-Host "Para servidor SSR, ejecuta: npm run serve:ssr" -ForegroundColor Yellow
Write-Host "La aplicación estará disponible en: http://localhost:4000" -ForegroundColor Yellow

# Ejecutar despliegue según la plataforma especificada
switch ($Platform.ToLower()) {
    "vercel" {
        Write-Info "Desplegando en Vercel..."
        npm run deploy:vercel
    }
    "netlify" {
        Write-Info "Desplegando en Netlify..."
        npm run deploy:netlify
    }
    "docker" {
        Write-Info "Construyendo imagen Docker..."
        npm run docker:build
        Write-Info "Ejecutando contenedor..."
        npm run docker:run
    }
    default {
        Write-Info "Plataforma no especificada. Usa: .\deploy.ps1 -Platform vercel|netlify|docker"
    }
}
