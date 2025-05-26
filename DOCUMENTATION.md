# Documentación del Portfolio Angular

## Guía para modificar archivos JSON del proyecto

Este documento proporciona instrucciones detalladas sobre cómo modificar los archivos JSON de traducción y configuración del portfolio. Estos archivos contienen toda la información que se muestra en el sitio web, lo que te permite actualizar el contenido sin necesidad de modificar el código fuente.

## Tabla de contenidos

1. [Estructura general de los archivos JSON](#estructura-general-de-los-archivos-json)
2. [Archivos de traducción](#archivos-de-traducción)
   - [Añadir/Modificar información personal](#añadirmodificar-información-personal)
   - [Experiencia laboral](#experiencia-laboral)
   - [Educación](#educación)
   - [Certificaciones](#certificaciones)
   - [Proyectos](#proyectos)
   - [Habilidades y tecnologías](#habilidades-y-tecnologías)
3. [Iconos](#iconos)
   - [Cómo encontrar nuevos iconos](#cómo-encontrar-nuevos-iconos)
   - [Formatos de iconos soportados](#formatos-de-iconos-soportados)
4. [Consejos para editar JSON](#consejos-para-editar-json)
5. [Sistema de imágenes para proyectos](#sistema-de-imágenes-para-proyectos)

## Estructura general de los archivos JSON

Los archivos JSON de traducción se encuentran en:
- `src/assets/i18n/es.json` (Español)
- `src/assets/i18n/en.json` (Inglés)

Cada archivo tiene la misma estructura, con secciones que corresponden a cada parte del portfolio:

```json
{
  "nav": { ... },      // Navegación
  "hero": { ... },     // Sección principal
  "experience": { ... }, // Experiencia laboral
  "education": { ... },  // Educación
  "certifications": { ... }, // Certificaciones
  "projects": { ... },   // Proyectos
  "skills": { ... },     // Habilidades
  "footer": { ... }     // Pie de página
}
```

## Archivos de traducción

### Añadir/Modificar información personal

Para modificar la información personal (sección Hero):

```json
"hero": {
  "bio": "Desarrollador Full Stack con <span class=\"font-bold\">2 años de experiencia</span> en desarrollo web..."
}
```

**Nota:** Puedes usar etiquetas HTML básicas para dar formato al texto.

### Experiencia laboral

La estructura para añadir experiencia laboral es:

```json
"experience": {
  "title": "Experiencia Laboral",
  "items": [
    {
      "jobTitle": "Desarrollador Full Stack Jr",
      "company": "Nombre de la Empresa",
      "period": "Agosto 2023 - Presente",
      "location": "Ciudad, País · Modalidad",
      "sections": [
        {
          "type": "list",
          "title": "Logros y Responsabilidades:",
          "icon": "💻",
          "content": [
            "Descripción del logro 1",
            "Descripción del logro 2"
          ]
        },
        {
          "type": "technologies",
          "title": "⚙️ Tecnologías utilizadas:",
          "icon": "⚙️",
          "content": ["Java", "Angular", "MySQL"]
        }
      ]
    }
  ]
}
```

#### Tipos de secciones en experiencia:

1. **`list`**: Lista de logros o responsabilidades
2. **`technologies`**: Tecnologías utilizadas (con iconos)
3. **`projects`**: Proyectos realizados con descripciones
4. **`text`**: Texto simple

### Educación

La estructura para añadir educación es:

```json
"education": {
  "title": "Educación",
  "items": [
    {
      "degree": "Título obtenido",
      "institution": "Nombre de la institución",
      "period": "2020 - Presente",
      "location": "Ciudad, País",
      "description": "Breve descripción de la formación."
    }
  ]
}
```

### Certificaciones

La estructura para añadir certificaciones es:

```json
"certifications": {
  "title": "Certificaciones e Idiomas",
  "certificates": [
    {
      "name": "Nombre de la certificación",
      "issuer": "Entidad emisora",
      "date": "2023"
    }
  ],
  "languages": [
    {
      "language": "Español",
      "level": "Nativo"
    }
  ]
}
```

### Proyectos

La estructura para añadir proyectos es:

```json
"projects": {
  "title": "Mis Proyectos",
  "items": [
    {
      "name": "Nombre del Proyecto",
      "description": "Descripción detallada del proyecto.",
      "technologies": ["HTML", "CSS", "JavaScript"],
      "demoUrl": "https://ejemplo.com/demo-proyecto",
      "githubUrl": "https://github.com/username/proyecto",
      "downloadUrl": "https://ejemplo.com/descargar-proyecto",
      "docsUrl": "https://ejemplo.com/documentacion-proyecto"
    }
  ],
  "buttons": {
    "demo": "Demo",
    "github": "GitHub",
    "docs": "Documentación",
    "download": "Descargar"
  }
}
```

Todos los campos URL son opcionales. Solo aparecerán los botones para los que hayas proporcionado una URL.

### Habilidades y tecnologías

La estructura para añadir habilidades es:

```json
"skills": {
  "title": "Tecnologías y Habilidades",
  "frontend": {
    "title": "Frontend",
    "items": [
      { "name": "HTML5", "icon": "logos:html-5" },
      { "name": "CSS3", "icon": "logos:css-3" }
    ]
  },
  "backend": {
    "title": "Backend",
    "items": [
      { "name": "Java", "icon": "logos:java" }
    ]
  },
  "databases": {
    "title": "Bases de Datos",
    "items": [
      { "name": "MySQL", "icon": "logos:mysql" }
    ]
  },
  "devops": {
    "title": "DevOps & Herramientas",
    "items": [
      { "name": "Git", "icon": "logos:git-icon" }
    ]
  },
  "soft": {
    "title": "Habilidades Blandas",
    "items": [
      { "name": "Trabajo en equipo", "icon": "carbon:group" }
    ]
  }
}
```

## Iconos

El proyecto utiliza la biblioteca Iconify para mostrar iconos. Los iconos se especifican usando un formato de string que incluye la colección y el nombre del icono.

### Cómo encontrar nuevos iconos

1. Visita el [buscador de iconos de Iconify](https://icon-sets.iconify.design/)
2. Busca el icono que necesitas
3. Copia el nombre completo del icono, que incluirá el prefijo de la colección

### Formatos de iconos soportados

Formatos más comunes usados en el proyecto:

- **`logos:`** - Iconos de tecnologías y marcas (ej. `logos:react`)
- **`carbon:`** - Iconos de IBM Carbon (ej. `carbon:group`)
- **`vscode-icons:file-type-`** - Iconos similares a VS Code (ej. `vscode-icons:file-type-html`)
- **`simple-icons:`** - Iconos simples de marcas (ej. `simple-icons:express`)

### Ejemplo de adición de iconos:

En `skills.component.ts` o `experience.component.ts` se pueden añadir nuevos iconos:

```typescript
techIcons: Record<string, string> = {
  html: "logos:html-5",
  css: "logos:css-3",
  javascript: "logos:javascript",
  // Añadir nuevos iconos aquí:
  svelte: "logos:svelte-icon",
  flutter: "logos:flutter"
};
```

## Consejos para editar JSON

1. **Mantén la consistencia**: Asegúrate de que ambos archivos de idiomas (`es.json` y `en.json`) tengan la misma estructura.

2. **Valida tu JSON**: Usa una herramienta de validación de JSON como [JSONLint](https://jsonlint.com/) para verificar que tu JSON es válido antes de guardar.

3. **Copia de seguridad**: Haz siempre una copia de seguridad de los archivos antes de editarlos.

4. **Comillas**: En JSON, todas las claves y los valores de texto deben estar entre comillas dobles.

5. **Comas**: No coloques una coma después del último elemento de un array u objeto.

6. **HTML en textos**: Puedes usar HTML básico en los campos de texto para formatearlos, como `<span>`, `<br>`, `<strong>`, etc.

7. **Evita caracteres especiales**: Si necesitas usar caracteres como comillas dentro de un texto, debes escaparlos con una barra invertida (`\"`).

## Sistema de imágenes para proyectos

El portfolio incluye un sistema completo de manejo de imágenes para los proyectos con múltiples niveles de fallback:

### 1. Imágenes personalizadas

Puedes asignar imágenes personalizadas a cada proyecto añadiendo el campo `image` en su configuración JSON:

```json
{
  "name": "Mi Proyecto",
  "description": "...",
  "technologies": ["..."],
  "image": "mi-proyecto.jpg"
}
```

Las imágenes deben colocarse en: `src/assets/projects/`

Formatos recomendados:
- JPG/JPEG para fotografías
- PNG para imágenes con transparencia
- WebP para mejor rendimiento (recomendado por su mejor compresión)
- SVG para gráficos vectoriales

Dimensiones recomendadas: 600x400px con una relación de aspecto 3:2

### 2. Sistema de fallback inteligente

Si una imagen no puede cargarse, el sistema utilizará las siguientes estrategias:

1. **Verificación de extensiones alternativas**: Si la imagen especificada no existe con su extensión original, el sistema intentará buscar la misma imagen con otras extensiones comunes (.jpg, .png, .webp, .svg).

2. **Imagen de fallback determinística**: Si no se encuentra ninguna versión de la imagen especificada, el sistema utilizará una imagen de fallback temática seleccionada mediante un algoritmo de hash basado en el nombre del proyecto. Esto asegura que un mismo proyecto siempre tenga la misma imagen de fallback incluso después de recargar la página.

3. **Placeholder final**: Si la imagen de fallback tampoco puede cargarse, se utilizará la imagen placeholder general del sitio (`assets/placeholder.svg`).

### 3. Directiva de fallback

El sistema utiliza una directiva Angular personalizada `appFallbackImage` que maneja automáticamente los errores de carga de imágenes:

```html
<img [src]="getProjectImage(project)" 
     [alt]="project.name" 
     appFallbackImage [appFallbackImage]="getFallbackForProject(project)">
```

### 4. Organización de archivos

- **Imágenes principales**: `src/assets/projects/`
- **Imágenes de fallback**: `src/assets/projects/fallbacks/`
  - `tech-fallback-1.svg`
  - `tech-fallback-2.svg`
  - `tech-fallback-3.svg`
  - `tech-fallback-4.svg`
- **Placeholder general**: `src/assets/placeholder.svg`

### Personalización

Para personalizar el sistema de fallback:
1. Edita los SVG en `assets/projects/fallbacks/` para cambiar la apariencia de las imágenes de fallback
2. Modifica el array `projectImageFallbacks` en `projects.component.ts` para añadir o cambiar las imágenes disponibles
3. Ajusta la lógica de selección de fallback modificando el método `getFallbackForProject()` en el componente de proyectos

## Sistema de generación de CV

El portfolio incluye un servicio para generar CV en formato PDF optimizado para sistemas ATS (Applicant Tracking Systems) y una previsualización HTML.

### 1. Características principales

- **Generación de PDF**: Crea un CV en formato PDF optimizado para ATS con un diseño profesional.
- **Previsualización HTML**: Permite ver una versión HTML del CV antes de descargar el PDF.
- **Temas personalizables**: Incluye varios temas predefinidos que se pueden personalizar.
- **Soporte multilingüe**: Compatible con los idiomas configurados en la aplicación (español e inglés).
- **Optimización para ATS**: Estructura y formatea el contenido para maximizar la compatibilidad con sistemas ATS.
- **Paginación inteligente**: Maneja automáticamente el flujo de contenido entre páginas.
- **Links a GitHub y Portfolio**: Muestra enlaces a perfiles profesionales y proyectos específicos.

### 2. Configuración personal

La información personal se configura en `src/app/config/personal-info.config.ts`:

```typescript
export const PERSONAL_INFO = {
  name: 'Enzo Meneghini',
  title: 'Full Stack Developer',
  email: 'enzo.meneghini@hotmail.com',
  phone: '+54 388 460-0584',
  linkedin: 'linkedin.com/in/enzomeneghini',
  github: 'github.com/21Enzo17',
  portfolio: 'enzomeneghini.com',
  portfolioUrl: 'https://enzomeneghini.com',
  githubUrl: 'https://github.com/21Enzo17',
};
```

### 3. Links de proyectos en el CV

El CV muestra enlaces a GitHub y demos para cada proyecto. Para incluir estos enlaces, añádelos en la configuración del proyecto en los archivos JSON:

```json
{
  "name": "Nombre del Proyecto",
  "description": "Descripción detallada del proyecto.",
  "technologies": ["HTML", "CSS", "JavaScript"],
  "demoUrl": "https://ejemplo.com/demo-proyecto",
  "githubUrl": "https://github.com/username/proyecto",
  "image": "nombre-imagen.webp"
}
```

### 4. Cómo usar el generador de CV

Para usar programáticamente el generador de CV, inyecta el servicio en tu componente:

```typescript
constructor(private cvService: CvGeneratorAtsService) {}

async generateCV() {
  try {
    await this.cvService.generateCV(
      'url-opcional-de-foto.jpg',
      'ats_professional', // o 'ats_modern', 'ats_elegant'
      { accent: '#4A90E2' }, // personalizaciones opcionales
      ['JavaScript', 'React', 'Node.js'] // palabras clave adicionales
    );
  } catch (error) {
    console.error('Error generando el CV:', error);
  }
}
```

Para la previsualización HTML:

```typescript
async previewCV() {
  try {
    const previewElement = await this.cvService.previewAtsCV();
    const container = document.getElementById('cv-preview-container');
    container.appendChild(previewElement);
  } catch (error) {
    console.error('Error previsualizando el CV:', error);
  }
}
```

### 5. Ruta de prueba

Se ha incluido una ruta de prueba para comprobar el generador de CV:

```
http://localhost:4200/cv-test
```

Esta página permite generar un PDF y ver una previsualización del CV.

---

Esta documentación está diseñada para ayudarte a mantener y actualizar fácilmente tu portfolio. Si tienes preguntas adicionales o necesitas ayuda, no dudes en contactar al desarrollador.