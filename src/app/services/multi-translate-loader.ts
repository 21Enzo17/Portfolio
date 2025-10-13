import { HttpClient } from "@angular/common/http";
import { TranslateLoader } from "@ngx-translate/core";
import { forkJoin, Observable } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Custom loader that loads multiple JSON files and merges them into a single translation object
 */
export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    private resources: { prefix: string; suffix: string }[] = [
      { prefix: "./assets/i18n/", suffix: "/metadata.json" },
      { prefix: "./assets/i18n/", suffix: "/nav.json" },
      { prefix: "./assets/i18n/", suffix: "/hero.json" },
      { prefix: "./assets/i18n/", suffix: "/experience.json" },
      { prefix: "./assets/i18n/", suffix: "/education.json" },
      { prefix: "./assets/i18n/", suffix: "/languages.json" },
      { prefix: "./assets/i18n/", suffix: "/projects.json" },
      { prefix: "./assets/i18n/", suffix: "/skills.json" },
      { prefix: "./assets/i18n/", suffix: "/footer.json" },
    ]
  ) {}

  /**
   * Gets the translations from multiple files
   */
  public getTranslation(lang: string): Observable<any> {
    // Create an array of observables for each file
    const requests = this.resources.map((resource) => {
      const path = `${resource.prefix}${lang}${resource.suffix}`;
      return this.http.get(path);
    });

    // Use forkJoin to load all files in parallel and merge them
    return forkJoin(requests).pipe(
      map((responses) => {
        // Merge all responses into a single object
        return responses.reduce((acc, curr) => {
          return { ...acc, ...curr };
        }, {});
      })
    );
  }
}
