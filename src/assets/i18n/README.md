# Estructura de Traducciones (i18n)

Este directorio contiene las traducciones del portfolio en una estructura modular y organizada.

## Estructura de Archivos

```
i18n/
├── es/                         # Traducciones en español
│   ├── metadata.json           # Metadatos del idioma
│   ├── nav.json               # Navegación y elementos comunes
│   ├── hero.json              # Sección hero/presentación
│   ├── experience.json        # Experiencia laboral
│   ├── education.json         # Educación y formación
│   ├── languages.json         # Idiomas y certificaciones
│   ├── projects.json          # Proyectos (el más grande)
│   ├── skills.json            # Habilidades técnicas y blandas
│   └── footer.json            # Pie de página
├── en/                         # Traducciones en inglés
│   ├── metadata.json
│   ├── nav.json
│   ├── hero.json
│   ├── experience.json
│   ├── education.json
│   ├── languages.json
│   ├── projects.json
│   ├── skills.json
│   └── footer.json
├── es.json.backup             # Backup del archivo monolítico antiguo
└── en.json.backup             # Backup del archivo monolítico antiguo
```

## Ventajas de la Estructura Modular

✅ **Legibilidad**: Archivos más pequeños y enfocados en una sección específica
✅ **Mantenibilidad**: Más fácil encontrar y editar contenido
✅ **Colaboración**: Menos conflictos de merge en git
✅ **Escalabilidad**: Agregar nuevas secciones sin afectar las existentes
✅ **Performance**: Carga paralela de archivos

## Cómo Agregar una Nueva Sección

1. Crea el archivo JSON en ambas carpetas (es/ y en/)
2. Agrega el archivo al loader en `src/app/services/multi-translate-loader.ts`:

```typescript
{ prefix: "./assets/i18n/", suffix: "/nueva-seccion.json" }
```

3. La nueva sección se combinará automáticamente con las demás

## Cómo Agregar un Nuevo Idioma

1. Crea una nueva carpeta con el código del idioma (ej: `fr/`)
2. Copia todos los archivos JSON de `es/` o `en/`
3. Traduce el contenido
4. Agrega el idioma en `language.service.ts`:

```typescript
this.translate.addLangs(["es", "en", "fr"])
```

## Contenido de Cada Archivo

### metadata.json
- Información del idioma y versión

### nav.json
- Elementos de navegación
- Botones comunes
- Textos reutilizables

### hero.json
- Título principal
- Bio/presentación
- Keywords

### experience.json
- Historial laboral completo
- Responsabilidades
- Tecnologías por trabajo

### education.json
- Formación académica
- Certificaciones
- Logros educativos

### languages.json
- Idiomas hablados
- Niveles de competencia
- Certificaciones lingüísticas

### projects.json
- **El archivo más grande**
- Lista completa de proyectos
- Categorías y filtros
- Textos de búsqueda

### skills.json
- Habilidades técnicas
- Habilidades blandas
- Herramientas y tecnologías

### footer.json
- Información de contacto
- Enlaces rápidos
- Copyright

## Notas Técnicas

- Los archivos se cargan en **paralelo** usando `forkJoin`
- Se combinan automáticamente en un solo objeto
- El loader personalizado está en `src/app/services/multi-translate-loader.ts`
- La configuración está en `src/app/app.config.ts`

## Migración desde Archivos Monolíticos

Los archivos antiguos (`es.json` y `en.json`) se mantienen como backup con extensión `.backup`. 
Puedes eliminarlos de forma segura una vez que verifiques que todo funciona correctamente.
