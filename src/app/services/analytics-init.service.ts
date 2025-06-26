import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsInitService {

  constructor() {}

  // Inicializar Google Analytics
  initializeAnalytics(): void {
    // Solo cargar en producción o si está explícitamente habilitado
    if (!environment.production && !this.shouldLoadInDevelopment()) {
      console.log('🔍 Analytics deshabilitado en desarrollo');
      return;
    }

    this.loadGoogleAnalytics();
  }

  private shouldLoadInDevelopment(): boolean {
    // Puedes agregar lógica adicional aquí
    // Por ejemplo, verificar una variable de entorno o localStorage
    return localStorage.getItem('enableAnalytics') === 'true';
  }

  private loadGoogleAnalytics(): void {
    const measurementId = environment.analytics.measurementId;
    
    if (!measurementId || measurementId === 'G-XXXXXXXXXX') {
      console.warn('⚠️ ID de Google Analytics no configurado');
      return;
    }

    // Cargar script de gtag
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
    document.head.appendChild(script);

    // Inicializar dataLayer y gtag
    (window as any).dataLayer = (window as any).dataLayer || [];
    (window as any).gtag = function() {
      (window as any).dataLayer.push(arguments);
    };

    const gtag = (window as any).gtag;
    gtag('js', new Date());
    
    // Configuración principal
    gtag('config', measurementId, {
      page_title: document.title,
      page_location: window.location.href,
      send_page_view: true,
      anonymize_ip: true,
      cookie_expires: 63072000, // 2 años
      debug_mode: !environment.production
    });

    console.log('✅ Google Analytics inicializado:', measurementId);
  }

  // Método para habilitar analytics en desarrollo
  enableInDevelopment(): void {
    localStorage.setItem('enableAnalytics', 'true');
    this.initializeAnalytics();
  }

  // Método para deshabilitar analytics en desarrollo
  disableInDevelopment(): void {
    localStorage.removeItem('enableAnalytics');
    console.log('🔍 Analytics deshabilitado en desarrollo');
  }
}
