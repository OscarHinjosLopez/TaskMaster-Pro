# 🚀 Guía de Despliegue - TaskMaster Pro

## Resumen Ejecutivo

Esta guía proporciona múltiples opciones para desplegar TaskMaster Pro, una aplicación Angular 18 con SSR, Material Design y sistema de internacionalización.

## 📋 Requisitos Previos

- **Node.js**: 18.x o superior
- **npm**: 9.x o superior
- **Angular CLI**: 18.x
- **Git**: Para control de versiones

## 🎯 Opciones de Despliegue

### 1. 🔥 Vercel (Recomendado para SSR)

**¿Por qué Vercel?**

- Soporte nativo para Angular SSR
- Despliegue automático desde Git
- CDN global
- HTTPS automático
- Funciones serverless

**Pasos de configuración:**

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Ejecutar script de despliegue
.\deploy.ps1 -Platform vercel

# 3. O manualmente
npm run build:prod
npm run deploy:vercel
```

**Configuración automática:** Ya incluida en `vercel.json`

### 2. 🌐 Netlify (Para versión SPA)

**¿Cuándo usar Netlify?**

- Proyectos que no requieren SSR
- Hosting estático con CDN
- Funciones serverless opcionales

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Desplegar
npm run build:prod
npm run deploy:netlify
```

**Configuración automática:** Ya incluida en `netlify.toml`

### 3. 🐳 Docker (Cualquier plataforma)

**¿Cuándo usar Docker?**

- Despliegues en servidores propios
- Entornos de desarrollo/staging
- Integración con Kubernetes

```bash
# Construir imagen
npm run docker:build

# Ejecutar contenedor
npm run docker:run

# O usando PowerShell
.\deploy.ps1 -Platform docker
```

**Plataformas compatibles:**

- DigitalOcean App Platform
- Google Cloud Run
- AWS ECS/Fargate
- Azure Container Instances

### 4. ☁️ Servicios en la Nube

#### **Google Cloud Platform**

```bash
# Cloud Run
gcloud run deploy taskmaster-pro \
  --image gcr.io/[PROJECT-ID]/taskmaster-pro \
  --platform managed \
  --region us-central1
```

#### **AWS**

```bash
# Elastic Beanstalk
eb init taskmaster-pro
eb create production
eb deploy
```

#### **Azure**

```bash
# Container Instances
az container create \
  --resource-group myResourceGroup \
  --name taskmaster-pro \
  --image [YOUR-REGISTRY]/taskmaster-pro
```

## 🛠️ Scripts de Despliegue Automatizados

### Windows PowerShell

```powershell
# Despliegue completo con tests
.\deploy.ps1 -Platform vercel

# Solo construcción
npm run build:prod

# Preview local
npm run preview
```

### Bash/Linux/macOS

```bash
# Dar permisos de ejecución
chmod +x deploy.sh

# Ejecutar
./deploy.sh
```

## 🔧 Configuración de CI/CD

### GitHub Actions

Ya incluido en `.github/workflows/deploy.yml`:

- ✅ Tests automatizados
- ✅ Construcción multi-plataforma
- ✅ Despliegue a Vercel
- ✅ Construcción de imagen Docker

**Variables de entorno requeridas:**

```
VERCEL_TOKEN=tu_token_de_vercel
ORG_ID=tu_org_id_de_vercel
PROJECT_ID=tu_project_id_de_vercel
DOCKER_USERNAME=tu_usuario_docker
DOCKER_PASSWORD=tu_password_docker
```

## 📊 Optimizaciones de Rendimiento

### Construcción Optimizada

```bash
# Construcción con optimizaciones máximas
ng build --configuration=production \
  --optimization=true \
  --aot=true \
  --build-optimizer=true \
  --common-chunk=true \
  --vendor-chunk=true \
  --extract-licenses=true \
  --source-map=false
```

### Análisis de Bundle

```bash
# Instalar webpack-bundle-analyzer
npm install -g webpack-bundle-analyzer

# Construir con estadísticas
ng build --stats-json

# Analizar
webpack-bundle-analyzer dist/todo-list/stats.json
```

## 🔒 Consideraciones de Seguridad

### Headers de Seguridad

Ya configurados en los archivos de despliegue:

- Content Security Policy
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy

### Variables de Entorno

- Nunca commitear archivos `.env` con datos sensibles
- Usar servicios de gestión de secretos en producción
- Rotar tokens y claves regularmente

## 🔍 Monitorización y Analytics

### Google Analytics

```typescript
// En src/app/services/analytics.service.ts
// Ya configurado para producción
```

### Error Tracking

Recomendamos integrar:

- Sentry para tracking de errores
- LogRocket para sesiones de usuario
- Google Analytics para métricas

## 📈 Escalabilidad

### CDN

- ✅ Vercel: CDN automático
- ✅ Netlify: CDN global
- 🔧 Cloudflare: Para implementaciones custom

### Caché

```javascript
// Service Worker automático con Angular
// Configurado en angular.json
```

## 🆘 Troubleshooting

### Errores Comunes

**Error: "Module not found"**

```bash
rm -rf node_modules package-lock.json
npm install
```

**Error de memoria en construcción**

```bash
export NODE_OPTIONS="--max-old-space-size=8192"
npm run build:prod
```

**Problemas de SSR**

```bash
# Verificar servidor local
npm run serve:ssr
```

### Logs y Debugging

```bash
# Construcción verbose
ng build --verbose

# Servidor con logs
DEBUG=* npm run serve:ssr
```

## 📞 Soporte

Para problemas específicos:

1. Verificar logs de construcción
2. Revisar configuración de entorno
3. Comprobar compatibilidad de versiones
4. Consultar documentación oficial de la plataforma

---

## 🎯 Recomendación Final

Para **TaskMaster Pro**, recomendamos:

1. **Desarrollo**: `npm start` (desarrollo local)
2. **Staging**: Vercel con rama `develop`
3. **Producción**: Vercel con rama `main`
4. **Enterprise**: Docker + Kubernetes

La configuración actual está optimizada para **Vercel** con SSR completo, proporcionando la mejor experiencia de usuario y SEO.
