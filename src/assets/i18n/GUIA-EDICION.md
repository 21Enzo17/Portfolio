# Guía Rápida de Edición - Traducciones

## 📝 Editar Proyectos

**Ubicación**: `src/assets/i18n/{es|en}/projects.json`

### Agregar un nuevo proyecto:
```json
{
  "name": "Nombre del Proyecto",
  "description": "Descripción completa...",
  "technologies": ["Tech1", "Tech2", "Tech3"],
  "githubUrl": "https://github.com/...",
  "demoUrl": "https://...",
  "image": "nombre-imagen.jpg",
  "category": "frontend|backend|fullstack|infrastructure|devops",
  "featured": true|false
}
```

### Modificar filtros o textos de búsqueda:
Edita las secciones `search` y `filter` en el mismo archivo.

---

## 💼 Editar Experiencia

**Ubicación**: `src/assets/i18n/{es|en}/experience.json`

Cada trabajo tiene:
- `jobTitle`: Título del puesto
- `company`: Nombre de la empresa
- `period`: Fechas (formato libre)
- `location`: Ubicación
- `sections`: Array de secciones (lista o tecnologías)

---

## 🎓 Editar Educación

**Ubicación**: `src/assets/i18n/{es|en}/education.json`

Cada ítem educativo tiene:
- `degree`: Título o certificación
- `institution`: Institución educativa
- `period`: Período de estudio
- `type`: "formal" | "course" | "certification"
- `achievements`: Array de logros
- `skills`: Array de habilidades adquiridas

---

## 💻 Editar Habilidades

**Ubicación**: `src/assets/i18n/{es|en}/skills.json`

Categorías disponibles:
- `frontend`: Tecnologías frontend
- `backend`: Tecnologías backend
- `databases`: Bases de datos
- `devops`: DevOps y herramientas
- `opsdb`: DevOps, herramientas y bases de datos (combinado)
- `soft`: Habilidades blandas

Cada skill tiene:
```json
{ "name": "Nombre de la tecnología", "icon": "logo-iconify" }
```

---

## 🌍 Editar Idiomas

**Ubicación**: `src/assets/i18n/{es|en}/languages.json`

Cada idioma tiene:
- `language`: Nombre del idioma
- `level`: Nivel (Nativo, C2, etc.)
- `levelScore`: Puntuación 1-10
- `skills`: { reading, writing, speaking, listening } (1-5)
- `certifications`: Array de certificaciones

---

## 🏠 Editar Hero (Presentación)

**Ubicación**: `src/assets/i18n/{es|en}/hero.json`

Contiene:
- `title`: Título principal
- `subtitle`: Subtítulo
- `keywords`: Array de palabras clave
- `bio`: HTML con biografía (puede contener `<span>` y `<br>`)

---

## 🧭 Editar Navegación

**Ubicación**: `src/assets/i18n/{es|en}/nav.json`

Textos comunes de navegación y botones.

---

## 📬 Editar Footer

**Ubicación**: `src/assets/i18n/{es|en}/footer.json`

Contiene:
- `contact`: Información de contacto
- `quickLinks`: Enlaces rápidos
- `connect`: Sección de conexión
- `copyright`: Texto de derechos

---

## ⚙️ Archivos Técnicos

### metadata.json
Información de versión y metadatos del idioma. No requiere edición frecuente.

---

## 🔄 Después de Editar

1. **Guarda los archivos**
2. **Refresca el navegador** (Ctrl + F5)
3. Los cambios aparecerán automáticamente
4. **No necesitas recompilar** para ver cambios en traducciones

---

## 🚨 Importante

- **Mantén la estructura JSON válida** (comas, llaves, corchetes)
- **Usa comillas dobles** (`"`) para strings
- **No uses comas** al final del último elemento
- **Escapa caracteres especiales** si es necesario: `\"`

---

## 🛠️ Agregar un Nuevo Idioma

1. Crea carpeta: `src/assets/i18n/codigo-idioma/`
2. Copia todos los archivos de `es/` o `en/`
3. Traduce el contenido
4. Agrega el idioma en `src/app/services/language.service.ts`:
   ```typescript
   this.translate.addLangs(["es", "en", "nuevo-codigo"])
   ```

---

## 📚 Agregar Nueva Sección

1. Crea archivo en ambas carpetas: `es/nueva-seccion.json` y `en/nueva-seccion.json`
2. Edita `src/app/services/multi-translate-loader.ts`:
   ```typescript
   { prefix: "./assets/i18n/", suffix: "/nueva-seccion.json" }
   ```
3. La sección se combinará automáticamente

---

## 💡 Tips

- **projects.json** es el archivo más grande (~150 líneas)
- **experience.json** contiene mucho texto técnico
- Usa un editor con validación JSON (VS Code con extensión JSON)
- Haz backup antes de cambios grandes
- Los archivos `.backup` son respaldos de la versión monolítica anterior
