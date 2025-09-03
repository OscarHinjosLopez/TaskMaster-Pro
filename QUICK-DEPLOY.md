# 🚀 Guía Rápida de Despliegue

## ⚡ Despliegue Inmediato

### Para Windows (Recomendado)

```powershell
# Opción 1: Vercel (Recomendado)
.\deploy.ps1 -Platform vercel

# Opción 2: Netlify
.\deploy.ps1 -Platform netlify

# Opción 3: Docker Local
.\deploy.ps1 -Platform docker
```

### Para Linux/macOS

```bash
chmod +x deploy.sh
./deploy.sh
```

## 🏆 Mi Recomendación para TaskMaster Pro

**Para tu aplicación, te recomiendo Vercel porque:**

1. ✅ **SSR Nativo**: Tu app usa Server-Side Rendering
2. ✅ **Zero Config**: Funciona out-of-the-box
3. ✅ **CDN Global**: Velocidad mundial
4. ✅ **HTTPS Automático**: Seguridad incluida
5. ✅ **Git Integration**: Deploys automáticos

## 🔥 Pasos para Vercel (5 minutos)

```powershell
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Login en Vercel
vercel login

# 3. Construir y desplegar
npm run build:prod
vercel --prod

# ¡Listo! Tu app estará en línea
```

## 📱 URLs de Tu Aplicación

- **Desarrollo**: http://localhost:4200
- **Preview SSR**: http://localhost:4000 (después de `npm run preview`)
- **Producción**: https://taskmaster-pro-[random].vercel.app

## 🎯 Comandos Útiles

```powershell
# Build optimizado
npm run build:prod

# Test antes de desplegar
npm run test:ci

# Preview local con SSR
npm run preview

# Ver logs del servidor
npm run serve:ssr
```
