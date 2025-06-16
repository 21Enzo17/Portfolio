import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { IconService, CustomIcon } from "../../services/icon.service"
import { AnalyticsService } from "../../services/analytics.service"

// Interfaz para una sección genérica
interface ExperienceSection {
  type: string;        // Tipo de sección: 'projects', 'list', 'technologies', 'text', etc.
  title: string;       // Título de la sección
  icon?: string;       // Icono opcional (emoji o clase de icono)
  content: any;        // Contenido flexible según el tipo
}

// Interfaz para una experiencia laboral
interface Experience {
  jobTitle: string;
  company: string;
  period: string;
  location: string;
  sections: ExperienceSection[];  // Array de secciones personalizables
}

@Component({
  selector: "app-experience",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./experience.component.html",
  styleUrls: ["./experience.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ExperienceComponent {
  experiences: Experience[] = [];
  
  constructor(
    private translateService: TranslateService,
    private iconService: IconService,
    private analyticsService: AnalyticsService
  ) {
    this.loadExperiences();
    
    // Subscribe to language changes to update experiences when language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadExperiences();
    });
  }
    private loadExperiences() {
    this.translateService.get('experience.items').subscribe((items: Experience[]) => {
      this.experiences = items;
    });
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

  // Analytics method for technology hover tracking
  onTechnologyHover(technologyName: string): void {
    this.analyticsService.trackEvent('technology_hover', 'experience', technologyName);
  }
}
