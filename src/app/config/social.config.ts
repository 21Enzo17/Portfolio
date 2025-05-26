/**
 * Configuración centralizada de enlaces sociales y contacto
 * Centraliza todas las URLs que están actualmente hardcodeadas en templates
 */
export const SOCIAL_CONFIG = {
  // URLs principales
  linkedin: 'https://www.linkedin.com/in/enzo-meneghini/',
  github: 'https://github.com/21Enzo17',
  portfolio: 'https://enzo-meneghini.netlify.app/',
  
  // Información de contacto
  email: 'enzo.meneghini@example.com', // TODO: Actualizar con email real
  phone: '+54 9 388 123-4567', // TODO: Actualizar con teléfono real
  
  // WhatsApp (versión limpia para enlaces)
  get whatsappUrl(): string {
    return `https://wa.me/${this.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')}`;
  },
  
  // Email clickeable
  get emailUrl(): string {
    return `mailto:${this.email}`;
  },
  
  // URLs completas para enlaces
  get linkedinUrl(): string {
    return this.linkedin;
  },
  
  get githubUrl(): string {
    return this.github;
  },
  
  get portfolioUrl(): string {
    return this.portfolio;
  },
  
  // Etiquetas para mostrar (sin https://)
  get linkedinDisplay(): string {
    return this.linkedin.replace('https://', '');
  },
  
  get githubDisplay(): string {
    return this.github.replace('https://', '');
  },
  
  get portfolioDisplay(): string {
    return this.portfolio.replace('https://', '');
  }
} as const;
