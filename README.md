# 📋 TaskMaster Pro

<div align="center">

![Angular](https://img.shields.io/badge/Angular-18.2+-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular_Material-18.2+-009688?style=for-the-badge&logo=material-design&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)

**Una aplicación moderna de gestión de tareas construida con Angular 18+ y Material Design**

[🚀 Demo en Vivo](#) | [📖 Documentación](#características) | [🐛 Reportar Bug](mailto:oscarhinjoslopez@gmail.com)

</div>

---

## 🌟 Características

### 📱 **Interfaz de Usuario Moderna**

- **Material Design 3.0**: Componentes elegantes y consistentes
- **Responsive Design**: Adaptable a cualquier dispositivo
- **Animaciones CSS**: Transiciones suaves y microinteracciones
- **Glassmorphism Effects**: Efectos modernos de cristal esmerilado
- **Gradientes Dinámicos**: Paleta de colores vibrante y moderna

### 🌍 **Sistema de Internacionalización (i18n)**

- **Multiidioma**: Soporte completo para Español e Inglés
- **Traducción Dinámica**: Cambio de idioma en tiempo real sin recarga
- **Custom Translation Service**: Sistema propio de traducciones con Angular Signals
- **Persistencia de Idioma**: Guarda la preferencia del usuario

### ⚡ **Tecnologías de Vanguardia**

- **Angular 18.2+**: Última versión con Standalone Components
- **Angular Signals**: Reactividad moderna y optimizada
- **Server-Side Rendering (SSR)**: Mejor SEO y rendimiento inicial
- **TypeScript 5.4+**: Tipado fuerte y características modernas
- **SCSS Avanzado**: Mixins, variables y arquitectura modular

### 🎨 **Sistema de Temas Avanzado**

- **Modo Claro/Oscuro**: Cambio automático o manual
- **Auto Theme**: Detección automática de preferencias del sistema
- **Colores Dinámicos**: Adaptación de colores según el tema
- **Persistencia Local**: Guarda las preferencias del usuario

### 💾 **Gestión de Datos Robusta**

- **Dual Storage Strategy**: IndexedDB con fallback a localStorage
- **Auto-save**: Guardado automático de cambios
- **Import/Export**: Funcionalidad de respaldo y restauración
- **Error Handling**: Manejo robusto de errores de almacenamiento

### 📊 **Analytics y Monitoreo**

- **Custom Analytics Service**: Seguimiento detallado de interacciones
- **Performance Tracking**: Métricas de rendimiento
- **User Behavior**: Análisis de patrones de uso
- **Error Tracking**: Monitoreo de errores en tiempo real

### 🔧 **Arquitectura Avanzada**

- **Standalone Components**: Arquitectura modular sin NgModules
- **Custom Stores**: Gestión de estado con Angular Signals
- **Service-Oriented**: Separación clara de responsabilidades
- **Reactive Programming**: Programación reactiva con RxJS

---

## 🛠️ Tecnologías Utilizadas

### **Frontend Framework**

- **Angular 18.2+** - Framework principal
- **Angular CLI 18.0+** - Herramientas de desarrollo
- **Angular Material 18.2+** - Biblioteca de componentes UI

### **Lenguajes y Preprocesadores**

- **TypeScript 5.4+** - Lenguaje principal
- **SCSS** - Preprocesador CSS
- **HTML5** - Estructura semántica

### **Gestión de Estado y Datos**

- **Angular Signals** - Reactividad moderna
- **RxJS 7.8+** - Programación reactiva
- **IndexedDB** - Base de datos del navegador
- **localStorage** - Almacenamiento de respaldo

### **Herramientas de Desarrollo**

- **Angular DevKit** - Herramientas de construcción
- **Karma + Jasmine** - Testing framework
- **ESLint** - Linting de código
- **Prettier** - Formateo de código

---

## 🚀 Inicio Rápido

### **Prerrequisitos**

```bash
node >= 18.0.0
npm >= 9.0.0
```

### **Instalación**

```bash
# Clonar el repositorio
git clone [repository-url]
cd todo-list

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm start
```

### **Scripts Disponibles**

```bash
npm start          # Servidor de desarrollo (localhost:4200)
npm run build      # Construcción para producción
npm run watch      # Construcción en modo watch
npm test           # Ejecutar tests unitarios
npm run serve:ssr  # Servidor SSR
```

---

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes reutilizables
│   │   ├── agregar-tareas/   # Formulario de nuevas tareas
│   │   ├── header/           # Cabecera de la aplicación
│   │   ├── language-selector/# Selector de idioma flotante
│   │   └── tareas/           # Lista y gestión de tareas
│   ├── pages/
│   │   └── home-page/        # Página principal
│   ├── services/             # Servicios de negocio
│   │   ├── analytics.service.ts     # Analytics y métricas
│   │   ├── language.service.ts      # Gestión de idiomas
│   │   ├── storage.service.ts       # Almacenamiento de datos
│   │   ├── tarea.service.ts         # Lógica de tareas
│   │   ├── theme.service.ts         # Sistema de temas
│   │   └── translation.service.ts   # Sistema de traducciones
│   ├── stores/               # Gestión de estado
│   │   └── task.store.ts     # Store de tareas con Signals
│   └── pipes/                # Pipes personalizadas
│       └── translate.pipe.ts # Pipe de traducción
├── locale/                   # Archivos de internacionalización
│   └── messages.en.xlf       # Traducciones en inglés
└── styles.scss               # Estilos globales
```

---

## 🎯 Funcionalidades Principales

### **Gestión de Tareas**

- ✅ Crear, editar y eliminar tareas
- ✅ Marcar tareas como completadas
- ✅ Categorización por tipos
- ✅ Sistema de prioridades
- ✅ Filtrado y búsqueda avanzada

### **Experiencia de Usuario**

- 🎨 Interfaz moderna con Material Design
- 🌈 Animaciones y transiciones suaves
- 📱 Diseño completamente responsivo
- ⌨️ Navegación por teclado
- ♿ Accesibilidad mejorada

### **Personalización**

- 🌙 Modo oscuro/claro automático
- 🌍 Cambio de idioma en tiempo real
- 💾 Persistencia de preferencias
- 🎛️ Configuraciones avanzadas

### **Rendimiento**

- ⚡ Carga inicial optimizada con SSR
- 🔄 Lazy loading de componentes
- 📦 Tree shaking automático
- 🚀 Optimizaciones de Angular 18+

---

## 🧪 Testing

```bash
# Tests unitarios
npm test

# Tests con coverage
npm run test:coverage

# Tests en modo watch
npm run test:watch
```

---

## 🚀 Deployment

### **Construcción para Producción**

```bash
npm run build

# Los archivos se generan en dist/todo-list/
# Incluye optimizaciones automáticas:
# - Minificación de código
# - Tree shaking
# - Lazy loading
# - Service worker (PWA ready)
```

### **SSR (Server-Side Rendering)**

```bash
npm run serve:ssr

# Beneficios del SSR:
# - Mejor SEO
# - Carga inicial más rápida
# - Mejor rendimiento en dispositivos lentos
```

---

## 👨‍💻 Desarrollador

**Oscar Hinjos López**

- 💼 [LinkedIn](https://www.linkedin.com/in/oscar-hinjos-l%C3%B3pez-b3498320b/)
- 📧 [Email](mailto:oscarhinjoslopez@gmail.com)
- 🐙 [GitHub](https://github.com/oscar-hinjos)

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

---

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit de tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

---

## 📋 Roadmap

- [ ] **PWA Completa**: Service workers y funcionalidad offline
- [ ] **Notificaciones Push**: Recordatorios de tareas
- [ ] **Colaboración**: Compartir tareas entre usuarios
- [ ] **API Backend**: Sincronización en la nube
- [ ] **Plugins**: Sistema extensible de plugins
- [ ] **Tests E2E**: Tests end-to-end con Cypress

---

<div align="center">

**⭐ Si te gusta este proyecto, ¡dale una estrella en GitHub! ⭐**

**Desarrollado con ❤️ usando Angular 18+ y Material Design**

</div>
