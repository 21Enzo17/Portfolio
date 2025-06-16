import { Component, type ElementRef, ViewChild, type AfterViewInit, type OnDestroy, CUSTOM_ELEMENTS_SCHEMA, inject, OnInit } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { LanguageService } from "@app/services/language.service"
import { CvGeneratorLazyService } from "@app/services/cv-generator-lazy.service"
import { AnalyticsService } from "@app/services/analytics.service"
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
  showCVModal = false

  // Exponer configuración social para uso en template
  socialConfig = SOCIAL_CONFIG;

  private languageService = inject(LanguageService)
  private cvGeneratorService = inject(CvGeneratorLazyService)
  private analyticsService = inject(AnalyticsService)

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
   * Abre el modal de opciones de CV
   */
  openCVModal() {
    this.showCVModal = true;
  }

  /**
   * Cierra el modal de opciones de CV
   */
  closeCVModal() {
    this.showCVModal = false;
  }

  /**
   * Maneja el clic en los enlaces de CV de Google Docs
   * @param version La versión del CV ('spanish' o 'english')
   */
  onCvLinkClick(version: string) {
    // Rastrear el clic en el enlace del CV
    this.analyticsService.trackCVDownload();
    // Cerrar el modal después de abrir el enlace
    this.closeCVModal();
  }

  // Métodos para rastrear clics en redes sociales
  onSocialClick(platform: string): void {
    this.analyticsService.trackSocialClick(platform);
  }

  onContactClick(contactType: string): void {
    this.analyticsService.trackContactClick(contactType);
  }

  ngOnDestroy() {
    // Limpiar el evento al destruir el componente
    if (this.backToTopButton && this.backToTopButton.nativeElement) {
      this.backToTopButton.nativeElement.removeEventListener("click", this.scrollToTop)
    }
  }
}
