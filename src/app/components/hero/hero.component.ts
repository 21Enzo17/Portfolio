import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { LanguageService } from "@app/services/language.service"
import { CvGeneratorAtsService } from "@app/services/cv-generator.service"
import { SOCIAL_CONFIG } from "@app/config/social.config"

@Component({
  selector: "app-hero",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./hero.component.html",
  styleUrls: ["./hero.component.scss"],
})
export class HeroComponent implements OnInit {
  language = "es"
  profileImage = "/assets/FotoPerfil.webp" // Imagen directa ya que existe
  isGeneratingCV = false
  showCVModal = false
  socialConfig = SOCIAL_CONFIG

  private languageService = inject(LanguageService)
  private cvGeneratorService: CvGeneratorAtsService = inject(CvGeneratorAtsService)

  ngOnInit() {
    // Suscribirse a cambios de idioma
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.language = lang
    })
  }

  /**
   * Abre el modal de opciones del CV
   */
  openCVModal() {
    this.showCVModal = true;
  }

  /**
   * Cierra el modal de opciones del CV
   */
  closeCVModal() {
    this.showCVModal = false;
  }

  /**
   * Previsualiza el CV en una nueva ventana
   */
  async previewCV() {
    if (this.isGeneratingCV) {
      return;
    }
    
    try {
      this.isGeneratingCV = true;
      this.closeCVModal();
      // Obtener el elemento HTML de la previsualización
      const previewElement = await this.cvGeneratorService.previewAtsCV();
      
      // Crear una nueva pestaña para mostrar la previsualización
      const newTab = window.open('', '_blank');
      if (newTab) {
        newTab.document.write(`
          <!DOCTYPE html>
          <html>
            <head>
              <title>Previsualización CV - ${this.language === 'es' ? 'Enzo Meneghini' : 'Enzo Meneghini'}</title>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style>
                body { 
                  margin: 0; 
                  padding: 20px; 
                  background: #f0f0f0; 
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                }
                .cv-preview { 
                  background: white; 
                  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                  border-radius: 8px;
                  overflow: hidden;
                }
                @media print {
                  body { background: white; padding: 0; }
                  .cv-preview { box-shadow: none; border-radius: 0; }
                }
              </style>
            </head>
            <body>
              ${previewElement.outerHTML}
              <script>
                // Mejorar experiencia de impresión
                window.addEventListener('beforeprint', function() {
                  document.body.style.background = 'white';
                  document.body.style.padding = '0';
                });
                window.addEventListener('afterprint', function() {
                  document.body.style.background = '#f0f0f0';
                  document.body.style.padding = '20px';
                });
              </script>
            </body>
          </html>
        `);
        newTab.document.close();
        
        // Verificar si se pudo abrir la pestaña
        if (newTab.closed || !newTab.location) {
          throw new Error('Popup bloqueado');
        }
      } else {
        throw new Error('No se pudo abrir la pestaña');
      }
    } catch (error) {
      console.error('Error al previsualizar el CV:', error);
      // Si hay problema con popups bloqueados, mostrar mensaje al usuario
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      if (errorMessage === 'Popup bloqueado' || errorMessage === 'No se pudo abrir la pestaña') {
        alert(this.language === 'es' 
          ? 'Tu navegador bloqueó la pestaña. Por favor, permite popups para este sitio e intenta nuevamente.' 
          : 'Your browser blocked the tab. Please allow popups for this site and try again.');
      }
    } finally {
      this.isGeneratingCV = false;
    }
  }

  /**
   * Genera y descarga el CV en formato PDF basado en los datos actuales
   */
  async generateCV() {
    if (this.isGeneratingCV) {
      return; // Evitar múltiples clics
    }
    
    try {
      this.isGeneratingCV = true;
      this.closeCVModal();
      await this.cvGeneratorService.generateCV();
    } catch (error) {
      console.error('Error al generar el CV:', error);
    } finally {
      this.isGeneratingCV = false;
    }
  }
}
