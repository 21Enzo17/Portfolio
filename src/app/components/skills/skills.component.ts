import { Component, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { IconService, CustomIcon, Skill } from "../../services/icon.service"

@Component({
  selector: "app-skills",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./skills.component.html",
  styleUrls: ["./skills.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SkillsComponent {
  
  constructor(private iconService: IconService) {}

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
}
