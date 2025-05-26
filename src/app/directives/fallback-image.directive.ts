import { Directive, ElementRef, HostListener, Input, OnInit, isDevMode } from '@angular/core';

@Directive({
  standalone: true,
  selector: 'img[appFallbackImage]'
})
export class FallbackImageDirective implements OnInit {
  @Input() appFallbackImage: string = 'assets/placeholder.svg';
  private attemptedFallback: boolean = false;
  private originalSrc: string = '';
  private readonly FINAL_FALLBACK = 'assets/placeholder.svg';

  constructor(private el: ElementRef<HTMLImageElement>) {}
  
  ngOnInit() {
    // Almacenamos la ruta original de la imagen para referencia y depuración
    this.originalSrc = this.el.nativeElement.src;
  }

  @HostListener('error')
  onError() {
    // Evitar bucles infinitos - solo intenta el fallback una vez
    if (!this.attemptedFallback) {
      this.attemptedFallback = true;
      
      // Solo registramos en consola si estamos en modo desarrollo
      if (isDevMode()) {
        console.log(`Error cargando imagen: ${this.el.nativeElement.src}. Usando fallback: ${this.appFallbackImage}`);
      }
      
      // Si la ruta del fallback está vacía o es inválida, usamos directamente el placeholder final
      if (!this.appFallbackImage || this.appFallbackImage === '') {
        this.el.nativeElement.src = this.FINAL_FALLBACK;
      } else {
        this.el.nativeElement.src = this.appFallbackImage;
      }
    } else {
      // Si también falla la imagen de fallback, usamos el placeholder final
      if (isDevMode()) {
        console.log(`Error también en la imagen de fallback ${this.appFallbackImage}, usando placeholder final ${this.FINAL_FALLBACK}`);
      }
      this.el.nativeElement.src = this.FINAL_FALLBACK;
    }
  }
}
