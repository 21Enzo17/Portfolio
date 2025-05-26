import { Component, type OnInit, inject, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { LanguageService } from "@app/services/language.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-language-switch-indicator",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="showIndicator" 
         class="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-5 duration-300">
      <div class="neumorphic px-6 py-3 rounded-full bg-background/80 backdrop-blur-md">
        <div class="flex items-center space-x-2">
          <span class="text-sm">{{ currentLang === 'es' ? 'Cambiado a Español' : 'Switched to English' }}</span>
          <div class="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse"></div>
        </div>
      </div>
    </div>
  `,
  styles: [],
})
export class LanguageSwitchIndicatorComponent implements OnInit, OnDestroy {
  showIndicator = false
  currentLang = ""
  previousLang = ""
  private subscription: Subscription | null = null

  private languageService = inject(LanguageService)

  ngOnInit() {
    // Suscribirse a cambios de idioma
    this.subscription = this.languageService.currentLanguage$.subscribe((lang) => {
      if (this.currentLang && this.currentLang !== lang) {
        this.previousLang = this.currentLang
        this.currentLang = lang
        this.showLanguageIndicator()
      } else {
        this.currentLang = lang
      }
    })
  }

  private showLanguageIndicator() {
    this.showIndicator = true
    setTimeout(() => {
      this.showIndicator = false
    }, 1500)
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe()
    }
  }
}
