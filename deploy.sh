#!/bin/bash

echo "🚀 Iniciando proceso de despliegue de TaskMaster Pro..."

# Colores para la salida
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para mostrar errores
error() {
    echo -e "${RED}❌ Error: $1${NC}"
    exit 1
}

# Función para mostrar éxito
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

# Función para mostrar información
info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Función para mostrar advertencias
warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Por favor instala Node.js 18 o superior."
fi

# Verificar versión de Node.js
NODE_VERSION=$(node -v | sed 's/v//')
REQUIRED_VERSION="18.0.0"

if [[ "$(printf '%s\n' "$REQUIRED_VERSION" "$NODE_VERSION" | sort -V | head -n1)" != "$REQUIRED_VERSION" ]]; then
    error "Se requiere Node.js 18 o superior. Versión actual: $NODE_VERSION"
fi

success "Node.js $NODE_VERSION detectado"

# Limpiar caché y dependencias anteriores
info "Limpiando caché y dependencias anteriores..."
rm -rf node_modules package-lock.json dist .angular

# Instalar dependencias
info "Instalando dependencias..."
npm install || error "Falló la instalación de dependencias"

success "Dependencias instaladas correctamente"

# Ejecutar tests
info "Ejecutando tests..."
npm run test:ci || error "Los tests fallaron"

success "Todos los tests pasaron"

# Construir para producción
info "Construyendo aplicación para producción..."
npm run build:prod || error "Falló la construcción"

success "Aplicación construida correctamente"

# Verificar que los archivos de salida existen
if [ ! -d "dist/todo-list" ]; then
    error "Los archivos de construcción no se generaron correctamente"
fi

success "Archivos de construcción verificados"

echo ""
echo "🎉 ¡Aplicación lista para desplegar!"
echo ""
echo "Opciones de despliegue disponibles:"
echo "1. Vercel: npm run deploy:vercel"
echo "2. Netlify: npm run deploy:netlify"
echo "3. Docker: npm run docker:build && npm run docker:run"
echo "4. Manual: Subir carpeta dist/todo-list a tu servidor"
echo ""
echo "Para servidor SSR, ejecuta: npm run serve:ssr"
echo "La aplicación estará disponible en: http://localhost:4000"
