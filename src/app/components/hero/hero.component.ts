import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule } from "@ngx-translate/core"
import { LanguageService } from "@app/services/language.service"
import { CvGeneratorAtsService } from "@app/services/cv-generator.service"
import { AnalyticsService } from "@app/services/analytics.service"
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

  // Easter Egg: San Expedito
  nameClickCount = 0
  showExpeditoToast = false
  nameGoldenGlow = false
  private nameClickTimeout: ReturnType<typeof setTimeout> | null = null

  private languageService = inject(LanguageService)
  private cvGeneratorService: CvGeneratorAtsService = inject(CvGeneratorAtsService)
  private analyticsService = inject(AnalyticsService)

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
   * Maneja el clic en los enlaces de CV de Google Docs
   * @param version La versión del CV ('spanish' o 'english')
   */
  onCvLinkClick(version: string) {
    // Rastrear el clic en el enlace del CV
    this.analyticsService.trackCVDownload();
    // Cerrar el modal después de abrir el enlace
    this.closeCVModal();
  }

  // Métodos para rastrear clics en redes sociales del hero
  onSocialClick(platform: string): void {
    this.analyticsService.trackSocialClick(platform);
  }

  onContactClick(contactType: string): void {
    this.analyticsService.trackContactClick(contactType);
  }

  /**
   * Easter Egg: 7 clicks en el nombre activa a San Expedito
   */
  onNameClick(): void {
    this.nameClickCount++;

    // Reset después de 3 segundos de inactividad
    if (this.nameClickTimeout) {
      clearTimeout(this.nameClickTimeout);
    }
    this.nameClickTimeout = setTimeout(() => {
      this.nameClickCount = 0;
    }, 3000);

    if (this.nameClickCount >= 7) {
      this.nameClickCount = 0;
      this.triggerExpeditoEasterEgg();
    }
  }

  private triggerExpeditoEasterEgg(): void {
    // Brillar el nombre en dorado
    this.nameGoldenGlow = true;

    // Mostrar toast
    setTimeout(() => {
      this.showExpeditoToast = true;
    }, 300);

    // Ocultar todo después de 6 segundos
    setTimeout(() => {
      this.showExpeditoToast = false;
    }, 6500);

    setTimeout(() => {
      this.nameGoldenGlow = false;
    }, 7000);
  }

  closeExpeditoToast(): void {
    this.showExpeditoToast = false;
    setTimeout(() => {
      this.nameGoldenGlow = false;
    }, 500);
  }
}
