import { Injectable } from "@angular/core"
import { BehaviorSubject, fromEvent } from "rxjs"
import { debounceTime } from "rxjs/operators"

@Injectable({
  providedIn: "root",
})
export class MobileService {
  private isMobileSubject = new BehaviorSubject<boolean>(false)
  isMobile$ = this.isMobileSubject.asObservable()

  constructor() {
    // Inicializar el estado
    this.checkIfMobile()

    // Escuchar cambios en el tamaño de la ventana
    fromEvent(window, "resize")
      .pipe(debounceTime(300))
      .subscribe(() => {
        this.checkIfMobile()
      })
  }

  private checkIfMobile() {
    this.isMobileSubject.next(window.innerWidth < 768)
  }
}
