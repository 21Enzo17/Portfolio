import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { IconService, CustomIcon, Skill } from "../../services/icon.service"
import { AnalyticsService } from "../../services/analytics.service"

// Interfaz para una categoría de habilidades
interface SkillCategory {
  title: string;
  items: Skill[];
}

// Interfaz para las habilidades organizadas por categoría
interface SkillsData {
  frontend: SkillCategory;
  backend: SkillCategory;
  databases: SkillCategory;
  devops: SkillCategory;
  soft: SkillCategory;
}

@Component({
  selector: "app-skills",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkillsComponent {
  skillsData: SkillsData = {
    frontend: { title: '', items: [] },
    backend: { title: '', items: [] },
    databases: { title: '', items: [] },
    devops: { title: '', items: [] },
    soft: { title: '', items: [] }
  };
  
  constructor(
    private translateService: TranslateService,
    private iconService: IconService,
    private analyticsService: AnalyticsService
  ) {
    this.loadSkills();
    
    // Subscribe to language changes to update skills when language changes
    this.translateService.onLangChange.subscribe(() => {
      this.loadSkills();
    });
  }

  private loadSkills() {
    this.translateService.get('skills').subscribe((skillsTranslation: any) => {
      this.skillsData = {
        frontend: skillsTranslation.frontend,
        backend: skillsTranslation.backend,
        databases: skillsTranslation.databases,
        devops: skillsTranslation.devops,
        soft: skillsTranslation.soft
      };
    });
  }

  getIcon(category: string, skill: string | Skill, fallbackIcon: string): string {
    const skillName = typeof skill === 'object' ? skill.name : skill;
    
    // Try to get the icon from the service
    const icon = this.iconService.getTechIcon(skillName);
    if (icon !== 'vscode-icons:file-type-default') {
      return icon;
    }
    
    // If the skill has an icon in its property
    if (typeof skill === 'object' && skill && skill.icon) {
      return skill.icon;
    }
    
    return fallbackIcon;
  }

  // Método para verificar si una tecnología tiene un ícono personalizado
  hasCustomIcon(skill: string): boolean {
    return this.iconService.hasCustomIcon(skill);
  }

  // Método para obtener la configuración de un ícono personalizado
  getCustomIcon(skill: string): CustomIcon {
    return this.iconService.getCustomIcon(skill);
  }

  // Método para obtener estilos inline para un ícono personalizado
  getCustomIconStyles(skill: string): { [key: string]: string } {
    return this.iconService.getCustomIconStyles(skill);
  }

  // Método para rastrear hover en habilidades
  onSkillHover(skillName: string, category: string): void {
    this.analyticsService.trackSkillHover(skillName);
    this.analyticsService.trackEvent('skill_hover_category', 'skills', `${category}_${skillName}`);
  }
}
