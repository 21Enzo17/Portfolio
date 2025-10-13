import { Component, type OnInit, type OnDestroy, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { NavbarComponent } from "@app/components/navbar/navbar.component"
import { HeroComponent } from "@app/components/hero/hero.component"
import { ExperienceComponent } from "@app/components/experience/experience.component"
import { EducationComponent } from "@app/components/education/education.component"
import { LanguagesComponent } from "@app/components/languages/languages.component"
import { ProjectsComponent } from "@app/components/projects/projects.component"
import { SkillsComponent } from "@app/components/skills/skills.component"
import { FooterComponent } from "@app/components/footer/footer.component"
import { BackgroundAnimationComponent } from "@app/components/background-animation/background-animation.component"
import { LanguageSwitchIndicatorComponent } from "@app/components/language-switch-indicator/language-switch-indicator.component"
import { CustomLoaderComponent } from "@app/components/custom-loader/custom-loader.component"
import { LanguageService } from "@app/services/language.service"
import { EnhancedSeoService } from "@app/services/enhanced-seo.service"
import { AnalyticsService } from "@app/services/analytics.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-home",
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ExperienceComponent,
    EducationComponent,
    ProjectsComponent,
    SkillsComponent,
    LanguagesComponent,
    FooterComponent,
    BackgroundAnimationComponent,
    LanguageSwitchIndicatorComponent,
    CustomLoaderComponent,
  ],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, OnDestroy {
  isLoaded = false
  showContent = false
  private subscription: Subscription | null = null

  private languageService = inject(LanguageService)
  private enhancedSeoService = inject(EnhancedSeoService)
  private analyticsService = inject(AnalyticsService)

  ngOnInit() {
    // Detectar cuando la ventana está inactiva para reducir el uso de recursos
    document.addEventListener("visibilitychange", this.handleVisibilityChange)

    // Verificar si las traducciones están cargadas
    this.subscription = this.languageService.isLoaded$.subscribe((isLoaded) => {
      this.isLoaded = isLoaded
      if (isLoaded) {
        // Inicializar el servicio de SEO mejorado cuando el contenido está listo
        this.enhancedSeoService.initDefaultSeo()
        
        // Rastrear vista de página principal
        this.analyticsService.trackPage('Portfolio Home', window.location.pathname)
        
        // Agregar un pequeño retraso para asegurar una animación suave
        setTimeout(() => {
          this.showContent = true
        }, 100)
      }
    })
  }

  handleVisibilityChange() {
    if (document.hidden) {
      document.body.classList.add("reduced-animations")
    } else {
      document.body.classList.remove("reduced-animations")
    }
  }

  ngOnDestroy() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange)
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
