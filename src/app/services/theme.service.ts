import { Injectable } from "@angular/core"
import { BehaviorSubject } from "rxjs"

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private isDarkThemeSubject = new BehaviorSubject<boolean>(false)
  isDarkTheme$ = this.isDarkThemeSubject.asObservable()

  constructor() {
    this.initTheme()
  }

  // Cambiado de private a public para poder llamarlo desde el app.component.ts
  initTheme() {
    // Verificar el tema del sistema
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
    const savedTheme = localStorage.getItem("theme") || systemTheme

    if (savedTheme === "dark") {
      this.isDarkThemeSubject.next(true)
      document.documentElement.classList.add("dark")
    } else {
      this.isDarkThemeSubject.next(false)
      document.documentElement.classList.remove("dark")
    }
  }

  toggleTheme() {
    const isDark = !this.isDarkThemeSubject.value
    this.isDarkThemeSubject.next(isDark)

    if (isDark) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  getCurrentTheme(): string {
    return this.isDarkThemeSubject.value ? "dark" : "light"
  }
}
