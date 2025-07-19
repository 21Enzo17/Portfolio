import { Injectable, Inject } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

import { SEO_CONFIG } from '../config/seo.config';
import { LanguageService } from './language.service';

/**
 * Servicio mejorado de SEO con soporte para metadatos más específicos
 * y generación dinámica de JSON-LD según la sección actual
 */
@Injectable({
  providedIn: 'root'
})
export class EnhancedSeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private languageService: LanguageService,
    private translateService: TranslateService
  ) {
    // Escuchar cambios en la ruta para actualizar metadatos automáticamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateMetaForRoute(this.router.url);
    });
    
    // Detectar cambios de idioma para actualizar metadatos
    this.languageService.currentLanguage$.subscribe(() => {
      this.updateMetaForRoute(this.router.url);
    });
  }
  
  /**
   * Inicializar SEO con la configuración por defecto
   */
  initDefaultSeo(): void {
    this.updateMetaTags(SEO_CONFIG.defaultMetaTags);
    this.addJsonLd(SEO_CONFIG.jsonLd.person);
  }
  
  /**
   * Actualizar metadatos para una ruta específica
   */
  updateMetaForRoute(url: string): void {
    // Determinar la ruta actual
    const path = this.getRoutePath(url);
    const fragment = this.getFragmentFromUrl(url);
    
    // Obtener configuración para la ruta
    const routeConfig = (SEO_CONFIG.routes as Record<string, any>)[path] || SEO_CONFIG.defaultMetaTags;
    
    // Enriquecer con metadatos adicionales según la sección
    let enhancedConfig = {
      ...SEO_CONFIG.defaultMetaTags,
      ...routeConfig
    };
    
    // Añadir datos específicos según la sección
    if (fragment === 'projects') {
      enhancedConfig.title = `Proyectos | ${SEO_CONFIG.siteName}`;
      enhancedConfig.description = 'Portafolio de proyectos de desarrollo web y aplicaciones, incluyendo tecnologías como Angular, React, Java y más.';
    }
    else if (fragment === 'experience') {
      enhancedConfig.title = `Experiencia | ${SEO_CONFIG.siteName}`;
      enhancedConfig.description = 'Trayectoria profesional y experiencia laboral en desarrollo de software y proyectos tecnológicos.';
    }
    else if (fragment === 'skills') {
      enhancedConfig.title = `Habilidades | ${SEO_CONFIG.siteName}`;
      enhancedConfig.description = 'Stack tecnológico y competencias en desarrollo frontend, backend, bases de datos y herramientas de desarrollo.';
    }
    
    // Obtener traducciones si están disponibles
    this.translateService.get(['metadata', 'hero']).subscribe((translations: any) => {
      // Obtener palabras clave adicionales si están disponibles
      if (translations.hero && translations.hero.keywords) {
        const additionalKeywords = Array.isArray(translations.hero.keywords) 
          ? translations.hero.keywords.join(', ')
          : '';
          
        if (additionalKeywords) {
          enhancedConfig.keywords = `${enhancedConfig.keywords}, ${additionalKeywords}`;
        }
      }
      
      // Actualizar metadatos con configuración enriquecida
      this.updateMetaTags(enhancedConfig);
      
      // Actualizar URL canónica
      this.updateCanonicalUrl(routeConfig.canonicalUrl || url);
      
      // Actualizar datos estructurados según la sección
      this.updateStructuredData(path, fragment);
    });
  }
  
  /**
   * Actualiza los datos estructurados basados en la sección actual
   */
  private updateStructuredData(path: string, fragment: string): void {
    // Seleccionar esquema según la sección
    if (fragment === 'projects') {
      // Crear un esquema específico para proyectos
      const projectsSchema = {
        "@context": "https://schema.org",
        "@type": "ItemList",
        "itemListElement": [
          {
            "@type": "SoftwareSourceCode",
            "name": "Portfolio",
            "programmingLanguage": {
              "@type": "ComputerLanguage",
              "name": ["Angular", "TypeScript"]
            },
            "author": {
              "@type": "Person",
              "name": "Enzo Meneghini"
            }
          }
        ]
      };
      this.addJsonLd(projectsSchema);
    } 
    else if (fragment === 'experience') {
      const experienceSchema = {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        "mainEntity": {
          "@type": "Person",
          "name": "Enzo Meneghini",
          "jobTitle": "Full Stack Developer | Jefe de Infraestructura",
          "workLocation": {
            "@type": "Place", 
            "address": {
              "@type": "PostalAddress",
              "addressLocality": "Jujuy",
              "addressRegion": "Argentina"
            }
          },
          "worksFor": {
            "@type": "Organization",
            "name": "Agua Potable de Jujuy"
          }
        }
      };
      this.addJsonLd(experienceSchema);
    }
    else {
      // Para otras secciones, usar el esquema de persona predeterminado
      this.addJsonLd(SEO_CONFIG.jsonLd.person);
    }
  }
  
  /**
   * Actualizar todos los metadatos para SEO
   */
  private updateMetaTags(config: any): void {
    // Actualizar título
    this.title.setTitle(this.getLocalizedValue(config.title));
    
    // Actualizar metadatos básicos
    this.updateMetaTag('description', this.getLocalizedValue(config.description));
    this.updateMetaTag('keywords', this.getLocalizedValue(config.keywords));
    this.updateMetaTag('author', config.author);
    
    // Metadatos Open Graph
    this.updateMetaTag('og:title', this.getLocalizedValue(config.title));
    this.updateMetaTag('og:description', this.getLocalizedValue(config.description));
    this.updateMetaTag('og:type', SEO_CONFIG.socialMedia.openGraph.type);
    this.updateMetaTag('og:url', `${SEO_CONFIG.siteUrl}${this.router.url}`);
    this.updateMetaTag('og:image', config.image);
    this.updateMetaTag('og:locale', SEO_CONFIG.socialMedia.openGraph.locale);
    this.updateMetaTag('og:site_name', SEO_CONFIG.siteName);
    
    // Metadatos Twitter
    this.updateMetaTag('twitter:card', SEO_CONFIG.socialMedia.twitter.card);
    this.updateMetaTag('twitter:title', this.getLocalizedValue(config.title));
    this.updateMetaTag('twitter:description', this.getLocalizedValue(config.description));
    this.updateMetaTag('twitter:image', config.image);
    this.updateMetaTag('twitter:creator', SEO_CONFIG.socialMedia.twitter.creator);
    this.updateMetaTag('twitter:site', SEO_CONFIG.socialMedia.twitter.site);
    
    // Metadatos adicionales
    if (config.lastModified) {
      this.updateMetaTag('article:modified_time', config.lastModified);
    }
  }
  
  /**
   * Actualizar o agregar una meta tag específica
   */
  private updateMetaTag(name: string, content: string): void {
    // Verificar si existe contenido para la meta tag
    if (!content) return;
    
    // Determinar si es una propiedad o un nombre
    const selector: {property?: string, name?: string} = name.includes(':') ? { property: name } : { name: name };
    
    // Actualizar o crear la meta tag
    if (this.meta.getTag(`${selector.property ? 'property' : 'name'}="${name}"`)) {
      this.meta.updateTag({ content, ...(selector as any) });
    } else {
      this.meta.addTag({ content, ...(selector as any) });
    }
  }
  
  /**
   * Actualizar la URL canónica
   */
  private updateCanonicalUrl(path: string): void {
    // Eliminar el link canónico existente si hay
    const existingLink = this.document.querySelector('link[rel="canonical"]');
    if (existingLink) {
      existingLink.remove();
    }
    
    // Crear nuevo link canónico
    const canonicalUrl = `${SEO_CONFIG.siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const link: HTMLLinkElement = this.document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('href', canonicalUrl);
    this.document.head.appendChild(link);
  }
  
  /**
   * Añadir datos estructurados JSON-LD
   */
  private addJsonLd(jsonLdObject: any): void {
    // Eliminar script existente si hay
    const existingScript = this.document.querySelector('script[type="application/ld+json"]');
    if (existingScript) {
      existingScript.remove();
    }
    
    // Crear script con JSON-LD
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.textContent = JSON.stringify(jsonLdObject);
    this.document.head.appendChild(script);
  }
  
  /**
   * Obtener la ruta base a partir de la URL completa
   */
  private getRoutePath(url: string): string {
    // Eliminar parámetros y fragmentos
    const path = url.split(/[?#]/)[0];
    
    // Obtener segmento principal de la ruta
    const mainSegment = path.split('/')[1] || 'home';
    
    return mainSegment;
  }
  
  /**
   * Obtener el fragmento de la URL (#)
   */
  private getFragmentFromUrl(url: string): string {
    const parts = url.split('#');
    return parts.length > 1 ? parts[1] : '';
  }
  
  /**
   * Obtener el valor localizado según el idioma actual
   */
  private getLocalizedValue(value: string | Record<string, string>): string {
    if (typeof value === 'string') {
      return value;
    }
    
    const currentLang = this.languageService.getCurrentLanguage();
    return value[currentLang] || value['es'] || '';
  }
}
