import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CvGeneratorLazyService {
  
  constructor(private translateService: TranslateService) {}

  /**
   * Carga dinámicamente el servicio CV Generator con todas sus dependencias
   * Solo se cargan cuando realmente se necesita generar un CV
   */
  async generateCV(
    photoUrl?: string,
    themeName: string = 'ats_professional',
    customTheme?: any,
    keywords?: string[]
  ): Promise<void> {
    try {
      // Lazy loading del servicio CV Generator
      const { CvGeneratorAtsService } = await import('./cv-generator.service');
      
      // Crear instancia del servicio
      const cvService = new CvGeneratorAtsService(this.translateService);
      
      // Generar el CV
      await cvService.generateCV(photoUrl, themeName as any, customTheme, keywords);
      
    } catch (error) {
      console.error('Error al cargar o generar el CV:', error);
      throw new Error('No se pudo generar el CV. Por favor, inténtelo de nuevo.');
    }
  }

  /**
   * Previsualización del CV con lazy loading
   */
  async previewCV(
    photoUrl?: string,
    themeName: string = 'ats_professional',
    customTheme?: any,
    keywords?: string[]
  ): Promise<HTMLElement> {
    try {
      // Lazy loading del servicio CV Generator
      const { CvGeneratorAtsService } = await import('./cv-generator.service');
      
      // Crear instancia del servicio
      const cvService = new CvGeneratorAtsService(this.translateService);
      
      // Generar la previsualización
      return await cvService.previewAtsCV(photoUrl, themeName as any, customTheme, keywords);
      
    } catch (error) {
      console.error('Error al cargar o previsualizar el CV:', error);
      throw new Error('No se pudo previsualizar el CV. Por favor, inténtelo de nuevo.');
    }
  }
}
