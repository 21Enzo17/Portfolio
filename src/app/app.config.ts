import { type ApplicationConfig, importProvidersFrom, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core"
import { provideRouter, withPreloading, withInMemoryScrolling, withViewTransitions } from "@angular/router"
import { routes } from "./app.routes"
import { provideClientHydration } from "@angular/platform-browser"
import { HttpClient, HttpClientModule, provideHttpClient, withFetch } from "@angular/common/http"
import { TranslateLoader, TranslateModule } from "@ngx-translate/core"
import { TranslateHttpLoader } from "@ngx-translate/http-loader"
import { MultiTranslateHttpLoader } from "./services/multi-translate-loader"
import { SelectivePreloadStrategy } from "./services/selective-preload-strategy"

// Función para cargar las traducciones desde múltiples archivos modulares
export function HttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http)
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withPreloading(SelectivePreloadStrategy), // Preload selectivo y diferido
      withInMemoryScrolling({ 
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled' 
      }),
      withViewTransitions() // Transiciones suaves entre rutas
    ),
    // provideClientHydration(), // Deshabilitado - solo necesario para SSR
    provideHttpClient(withFetch()),
    importProvidersFrom(
      HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient],
        },
        defaultLanguage: "es",
      })
    ),
  ],
}
