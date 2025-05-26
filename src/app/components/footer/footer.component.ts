import { Component, type ElementRef, ViewChild, type AfterViewInit, type OnDestroy, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { LanguageService } from "@app/services/language.service"
import { CvGeneratorLazyService } from "@app/services/cv-generator-lazy.service"
import { SOCIAL_CONFIG } from "@app/config/social.config"

@Component({
  selector: "app-footer",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FooterComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild("backToTopButton") backToTopButton!: ElementRef
  language = "es"
  isGeneratingCV = false

  // Exponer configuración social para uso en template
  socialConfig = SOCIAL_CONFIG;

  private languageService = inject(LanguageService)
  private cvGeneratorService = inject(CvGeneratorLazyService)

  ngOnInit() {
    // Suscribirse a cambios de idioma
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.language = lang
    })
  }

  ngAfterViewInit() {
    // Asegurarse de que el botón tenga el evento onClick
    if (this.backToTopButton && this.backToTopButton.nativeElement) {
      this.backToTopButton.nativeElement.addEventListener("click", this.scrollToTop)
    }
  }

  // Método para volver arriba
  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
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
      await this.cvGeneratorService.generateCV();
    } catch (error) {
      console.error('Error al generar el CV:', error);
    } finally {
      this.isGeneratingCV = false;
    }
  }

  ngOnDestroy() {
    // Limpiar el evento al destruir el componente
    if (this.backToTopButton && this.backToTopButton.nativeElement) {
      this.backToTopButton.nativeElement.removeEventListener("click", this.scrollToTop)
    }
  }
}
