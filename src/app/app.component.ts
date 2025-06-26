import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ThemeService } from './services/theme.service';
import { LanguageService } from './services/language.service';
import { EnhancedSeoService } from './services/enhanced-seo.service';
import { AnalyticsInitService } from './services/analytics-init.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private themeService: ThemeService,
    private languageService: LanguageService,
    private enhancedSeoService: EnhancedSeoService,
    private analyticsInitService: AnalyticsInitService
  ) {}

  ngOnInit() {
    // Inicializar tema
    this.themeService.initTheme();
    
    // Inicializar idioma
    this.languageService.initLanguage();
    
    // Inicializar SEO
    this.enhancedSeoService.initDefaultSeo();
    
    // Inicializar Google Analytics
    this.analyticsInitService.initializeAnalytics();
  }
}
