import { Injectable } from '@angular/core';

/**
 * Interfaz para definir íconos personalizados que no están disponibles en Iconify
 */
export interface CustomIcon {
  type: 'text' | 'html';
  content: string;
  styles: { [key: string]: string };
}

/**
 * Interfaz para habilidades con información de icono
 */
export interface Skill {
  name: string;
  icon?: string;
}

/**
 * Servicio centralizado para gestión de iconos
 * Unifica toda la lógica de iconos que estaba duplicada en Projects, Skills y Experience components
 */
@Injectable({
  providedIn: 'root'
})
export class IconService {

  /**
   * Mapeo centralizado de tecnologías a íconos de Iconify
   * Consolidado desde projects.component.ts, skills.component.ts y experience.component.ts
   */
  private readonly techIcons: Record<string, string> = {
    // Frontend Technologies
    'html': 'logos:html-5',
    'html5': 'logos:html-5',
    'css': 'logos:css-3',
    'css3': 'logos:css-3',
    'javascript': 'logos:javascript',
    'typescript': 'logos:typescript-icon',
    'angular': 'logos:angular-icon',
    'vue': 'logos:vue',
    'react': 'logos:react',
    'nextjs': 'logos:nextjs-icon',
    'next.js': 'logos:nextjs-icon',
    'bootstrap': 'logos:bootstrap',
    'tailwind': 'logos:tailwindcss-icon',
    'tailwindcss': 'logos:tailwindcss-icon',
    'tailwind css': 'logos:tailwindcss-icon',
    'sass': 'logos:sass',
    'wordpress': 'logos:wordpress-icon',

    // Backend Technologies
    'java': 'logos:java',
    'spring': 'logos:spring-icon',
    'spring boot': 'logos:spring-icon',
    'hibernate/jpa': 'logos:hibernate',
    'nodejs': 'logos:nodejs-icon',
    'node.js': 'logos:nodejs-icon',
    'python': 'logos:python',
    'express': 'simple-icons:express',
    'laravel': 'logos:laravel',
    'django': 'vscode-icons:file-type-django',
    'php': 'logos:php',
    'ruby': 'logos:ruby',
    'rails': 'logos:rails',

    // Databases
    'mysql': 'logos:mysql',
    'postgresql': 'logos:postgresql',
    'influxdb': 'logos:influxdb',
    'mongodb': 'logos:mongodb-icon',

    // DevOps & Tools
    'docker': 'logos:docker-icon',
    'git': 'logos:git-icon',
    'git/github/gitlab': 'logos:git-icon',
    'github': 'mdi:github',
    'github actions': 'logos:github-actions',
  'github actions/gitlab': 'carbon:deploy',
  'gitlab': 'logos:gitlab',
  'gitlab ci': 'logos:gitlab',
    'ci/cd (github actions)': 'carbon:deploy',
    'nginx': 'logos:nginx',
  'haproxy': 'simple-icons:haproxy',
    'linux': 'logos:linux-tux',
    'linux server admin': 'logos:linux-tux',
  'bash scripting': 'carbon:terminal',
  'bash': 'carbon:terminal',
    'proxmox': 'simple-icons:proxmox',
    'lan/wan networks': 'carbon:network-4',
    'redes lan/wan': 'carbon:network-4',
  'networks': 'carbon:network-4',
  'vpn': 'carbon:vpn',
    
    // Infrastructure & System Administration
    'windows server': 'logos:microsoft-windows',
  'hyper-v': 'simple-icons:hyper',
  'hyper‑v': 'simple-icons:hyper',
  'debian': 'logos:debian',
  'debian/linux': 'logos:debian',
    'sql server': 'simple-icons:microsoftsqlserver',
  'sql': 'mdi:database',
    'vlans': 'carbon:network-4',
    'dns': 'carbon:dns-services',
  'dns/dhcp': 'carbon:dns-services',
    'dhcp': 'carbon:network-4',
  'ssl': 'carbon:security',
  'tls': 'carbon:security',
  'tls/ssl': 'carbon:security',
  'raid': 'mdi:harddisk',
    'firewall': 'carbon:firewall-classic',
  'mikrotik': 'simple-icons:mikrotik',
  'aruba': 'simple-icons:arubanetworks',
  'aruba networks': 'simple-icons:arubanetworks',
  'issabel': 'mdi:phone-voip',

    // Cloud & Services
    'aws': 'logos:aws',
    'firebase': 'logos:firebase',
    'graphql': 'logos:graphql',
    'jwt': 'logos:jwt-icon',

    // AI & Machine Learning
    'ollama': 'mdi:robot',
    'qwen': 'mdi:brain',
    'chromadb': 'mdi:database-search',
    'whisper ai': 'mdi:microphone',
    'llms': 'mdi:robot-outline',
    'rag': 'mdi:book-search',
    'ia (llms)': 'mdi:robot-outline',

    // Hardware & Infrastructure
    'ups': 'mdi:battery-charging',
    
    // Enterprise Support Tools
    'windows 10/11': 'logos:microsoft-windows',
    'active directory': 'mdi:server-network',
    'servicenow': 'mdi:ticket-confirmation',
    'mdt': 'mdi:laptop',
    'sccm': 'mdi:microsoft',
    'office 365': 'logos:microsoft-icon',
    'lan/wifi': 'mdi:wifi',
    'remote desktop': 'mdi:remote-desktop',
    'powershell': 'vscode-icons:file-type-powershell',
    'hardware diagnostics': 'mdi:laptop-account',
    'imaging tools': 'mdi:harddisk-plus',
    'ticketing systems': 'mdi:ticket',
    'itil': 'mdi:book-cog',
    'hse protocols': 'mdi:shield-alert',

    // Development Tools
    'vscode': 'logos:visual-studio-code',
    'electron': 'logos:electron',
    'imagemin': 'vscode-icons:file-type-js',
    'nuxt': 'logos:nuxt-icon',
    'flutter': 'logos:flutter',

    // Encryption & Security
    'bcrypt': 'mdi:encryption',
    'prometheus': 'logos:prometheus',

    // Soft Skills (mapped to carbon icons)
    'liderazgo técnico y toma de decisiones': 'fluent-mdl2:party-leader',
    'technical leadership and decision-making': 'fluent-mdl2:party-leader',
    'resolución de problemas complejos': 'icon-park-outline:thinking-problem',
    'complex problem-solving': 'icon-park-outline:thinking-problem',
    'comunicación efectiva': 'material-symbols:communication-rounded',
  'comunicación efectiva con stakeholders': 'mdi:handshake',
    'effective communication': 'material-symbols:communication-rounded',
  'effective communication with stakeholders': 'mdi:handshake',
    'mentalidad proactiva y orientada al detalle': 'carbon:zoom-in',
    'proactive and detail-oriented mindset': 'carbon:zoom-in',
    'trabajo bajo presión': 'mdi:lightning-bolt',
    'working under pressure': 'mdi:lightning-bolt',
    'espíritu colaborativo': 'carbon:group',
    'collaborative spirit': 'carbon:group',
    'aprendizaje continuo': 'carbon:education',
  'continuous learning': 'carbon:education',

  // Additional Soft Skills (Head of Infrastructure)
  'gestión de incidentes (soporte nivel 3)': 'mdi:alert-decagram',
  'incident management (level 3 support)': 'mdi:alert-decagram',
  'coordinación con proveedores y negociación': 'mdi:handshake',
  'vendor coordination and negotiation': 'mdi:handshake',
  'planificación, priorización y ownership': 'mdi:clipboard-check',
  'planning, prioritization and ownership': 'mdi:clipboard-check',
  'mentoría y capacitación técnica': 'mdi:school-outline',
  'mentoring and technical training': 'mdi:school-outline',
  'trabajo interdisciplinario (it/operaciones)': 'carbon:group',
  'cross-functional collaboration (it/operations)': 'carbon:group',
  'orientación a la seguridad y cumplimiento': 'mdi:shield-check',
  'security- and compliance-oriented mindset': 'mdi:shield-check'
  };

  /**
   * Iconos personalizados para tecnologías que necesitan representación especial
   * Consolidado desde los tres componentes
   */
  private readonly customTechIcons: Record<string, CustomIcon> = {
    'genexus': {
      type: 'text',
      content: 'GX',
      styles: {
        'background-color': '#e53e3e',
        'color': 'white',
        'border-radius': '50%',
        'width': '28px',
        'height': '28px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '12px'
      }
    },
    'haproxy': {
      type: 'text',
      content: 'HA',
      styles: {
        'background-color': '#1f2937',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '10px'
      }
    },
    'aruba': {
      type: 'text',
      content: 'AR',
      styles: {
        'background-color': '#ff7a00',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '10px'
      }
    },
    'servicenow': {
      type: 'text',
      content: 'SN',
      styles: {
        'background-color': '#62d84e',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '10px'
      }
    },
    'office 365': {
      type: 'text',
      content: '365',
      styles: {
        'background-color': '#d83b01',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '9px'
      }
    },
    'bcrypt': {
      type: 'text',
      content: 'BC',
      styles: {
        'background-color': '#4a5568',
        'color': 'white',
        'border-radius': '4px',
        'width': '24px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '10px'
      }
    },
    'imagemin': {
      type: 'text',
      content: 'IM',
      styles: {
        'background-color': '#8bc34a',
        'color': 'white',
        'border-radius': '4px',
        'width': '24px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '9px'
      }
    },
    'redes': {
      type: 'text',
      content: 'LAN',
      styles: {
        'background-color': '#0078d7',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '9px'
      }
    },
    'networks': {
      type: 'text',
      content: 'LAN',
      styles: {
        'background-color': '#0078d7',
        'color': 'white',
        'border-radius': '4px',
        'width': '28px',
        'height': '24px',
        'display': 'flex',
        'align-items': 'center',
        'justify-content': 'center',
        'font-weight': 'bold',
        'font-size': '9px'
      }
    }
  };

  /**
   * Iconos organizados por categoría para el componente Skills
   */
  private readonly techIconsByCategory: Record<string, Record<string, string>> = {
    frontend: {
      'HTML5': 'logos:html-5',
      'CSS3': 'logos:css-3',
      'JavaScript': 'logos:javascript',
      'TypeScript': 'logos:typescript-icon',
      'Vue': 'logos:vue',
      'Angular': 'logos:angular-icon',
      'React': 'logos:react',
      'Tailwind CSS': 'logos:tailwindcss-icon',
      'Bootstrap': 'logos:bootstrap',
      'WordPress': 'logos:wordpress-icon'
    },
    backend: {
      'Java': 'logos:java',
      'Spring Boot': 'logos:spring-icon',
      'Hibernate/JPA': 'logos:hibernate',
      'Node.js': 'logos:nodejs-icon',
      'Python': 'logos:python',
      'Express': 'simple-icons:express',
      'Genexus': 'carbon:application'
    },
    databases: {
      'MySQL': 'logos:mysql',
      'PostgreSQL': 'logos:postgresql',
      'InfluxDB': 'logos:influxdb',
      'MongoDB': 'logos:mongodb-icon'
    },
    devops: {
      'Docker': 'logos:docker-icon',
      'Git/GitHub/GitLab': 'logos:git-icon',
      'CI/CD (GitHub Actions)': 'carbon:deploy',
      'NGINX': 'logos:nginx',
      'Linux Server Admin': 'logos:linux-tux',
      'Bash Scripting': 'carbon:terminal',
      'Proxmox': 'simple-icons:proxmox',
      'LAN/WAN Networks': 'carbon:network-4',
      'Redes LAN/WAN': 'carbon:network-4',
      'Windows Server': 'logos:microsoft-windows',
      'Hyper-V': 'simple-icons:hyper',
      'SQL Server': 'simple-icons:microsoftsqlserver',
      'VLANs': 'carbon:network-4',
      'DNS': 'carbon:dns-services',
      'DHCP': 'carbon:network-4',
      'SSL': 'carbon:security',
      'Firewall': 'carbon:firewall-classic'
    },
    soft: {
      'Liderazgo técnico y toma de decisiones': 'carbon:leadership',
      'Technical leadership and decision-making': 'carbon:leadership',
      'Resolución de problemas complejos': 'carbon:problem',
      'Complex problem-solving': 'carbon:problem',
  'Comunicación efectiva': 'carbon:communication',
  'Effective communication': 'carbon:communication',
  'Comunicación efectiva con stakeholders': 'mdi:handshake',
  'Effective communication with stakeholders': 'mdi:handshake',
      'Mentalidad proactiva y orientada al detalle': 'carbon:zoom-in',
      'Proactive and detail-oriented mindset': 'carbon:zoom-in',
      'Trabajo bajo presión': 'carbon:stress',
      'Working under pressure': 'carbon:stress',
      'Espíritu colaborativo': 'carbon:group',
      'Collaborative spirit': 'carbon:group',
      'Aprendizaje continuo': 'carbon:education',
      'Continuous learning': 'carbon:education'
    }
  };

  /**
   * Obtiene el ícono para una tecnología específica
   * @param tech Nombre de la tecnología
   * @param fallbackIcon Ícono de respaldo si no se encuentra
   * @returns Identificador del ícono de Iconify
   */
  getTechIcon(tech: string, fallbackIcon: string = 'mdi:code-tags'): string {
    const techLower = tech.toLowerCase().trim();
    return this.techIcons[techLower] || fallbackIcon;
  }

  /**
   * Obtiene el ícono para una categoría específica y habilidad
   * @param category Categoría de la habilidad (frontend, backend, etc.)
   * @param skill Habilidad específica o objeto Skill
   * @param fallbackIcon Ícono de respaldo
   * @returns Identificador del ícono de Iconify
   */
  getIconByCategory(category: string, skill: string | Skill, fallbackIcon: string): string {
    const skillName = typeof skill === 'object' ? skill.name : skill;
    
    // Buscar primero en la categoría específica
    if (category && this.techIconsByCategory[category] && this.techIconsByCategory[category][skillName]) {
      return this.techIconsByCategory[category][skillName];
    }
    
    // Si el skill es un objeto y tiene icono definido
    if (typeof skill === 'object' && skill && skill.icon) {
      return skill.icon;
    }
    
    // Buscar en el mapeo general
    return this.getTechIcon(skillName, fallbackIcon);
  }

  /**
   * Verifica si una tecnología tiene un ícono personalizado
   * @param tech Nombre de la tecnología
   * @returns true si tiene ícono personalizado
   */
  hasCustomIcon(tech: string): boolean {
    const techLower = tech.toLowerCase().trim();
    return !!this.customTechIcons[techLower];
  }

  /**
   * Obtiene la configuración de un ícono personalizado
   * @param tech Nombre de la tecnología
   * @returns Configuración del ícono personalizado
   */
  getCustomIcon(tech: string): CustomIcon {
    const techLower = tech.toLowerCase().trim();
    return this.customTechIcons[techLower] || {
      type: 'text',
      content: '',
      styles: {}
    };
  }

  /**
   * Obtiene los estilos CSS para un ícono personalizado
   * @param tech Nombre de la tecnología
   * @returns Objeto con estilos CSS
   */
  getCustomIconStyles(tech: string): { [key: string]: string } {
    return this.hasCustomIcon(tech) ? this.getCustomIcon(tech).styles : {};
  }

  /**
   * Añade o actualiza un ícono de tecnología
   * @param tech Nombre de la tecnología
   * @param icon Identificador del ícono de Iconify
   */
  addTechIcon(tech: string, icon: string): void {
    this.techIcons[tech.toLowerCase().trim()] = icon;
  }

  /**
   * Añade o actualiza un ícono personalizado
   * @param tech Nombre de la tecnología
   * @param customIcon Configuración del ícono personalizado
   */
  addCustomIcon(tech: string, customIcon: CustomIcon): void {
    this.customTechIcons[tech.toLowerCase().trim()] = customIcon;
  }

  /**
   * Obtiene todas las tecnologías disponibles
   * @returns Array con nombres de todas las tecnologías
   */
  getAllTechNames(): string[] {
    return Object.keys(this.techIcons);
  }

  /**
   * Obtiene todas las tecnologías con íconos personalizados
   * @returns Array con nombres de tecnologías con íconos personalizados
   */
  getCustomIconTechNames(): string[] {
    return Object.keys(this.customTechIcons);
  }
}
