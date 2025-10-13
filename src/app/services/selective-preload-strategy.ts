import { Injectable } from '@angular/core';
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of, timer } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

/**
 * Estrategia de precarga selectiva que solo precarga rutas marcadas
 * y espera un tiempo antes de hacerlo para priorizar la carga inicial
 */
@Injectable({
  providedIn: 'root'
})
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<any>): Observable<any> {
    // Si la ruta tiene data.preload = true, precargarla después de 2 segundos
    if (route.data && route.data['preload']) {
      console.log('Precargando ruta:', route.path);
      // Esperar 2 segundos antes de precargar para dar prioridad a la carga inicial
      return timer(2000).pipe(
        mergeMap(() => load())
      );
    }
    
    // No precargar las demás rutas
    return of(null);
  }
}
