import { Component, CUSTOM_ELEMENTS_SCHEMA, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { FallbackImageDirective } from "../../directives/fallback-image.directive"
import { IconService, CustomIcon } from "../../services/icon.service"
import { AnalyticsService } from "../../services/analytics.service"
import { RouterModule } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

interface Project {
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  downloadUrl?: string;
  image?: string; // Ruta a la imagen del proyecto
  featured?: boolean;
  category?: string;
}

@Component({
  selector: "app-projects",
  standalone: true,
  imports: [CommonModule, TranslateModule, FallbackImageDirective, RouterModule],
  templateUrl: "./projects.component.html",
  styleUrls: ["./projects.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsComponent implements OnDestroy {
  projects: Project[] = [];
  featuredProjects: Project[] = [];
  private destroy$ = new Subject<void>();

  constructor(
    private translateService: TranslateService,
    private iconService: IconService,
    private analyticsService: AnalyticsService,
    private cdr: ChangeDetectorRef
  ) {
    this.loadProjects();
    
    // Subscribe to language changes to update projects when language changes
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProjects();
      });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadProjects() {
    this.translateService.get('projects.items').subscribe((items: Project[]) => {
      this.projects = items;
      // Filtrar solo los proyectos destacados
      this.featuredProjects = items.filter(project => project.featured === true);
      this.cdr.markForCheck(); // Notificar cambios con OnPush
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

  // Mapa de fallbacks específicos por categoría
  private categoryFallbacks: Record<string, string> = {
    'frontend': 'frontend-fallback.svg',
    'backend': 'backend-fallback.svg',
    'fullstack': 'fullstack-fallback.svg',
    'infrastructure': 'infrastructure-fallback.svg',
    'devops': 'devops-fallback.svg'
  };
  
  // Método para obtener una imagen para el proyecto con sistema de fallback
  getProjectImage(project: Project): string {
    // Si el proyecto tiene una imagen especificada y no está vacía, la usamos directamente
    if (project.image && project.image.trim() !== '') {
      return `assets/projects/${project.image}`;
    }
    
    // Si no tiene imagen válida o está vacía, usamos el fallback por categoría
    return this.getFallbackForProject(project);
  }
  
  // Obtiene la ruta de fallback para un proyecto específico basada en su categoría
  getFallbackForProject(project: Project): string {
    // Si el proyecto tiene categoría, usamos el fallback específico de esa categoría
    if (project.category && this.categoryFallbacks[project.category]) {
      return `assets/projects/fallbacks/${this.categoryFallbacks[project.category]}`;
    }
    
    // Si no tiene categoría o la categoría no está en el mapa, usamos el sistema anterior (hash)
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

  // Método para rastrear cuando se hace clic en "Ver todos los proyectos"
  onViewAllProjects(): void {
    this.analyticsService.trackEvent('view_all_projects_click', 'projects', 'from_home');
  }

  // TrackBy functions para optimizar el rendering
  trackByProject(index: number, project: Project): string {
    return project.name; // Usar el nombre como identificador único
  }

  trackByTechnology(index: number, tech: string): string {
    return tech;
  }
}
