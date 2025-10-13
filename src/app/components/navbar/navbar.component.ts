import { Component, type OnInit, inject, type OnDestroy, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { CommonModule } from "@angular/common"
import { Router } from "@angular/router"
import { TranslateModule, TranslateService } from "@ngx-translate/core"
import { ThemeService } from "@app/services/theme.service"
import { LanguageService } from "@app/services/language.service"
import { AnalyticsService } from "@app/services/analytics.service"
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
  private subscriptions: Subscription[] = []
  private handleScrollBound = this.handleScroll.bind(this)
  private handleClickOutsideBound = this.handleClickOutside.bind(this)

  private themeService = inject(ThemeService)
  private languageService = inject(LanguageService)
  private translate = inject(TranslateService)
  private analyticsService = inject(AnalyticsService)
  private router = inject(Router)

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
    window.addEventListener("scroll", this.handleScrollBound)
    
    // Detectar clics fuera de los dropdowns para cerrarlos
    document.addEventListener("click", this.handleClickOutsideBound)
  }

  handleScroll() {
    this.scrolled = window.scrollY > 20
  }

  handleClickOutside(event: Event) {
    const target = event.target as HTMLElement
    const dropdowns = ["language-dropdown", "language-dropdown-mobile"]
    
    dropdowns.forEach(dropdownId => {
      const dropdown = document.getElementById(dropdownId)
      const button = dropdown?.previousElementSibling as HTMLElement
      
      if (dropdown && !dropdown.classList.contains("hidden")) {
        if (!dropdown.contains(target) && !button?.contains(target)) {
          dropdown.classList.add("hidden")
        }
      }
    })
  }

  toggleTheme() {
    this.themeService.toggleTheme()
    // Rastrear cambio de tema
    const newTheme = this.isDarkTheme ? 'light' : 'dark'
    this.analyticsService.trackThemeChange(newTheme)
  }

  setLanguage(lang: "es" | "en") {
    this.languageService.setLanguage(lang)
    this.toggleLanguageDropdown(false)
    // Rastrear cambio de idioma
    this.analyticsService.trackLanguageChange(lang)
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen
  }

  toggleLanguageDropdown(show?: boolean) {
    // Detectar si estamos en móvil
    const isMobile = window.innerWidth < 768
    const dropdownId = isMobile ? "language-dropdown-mobile" : "language-dropdown"
    const dropdown = document.getElementById(dropdownId)
    
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

  // Navigate to home page
  navigateToHome(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/']).then(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    this.analyticsService.trackEvent('navigation_click', 'navbar', 'home_logo');
  }

  // Analytics method for navigation link clicks
  onNavLinkClick(linkName: string): void {
    this.analyticsService.trackEvent('navigation_click', 'navbar', linkName);
  }

  ngOnDestroy() {
    window.removeEventListener("scroll", this.handleScrollBound)
    document.removeEventListener("click", this.handleClickOutsideBound)
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}
