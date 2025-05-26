import { Component, type OnInit, inject, type OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { ThemeService } from "@app/services/theme.service"
import { LanguageService } from "@app/services/language.service"
import { CvGeneratorAtsService } from "@app/services/cv-generator.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-navbar",
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkTheme = false
  currentLanguage = "es"
  mobileMenuOpen = false
  scrolled = false
  isGeneratingCV = false;
  private subscriptions: Subscription[] = []

  private themeService = inject(ThemeService)
  private languageService = inject(LanguageService)
  private translate = inject(TranslateService)
  private cvGeneratorService: CvGeneratorAtsService = inject(CvGeneratorAtsService)

  ngOnInit() {
    // Suscribirse a cambios de tema
    this.subscriptions.push(
      this.themeService.isDarkTheme$.subscribe((isDark) => {
        this.isDarkTheme = isDark
      }),
    )

    // Suscribirse a cambios de idioma
    this.subscriptions.push(
      this.languageService.currentLanguage$.subscribe((lang) => {
        this.currentLanguage = lang
      }),
    )

    // Detectar scroll para cambiar el estilo del navbar
    window.addEventListener("scroll", this.handleScroll.bind(this))
  }

  handleScroll() {
    this.scrolled = window.scrollY > 20
  }

  toggleTheme() {
    this.themeService.toggleTheme()
  }

  setLanguage(lang: "es" | "en") {
    this.languageService.setLanguage(lang)
    this.toggleLanguageDropdown(false)
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  toggleLanguageDropdown(show?: boolean) {
    const dropdown = document.getElementById("language-dropdown")
    if (dropdown) {
      if (show !== undefined) {
        dropdown.classList.toggle("hidden", !show)
      } else {
        dropdown.classList.toggle("hidden")
      }
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false
  }

  /**
   * Genera y descarga el CV en formato PDF
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
    window.removeEventListener("scroll", this.handleScroll.bind(this))
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
