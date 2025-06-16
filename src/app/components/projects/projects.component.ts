import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { FallbackImageDirective } from "../../directives/fallback-image.directive"
import { IconService, CustomIcon } from "../../services/icon.service"
import { AnalyticsService } from "../../services/analytics.service"

interface Project {
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  downloadUrl?: string;
  image?: string; // Ruta a la imagen del proyecto
}

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, TranslateModule, FallbackImageDirective],
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsComponent {
  projects: Project[] = [];

  constructor(
    private translateService: TranslateService,
    private iconService: IconService,
    private analyticsService: AnalyticsService // Inyectar el servicio de Analytics
  ) {
    this.loadProjects();
    
    // Subscribe to language changes to update projects when language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadProjects();
    });
  }
  
  private loadProjects() {
    this.translateService.get('projects.items').subscribe((items: Project[]) => {
      this.projects = items;
    });
  }
  
  // Determina si un proyecto tiene una URL de documentación
  hasDocsUrl(project: Project): boolean {
    return !!project.docsUrl && project.docsUrl !== '#';
  }
  
  // Determina si un proyecto tiene una URL de demostración
  hasDemoUrl(project: Project): boolean {
    return !!project.demoUrl && project.demoUrl !== '#';
  }
    // Método para verificar si una tecnología tiene un ícono personalizado
  hasCustomIcon(tech: string): boolean {
    return this.iconService.hasCustomIcon(tech);
  }

  // Método para obtener la configuración de un ícono personalizado
  getCustomIcon(tech: string): CustomIcon {
    return this.iconService.getCustomIcon(tech);
  }

  // Método para obtener estilos inline para un ícono personalizado
  getCustomIconStyles(tech: string): { [key: string]: string } {
    return this.iconService.getCustomIconStyles(tech);
  }
  
  // Método para obtener el icono correcto para cada tecnología
  getTechIcon(tech: string): string {
    return this.iconService.getTechIcon(tech);
  }
  
  // Listado de imágenes de fallback para los proyectos
  projectImageFallbacks: string[] = [
    'tech-fallback-1.svg',
    'tech-fallback-2.svg',
    'tech-fallback-3.svg',
    'tech-fallback-4.svg',
    'tech-fallback-5.svg'
  ];
  
  // Método para obtener una imagen para el proyecto con sistema de fallback
  getProjectImage(project: Project): string {
    const isDevMode = false; // En producción esto se puede cambiar
    
    // Si el proyecto tiene una imagen especificada, intentamos usarla
    if (project.image) {
      // PRIMERO: Si la imagen especificada es una fallback, la usamos directamente
      if (project.image.startsWith('tech-fallback-')) {
        if (isDevMode) {
          console.log(`Proyecto ${project.name} usa imagen fallback: ${project.image}`);
        }
        return `assets/projects/fallbacks/${project.image}`;
      }
      
      // SEGUNDO: Extraer el nombre del archivo y la extensión para imágenes específicas
      const parts = project.image.split('.');
      if (parts.length >= 2) {
        const fileName = parts.slice(0, -1).join('.');
        const fileExtension = parts[parts.length - 1].toLowerCase();
        
        // Comprobar si la imagen especificada existe
        if (this.imageExistsInAssets(`${fileName}.${fileExtension}`)) {
          if (isDevMode) {
            console.log(`Proyecto ${project.name} usa imagen específica: ${project.image}`);
          }
          return `assets/projects/${project.image}`;
        }
        
        // Probar con diferentes extensiones comunes
        const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
        for (const ext of possibleExtensions) {
          if (ext !== fileExtension && this.imageExistsInAssets(`${fileName}.${ext}`)) {
            if (isDevMode) {
              console.log(`Proyecto ${project.name} usa imagen con extensión alternativa: ${fileName}.${ext}`);
            }
            return `assets/projects/${fileName}.${ext}`;
          }
        }
      } else {
        // Si no hay extensión, intentamos con las extensiones comunes
        const possibleExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg'];
        for (const ext of possibleExtensions) {
          if (this.imageExistsInAssets(`${project.image}.${ext}`)) {
            if (isDevMode) {
              console.log(`Proyecto ${project.name} usa imagen sin extensión especificada: ${project.image}.${ext}`);
            }
            return `assets/projects/${project.image}.${ext}`;
          }
        }
      }
    }
    
    // Si no tiene imagen válida o no se pudo encontrar, usamos una imagen de fallback
    // basada en el nombre del proyecto para garantizar consistencia
    const projectNameHash = this.hashString(project.name);
    const fallbackIndex = projectNameHash % this.projectImageFallbacks.length;
    const fallbackImage = `assets/projects/fallbacks/${this.projectImageFallbacks[fallbackIndex]}`;
    
    if (isDevMode) {
      console.log(`Proyecto ${project.name} usa fallback: ${fallbackImage}`);
    }
    return fallbackImage;
  }
  
  // Obtiene la ruta de fallback para un proyecto específico basada en su nombre
  getFallbackForProject(project: Project): string {
    const projectNameHash = this.hashString(project.name);
    const fallbackIndex = projectNameHash % this.projectImageFallbacks.length;
    return `assets/projects/fallbacks/${this.projectImageFallbacks[fallbackIndex]}`;
  }
  
  // Método para verificar si una imagen existe en assets
  private imageExistsInAssets(filename: string): boolean {
    // En un entorno browser real, no podemos verificar directamente si un archivo existe
    // Así que asumimos que existe y dejamos que el manejo de error de la imagen se active si no existe
    
    // Esta función siempre debe retornar true ya que la verificación real se hace
    // a través del evento de error de la imagen y la directiva appFallbackImage
    return true;
  }
  
  // Método para generar un hash simple a partir de un string
  private hashString(str: string): number {
    let hash = 0;
    if (str.length === 0) return hash;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Conversión a 32bit integer
    }
    
    return Math.abs(hash);
  }
  
  // Manejador de errores de carga de imagen con seguridad de tipos
  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    if (imgElement && imgElement instanceof HTMLImageElement) {
      console.log(`Error cargando imagen: ${imgElement.src}`);
      imgElement.src = 'assets/placeholder.svg';
    }
  }

  // Métodos para rastrear eventos de proyectos
  onProjectDemo(projectName: string): void {
    this.analyticsService.trackEvent('project_demo_click', 'projects', projectName);
  }

  onProjectGithub(projectName: string): void {
    this.analyticsService.trackEvent('project_github_click', 'projects', projectName);
  }

  onProjectDocs(projectName: string): void {
    this.analyticsService.trackEvent('project_docs_click', 'projects', projectName);
  }

  onProjectDownload(projectName: string): void {
    this.analyticsService.trackEvent('project_download_click', 'projects', projectName);
  }

  onProjectView(projectName: string): void {
    this.analyticsService.trackProjectView(projectName);
  }
}
