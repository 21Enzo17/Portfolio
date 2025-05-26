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
  profileImage = "/assets/placeholder-user.jpg"
  cvExists = false
  isGeneratingCV = false
  socialConfig = SOCIAL_CONFIG

  private languageService = inject(LanguageService)
  private cvGeneratorService: CvGeneratorAtsService = inject(CvGeneratorAtsService)

  ngOnInit() {
    // Suscribirse a cambios de idioma
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.language = lang
    })

    // Verificar si la imagen de perfil existe
    this.checkProfileImage()

    // Verificar si el CV existe
    this.checkCvExists()
  }

  private checkProfileImage() {
    const imgLoader = new Image()
    imgLoader.src = "/assets/yo2.png"
    imgLoader.onload = () => {
      this.profileImage = "/assets/yo2.png"
    }
    imgLoader.onerror = () => {
      this.profileImage = "/assets/placeholder-user.jpg"
    }
  }

  private checkCvExists() {
    fetch("/assets/ENZO MENEGHINI.pdf", { method: "HEAD" })
      .then((response) => {
        this.cvExists = response.ok
      })
      .catch(() => {
        this.cvExists = false
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
}
