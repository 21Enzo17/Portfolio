import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"
import { TranslateService } from "@ngx-translate/core"

@Injectable({
  providedIn: "root",
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<string>("es")
  currentLanguage$ = this.currentLanguageSubject.asObservable()

  private isLoadedSubject = new BehaviorSubject<boolean>(false)
  isLoaded$ = this.isLoadedSubject.asObservable()

  constructor(private translate: TranslateService) {}

  initLanguage() {
    // Configurar idiomas disponibles
    this.translate.addLangs(["es", "en"])

    // Recuperar el idioma guardado o usar español como predeterminado
    const savedLang = localStorage.getItem("language")

    // Usar español como idioma predeterminado, ignorando la detección del navegador
    const defaultLang = savedLang || "es"

    this.translate.setDefaultLang("es")
    this.setLanguage(defaultLang as "es" | "en")
  }

  setLanguage(lang: "es" | "en") {
    this.translate.use(lang)
    this.currentLanguageSubject.next(lang)
    localStorage.setItem("language", lang)
    document.documentElement.lang = lang

    // Marcar como cargado después de cambiar el idioma
    setTimeout(() => {
      this.isLoadedSubject.next(true)
    }, 100)
  }

  getCurrentLanguage(): string {
    return this.currentLanguageSubject.value
  }
}
