import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../services/analytics.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';

interface Certification {
  name: string;
  issuer: string;
  date?: string;
  url?: string;
  imagePath?: string;
  description?: string;
}

interface LanguageSkills {
  reading: number;
  writing: number;
  speaking: number;
  listening: number;
}

interface Language {
  language: string;
  level: string;
  levelScore: number;
  comment?: string;
  skills: LanguageSkills;
  certifications?: Certification[];
}

@Component({
  selector: 'app-languages',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './languages.component.html',
  styleUrls: ['./languages.component.scss']
})
export class LanguagesComponent implements OnInit, OnDestroy {
  languages: Language[] = [];
  selectedCertificate: Certification | null = null;
  private langChangeSubscription: Subscription | null = null;
  
  constructor(
    private translateService: TranslateService,
    private analyticsService: AnalyticsService,
    private sanitizer: DomSanitizer
  ) {}  ngOnInit(): void {
    // Rastrear vista de la sección de idiomas
    this.analyticsService.trackSectionView('languages');

    // Detectar idioma activo y precargarlo
    const currentLang = this.translateService.currentLang;
    console.log(`Idioma inicial: ${currentLang}`);
    
    // Inicializar el caché de traducciones con el idioma actual
    this.initTranslationCache(currentLang);
    
    // Cargar datos iniciales después de precarga
    setTimeout(() => {
      this.loadLanguagesData();
    }, 100);
    
    // Suscribirse a cambios de idioma y recargar datos cuando cambia
    this.langChangeSubscription = this.translateService.onLangChange.subscribe(event => {
      console.log(`Idioma cambiado a: ${event.lang}, recargando datos de idiomas`);
      
      // Esperar a que el cambio de idioma se propague completamente
      setTimeout(() => {
        // Forzar la recarga completa de los datos para el nuevo idioma
        this.forceLanguageReload(event.lang);
      }, 300);
    });
  }
  /**
   * Inicializa el caché de traducciones para el idioma especificado
   */
  private initTranslationCache(lang: string): void {
    console.log(`Inicializando caché de traducciones para: ${lang}`);
    
    // Reset el caché
    this._translationCache = {};
    
    // Cargar traducciones clave
    this.loadTranslationsForLanguage(lang);
  }
  
  /**
   * Carga las traducciones clave para un idioma específico
   */
  private loadTranslationsForLanguage(lang: string): void {
    // Obtener traducciones clave para asegurarnos de que estén actualizadas
    const keysToLoad = [
      'languages.title',
      'languages.reading',
      'languages.writing',
      'languages.speaking',
      'languages.listening',
      'languages.certifications',
      'languages.viewCertificate',
      'languages.notSpecified',
      'languages.certificateDescription'
    ];
    
    this.translateService.get(keysToLoad).subscribe(translations => {
      console.log(`Traducciones precargadas para ${lang}`);
      
      // Almacenamos las traducciones en el caché
      for (const key in translations) {
        if (translations.hasOwnProperty(key)) {
          const shortKey = key.replace('languages.', '');
          this._translationCache[shortKey] = translations[key];
          this._translationCache[`section_${shortKey}`] = translations[key];
        }
      }
    });
  }
  
  /**
   * Fuerza la recarga completa de los datos de idioma
   */
  private forceLanguageReload(lang: string): void {
    // Obtener el idioma actual para verificación
    console.log(`Forzando recarga para idioma: ${lang}`);
    
    // Limpiar y reinicializar el caché de traducciones
    this._translationCache = {};
    
    // Cargar nuevas traducciones
    this.loadTranslationsForLanguage(lang);
    
    // Recargar los datos completos del idioma
    setTimeout(() => {
      this.loadLanguagesData();
    }, 150);
  }
  
  ngOnDestroy(): void {
    // Limpiar suscripciones para evitar memory leaks
    if (this.langChangeSubscription) {
      this.langChangeSubscription.unsubscribe();
    }
  }
  private loadLanguagesData(): void {
    // Forzar la recarga de traducciones para asegurar que obtenemos los datos actualizados
    const currentLang = this.translateService.currentLang;
    console.log(`Cargando datos de idiomas para: ${currentLang}`);
    
    // Primero obtenemos los datos de las etiquetas de habilidades para forzar su recarga
    this.translateService.get([
      'languages.reading', 
      'languages.writing', 
      'languages.speaking', 
      'languages.listening'
    ]).subscribe(() => {
      // Luego cargamos los items de idiomas
      this.translateService.get('languages.items').subscribe((data: Language[]) => {
        if (data) {
          this.languages = data;
          console.log(`Idiomas cargados (${currentLang}):`, data.length);
        } else {
          console.warn(`No se pudieron cargar los datos de idiomas para: ${currentLang}`);
          this.languages = [];
        }
      });
    });
  }

  onLanguageHover(languageName: string): void {
    this.analyticsService.trackEvent('language_hover', 'languages', languageName);
  }
  
  getLevelPercentage(levelScore: number): number {
    // Asume que levelScore está en escala de 0-10
    return (levelScore / 10) * 100;
  }
  
  showCertificateDetails(certificate: Certification): void {
    this.selectedCertificate = certificate;
    this.analyticsService.trackEvent('certificate_view', 'languages', certificate.name);
    
    // Prevenir scroll en el body cuando el modal está abierto
    document.body.style.overflow = 'hidden';
  }
  
  closeCertificateDetails(): void {
    this.selectedCertificate = null;
    // Restaurar scroll
    document.body.style.overflow = '';
  }    getSkillIcon(skillKey: string): SafeHtml {
    const icons: Record<string, string> = {
      'reading': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 2.748v11.047c3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/></svg>',
      'writing': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/></svg>',
      'speaking': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M3.5 6.5A.5.5 0 0 1 4 7v1a4 4 0 0 0 8 0V7a.5.5 0 0 1 1 0v1a5 5 0 0 1-4.5 4.975V15h3a.5.5 0 0 1 0 1h-7a.5.5 0 0 1 0-1h3v-2.025A5 5 0 0 1 3 8V7a.5.5 0 0 1 .5-.5"/><path d="M10 8a2 2 0 1 1-4 0V3a2 2 0 1 1 4 0zM8 0a3 3 0 0 0-3 3v5a3 3 0 0 0 6 0V3a3 3 0 0 0-3-3"/></svg>',
      'listening': '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5"/></svg>'
    };
    
    return this.sanitizer.bypassSecurityTrustHtml(icons[skillKey] || '📝');
  }
    getLanguageFlag(language: string): string {
    const flags: Record<string, string> = {
      'Español': '🇪🇸',
      'Spanish': '🇪🇸',
      'Inglés': '🇬🇧',
      'English': '🇬🇧',
      'Francés': '🇫🇷',
      'French': '🇫🇷',
      'Alemán': '🇩🇪',
      'German': '🇩🇪',
      'Italiano': '🇮🇹',
      'Italian': '🇮🇹',
      'Portugués': '🇵🇹',
      'Portuguese': '🇵🇹',
      'Chino': '🇨🇳',
      'Chinese': '🇨🇳',
      'Japonés': '🇯🇵',
      'Japanese': '🇯🇵'
    };
    
    return flags[language] || '🌎';
  }
  
  /**
   * Obtiene la traducción actualizada para una habilidad lingüística
   */
  getSkillTranslation(skillKey: string): string {
    // Creamos un caché de traducciones para tener acceso inmediato
    if (!this._translationCache) {
      this._translationCache = {};
    }
    
    // Si no tenemos la traducción en caché, usamos la clave original temporalmente
    // mientras obtenemos la traducción actualizada
    if (!this._translationCache[skillKey]) {
      const translationKey = 'languages.' + skillKey;
      
      // Obtener la traducción y guardarla en caché
      this.translateService.get(translationKey).subscribe(translation => {
        this._translationCache[skillKey] = translation || skillKey;
      });
      
      return this._translationCache[skillKey] || skillKey;
    }
    
    return this._translationCache[skillKey];
  }
    // Caché de traducciones para mejor rendimiento
  private _translationCache: Record<string, string> = {};
  
  /**
   * Obtiene la traducción actualizada para una sección
   */
  getSectionTranslation(section: string): string {
    const cacheKey = `section_${section}`;
    
    if (!this._translationCache[cacheKey]) {
      const translationKey = 'languages.' + section;
      
      // Obtener la traducción y guardarla en caché
      this.translateService.get(translationKey).subscribe(translation => {
        this._translationCache[cacheKey] = translation || section;
      });
      
      return this._translationCache[cacheKey] || section;
    }
    
    return this._translationCache[cacheKey];
  }
}
