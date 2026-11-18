# 🚀 Portfolio Personal Angular - README

[![Angular](https://img.shields.io/badge/Angular-18.x-red?style=flat-square&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.x-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![NgxTranslate](https://img.shields.io/badge/ngx--translate-15.x-orange?style=flat-square)](https://github.com/ngx-translate/core)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

> **Portfolio profesional multilenguaje desarrollado con Angular, diseñado para mostrar experiencia, proyectos y habilidades de manera moderna y responsive.**

## 📋 Tabla de Contenidos

- [🎯 Características Principales](#-características-principales)
- [🛠️ Tecnologías Utilizadas](#️-tecnologías-utilizadas)
- [📁 Estructura del Proyecto](#-estructura-del-proyecto)
- [🚀 Instalación y Configuración](#-instalación-y-configuración)
- [📝 Configuración de Contenido](#-configuración-de-contenido)
- [🌐 Internacionalización](#-internacionalización)
- [🎨 Personalización](#-personalización)
- [📄 Contenido y CV](#-contenido-y-cv-una-sola-fuente)
- [🔧 Comandos Disponibles](#-comandos-disponibles)
- [🤝 Contribuir](#-contribuir)

## 🎯 Características Principales

### ✨ Funcionalidades Destacadas

- 🌍 **Soporte multilenguaje** (Español/Inglés) con ngx-translate
- 📱 **Diseño completamente responsive** con Tailwind CSS
- 🎨 **Efectos neumórficos** modernos y animaciones fluidas
- 📄 **CV en PDF (ES/EN)** generado desde una única fuente, en URLs fijas
- 🔍 **SEO optimizado** con metadatos dinámicos y JSON-LD
- ⚡ **Carga rápida** con lazy loading y optimizaciones
- 🎭 **Temas adaptativos** (claro/oscuro)
- 📊 **Gestión de estado centralizada** con servicios Angular
- 🖼️ **Sistema inteligente de imágenes** con fallbacks automáticos
- 🔧 **Configuración modular** para fácil personalización

### 🏗️ Arquitectura Técnica

- **Componentes standalone** para mejor modularidad
- **Servicios centralizados** para lógica de negocio
- **Directivas personalizadas** para funcionalidades específicas
- **Pipes customizados** para transformación de datos
- **Configuración por archivos** para fácil mantenimiento

## 🛠️ Tecnologías Utilizadas

### Frontend Core
```typescript
Angular 18.x           // Framework principal
TypeScript 5.x         // Lenguaje de programación
Tailwind CSS 3.x       // Framework de estilos
SCSS                   // Preprocesador CSS
```

### Librerías Principales
```typescript
@ngx-translate/core    // Internacionalización
iconify-icon           // Sistema de iconos
RxJS                   // Programación reactiva
```

### Herramientas de Desarrollo
```typescript
Angular CLI            // Herramientas de desarrollo
Karma + Jasmine        // Testing
ESLint + Prettier      // Linting y formateo
webpack-bundle-analyzer // Análisis de bundles
```

## 📁 Estructura del Proyecto

```
src/
├── app/
│   ├── components/           # Componentes de UI
│   │   ├── hero/            # Sección principal
│   │   ├── experience/      # Experiencia laboral
│   │   ├── projects/        # Proyectos destacados
│   │   ├── skills/          # Habilidades técnicas
│   │   ├── education/       # Formación académica
│   │   ├── certifications/  # Certificaciones e idiomas
│   │   ├── navbar/          # Navegación
│   │   └── footer/          # Pie de página
│   ├── config/              # Configuraciones globales
│   │   ├── personal-info.config.ts
│   │   ├── seo.config.ts
│   │   └── social.config.ts
│   ├── services/            # Servicios de negocio
│   │   ├── language.service.ts
│   │   ├── enhanced-seo.service.ts
│   │   ├── icon.service.ts
│   │   └── theme.service.ts
│   ├── directives/          # Directivas personalizadas
│   ├── pipes/               # Pipes customizados
│   └── pages/               # Páginas principales
├── assets/
│   ├── i18n/               # Archivos de traducción
│   │   ├── es.json         # Contenido en español
│   │   └── en.json         # Contenido en inglés
│   ├── projects/           # Imágenes de proyectos
│   └── favicon/            # Iconos del sitio
└── styles.scss             # Estilos globales
```

## 🚀 Instalación y Configuración

### Prerrequisitos
```bash
Node.js >= 18.x
npm >= 9.x
Angular CLI >= 18.x
```

### Instalación
```bash
# Clonar el repositorio
git clone https://github.com/tu-usuario/portfolio-angular.git
cd portfolio-angular

# Instalar dependencias
npm install

# Ejecutar en modo desarrollo
npm start

# El sitio estará disponible en http://localhost:4200
```

### Configuración Inicial

1. **Configurar información personal** en `src/app/config/personal-info.config.ts`
2. **Actualizar redes sociales** en `src/app/config/social.config.ts`
3. **Personalizar SEO** en `src/app/config/seo.config.ts`
4. **Modificar contenido** en archivos de traducción `src/assets/i18n/`

## 📝 Configuración de Contenido

### Información Personal
```typescript
// src/app/config/personal-info.config.ts
export const PERSONAL_INFO = {
  name: 'Tu Nombre',
  title: 'Tu Título Profesional',
  email: 'tu@email.com',
  phone: '+XX XXX XXX-XXXX',
  // ... más configuraciones
};
```

### Archivos de Traducción
Los contenidos se gestionan mediante archivos JSON ubicados en `src/assets/i18n/`:

```json
{
  "hero": {
    "bio": "Tu biografía profesional...",
    "title": "Tu título..."
  },
  "experience": {
    "title": "Experiencia Laboral",
    "items": [/* experiencias */]
  },
  "projects": {
    "title": "Mis Proyectos",
    "items": [/* proyectos */]
  }
}
```

### Agregar Nueva Experiencia
```json
{
  "jobTitle": "Desarrollador Full Stack",
  "company": "Nombre Empresa",
  "period": "2023 - Presente",
  "location": "Ciudad, País",
  "sections": [
    {
      "type": "technologies",
      "title": "Tecnologías:",
      "content": ["Angular", "Java", "Spring Boot"]
    }
  ]
}
```

### Agregar Nuevo Proyecto
```json
{
  "name": "Nombre del Proyecto",
  "description": "Descripción detallada...",
  "technologies": ["React", "Node.js", "MongoDB"],
  "githubUrl": "https://github.com/usuario/proyecto",
  "demoUrl": "https://proyecto-demo.com",
  "image": "proyecto-imagen.webp"
}
```

## 🌐 Internacionalización

El portfolio soporta múltiples idiomas utilizando ngx-translate:

### Idiomas Soportados
- 🇪🇸 Español (es)
- 🇺🇸 Inglés (en)

### Cambio de Idioma
- Automático basado en navegador
- Selector manual en la interfaz
- Persistencia en localStorage
- URLs canónicas por idioma

### Agregar Nuevo Idioma
1. Crear archivo `src/assets/i18n/[código].json`
2. Configurar en `language.service.ts`
3. Añadir flag en `src/assets/flags/`

## 🎨 Personalización

### Temas y Colores
```scss
// src/styles.scss
:root {
  --primary: #your-color;
  --secondary: #your-color;
  --accent: #your-color;
  // ... más variables CSS
}
```

### Efectos Neumórficos
Los componentes utilizan clases CSS personalizadas:
```css
.neumorphic {
  box-shadow: 
    8px 8px 16px var(--neumorphic-shadow-dark),
    -8px -8px 16px var(--neumorphic-shadow-light);
}
```

### Iconos
Sistema basado en Iconify con soporte para iconos personalizados:
```typescript
// Uso en componentes
<iconify-icon icon="logos:angular" width="24" height="24"></iconify-icon>
```

## 📄 Contenido y CV: una sola fuente

El contenido del sitio y los CV en PDF **no se editan a mano en este repo**. Se generan desde el CV Maestro de Enzo (carpeta privada `career-assistant`, fuera de este repo) con `resumes/general/build.py`:

- `src/assets/i18n/{es,en}/` → hero, experience, projects, education, skills, footer y metadata
- `src/cv/es.pdf` y `src/cv/en.pdf` → CV general de 1 página (ATS), servidos en las URLs fijas `/cv/es.pdf` y `/cv/en.pdf`
- `src/index.html`, `src/app/config/seo.config.ts`, `src/app/config/social.config.ts`, `src/sitemap.xml` → títulos, descripciones, contacto y fechas

Los textos de la interfaz (botones, menús, filtros) sí se editan acá. Cada actualización llega como PR; Netlify publica al hacer merge a `main`.

## 🔧 Comandos Disponibles

```bash
# Desarrollo
npm start                 # Servidor de desarrollo (ng serve)
npm run watch             # Build con observación de cambios

# Construcción
npm run build             # Build de desarrollo
npm run build:prod        # Build de producción optimizado
npm run build:analyze     # Build con análisis de bundle

# Testing
npm test                  # Ejecutar tests unitarios

# Despliegue
npm run deploy            # Build y preparación para deploy
```


## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 👨‍💻 Autor

**Enzo Meneghini** - Desarrollador Full Stack
- 🌐 Website: [enzomeneghini.com](https://enzomeneghini.com)
- 💼 LinkedIn: [/in/enzomeneghini](https://linkedin.com/in/enzomeneghini)
- 🐱 GitHub: [@21Enzo17](https://github.com/21Enzo17)

---

<div align="center">

**⭐ Si este proyecto te fue útil, no olvides darle una estrella ⭐**

*Portfolio desarrollado con ❤️ y Angular*

</div>
