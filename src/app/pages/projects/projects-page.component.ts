import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { FallbackImageDirective } from "../../directives/fallback-image.directive"
import { IconService, CustomIcon } from "../../services/icon.service"
import { AnalyticsService } from "../../services/analytics.service"
import { NavbarComponent } from "../../components/navbar/navbar.component"
import { FooterComponent } from "../../components/footer/footer.component"
import { BackgroundAnimationComponent } from "../../components/background-animation/background-animation.component"
import { LanguageSwitchIndicatorComponent } from "../../components/language-switch-indicator/language-switch-indicator.component"
import { Router } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

interface Project {
  name: string;
  description: string;
  technologies: string[];
  demoUrl?: string;
  githubUrl?: string;
  docsUrl?: string;
  downloadUrl?: string;
  image?: string;
  category?: string;
  featured?: boolean;
}

type FilterCategory = 'all' | 'frontend' | 'backend' | 'fullstack' | 'infrastructure' | 'devops';

@Component({
  selector: "app-projects-page",
  standalone: true,
  imports: [
    CommonModule, 
    TranslateModule, 
    FallbackImageDirective, 
    NavbarComponent, 
    FooterComponent, 
    BackgroundAnimationComponent,
    LanguageSwitchIndicatorComponent
  ],
  templateUrl: "./projects-page.component.html",
  styleUrls: ["./projects-page.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  selectedCategory: FilterCategory = 'all';
  searchTerm: string = '';
  private destroy$ = new Subject<void>();
  
  // Lista de categorías para los filtros
  categories: FilterCategory[] = ['all', 'frontend', 'backend', 'fullstack', 'infrastructure', 'devops'];

  constructor(
    private translateService: TranslateService,
    private iconService: IconService,
    private analyticsService: AnalyticsService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProjects();
    
    // Subscribe to language changes to update projects when language changes
    this.translateService.onLangChange
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadProjects();
      });
    
    // Scroll to top when component loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  
  private loadProjects() {
    this.translateService.get('projects.items').subscribe((items: Project[]) => {
      this.projects = items;
      this.filterProjects();
      this.cdr.markForCheck(); // Notificar cambios con OnPush
    });
  }
  
  // Filtra los proyectos por categoría y búsqueda
  filterProjects() {
    let result = this.projects;
    
    // Filtrar por categoría
    if (this.selectedCategory !== 'all') {
      result = result.filter(project => 
        project.category === this.selectedCategory
      );
    }
    
    // Filtrar por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      result = result.filter(project => 
        project.name.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        project.technologies.some(tech => tech.toLowerCase().includes(term))
      );
    }
    
    this.filteredProjects = result;
    this.cdr.markForCheck(); // Notificar cambios con OnPush
    
    // Registrar el evento de búsqueda
    if (this.searchTerm.trim()) {
      this.analyticsService.trackEvent('search_projects', 'projects_page', this.searchTerm);
    }
  }
  
  // Cambia la categoría seleccionada
  selectCategory(category: FilterCategory) {
    this.selectedCategory = category;
    this.filterProjects();
    this.analyticsService.trackEvent('filter_projects', 'projects_page', category);
  }
  
  // Maneja el cambio en el campo de búsqueda
  onSearchChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterProjects();
  }
  
  // Limpia la búsqueda
  clearSearch() {
    this.searchTerm = '';
    this.filterProjects();
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
    const isDevMode = false; // En producción esto se puede cambiar
    
    // Si el proyecto tiene una imagen especificada, intentamos usarla
    if (project.image && project.image.trim() !== '') {
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
    this.analyticsService.trackEvent('project_demo_click', 'projects_page', projectName);
  }

  onProjectGithub(projectName: string): void {
    this.analyticsService.trackEvent('project_github_click', 'projects_page', projectName);
  }

  onProjectDocs(projectName: string): void {
    this.analyticsService.trackEvent('project_docs_click', 'projects_page', projectName);
  }

  onProjectDownload(projectName: string): void {
    this.analyticsService.trackEvent('project_download_click', 'projects_page', projectName);
  }

  onProjectView(projectName: string): void {
    this.analyticsService.trackProjectView(projectName);
  }

  // Método para volver a la página principal
  goToHome(): void {
    this.router.navigate(['/']);
    this.analyticsService.trackEvent('go_to_home_click', 'projects_page', 'navigation');
  }

  // TrackBy functions para optimizar el rendering
  trackByProject(index: number, project: Project): string {
    return project.name; // Usar el nombre como identificador único
  }

  trackByTechnology(index: number, tech: string): string {
    return tech;
  }

  trackByCategory(index: number, category: FilterCategory): FilterCategory {
    return category;
  }
}
