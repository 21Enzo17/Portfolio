import { Injectable } from '@angular/core';
import { analyticsConfig } from '../config/analytics.config';

// Declare gtag function for TypeScript
declare let gtag: (...args: any[]) => void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly GA_MEASUREMENT_ID = analyticsConfig.measurementId;

  constructor() {}

  // Verificar si gtag está disponible
  private isGtagAvailable(): boolean {
    return typeof (window as any).gtag !== 'undefined';
  }

  // Rastrear páginas
  trackPage(pageName: string, path: string) {
    if (this.isGtagAvailable()) {
      gtag('config', this.GA_MEASUREMENT_ID, {
        page_title: pageName,
        page_location: window.location.origin + path,
        page_path: path
      });
    }
  }

  // Rastrear eventos personalizados con GA4
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (this.isGtagAvailable()) {
      const eventParams: any = {
        event_category: category,
      };
      
      if (label) eventParams.event_label = label;
      if (value !== undefined) eventParams.value = value;
      
      gtag('event', action, eventParams);
    }
  }

  // Configurar propiedades del usuario
  setUserProperties(properties: { [key: string]: any }) {
    if (this.isGtagAvailable()) {
      gtag('set', { user_properties: properties });
    }
  }

  // Rastrear conversiones
  trackConversion(conversionName: string, value?: number) {
    if (this.isGtagAvailable()) {
      const conversionParams: any = {};
      if (value !== undefined) conversionParams.value = value;
      
      gtag('event', 'conversion', {
        send_to: `${this.GA_MEASUREMENT_ID}/${conversionName}`,
        ...conversionParams
      });
    }
  }

  // Rastrear tiempo en página
  trackTimingEvent(category: string, variable: string, value: number, label?: string) {
    if (this.isGtagAvailable()) {
      gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label
      });
    }
  }

  // Eventos específicos para el portfolio usando configuración
  trackSectionView(sectionName: string) {
    this.trackEvent(analyticsConfig.customEvents.SECTION_VIEW, analyticsConfig.eventCategories.PORTFOLIO, sectionName);
  }

  trackCertificateView(certificateName: string) {
    this.trackEvent(analyticsConfig.customEvents.CERTIFICATE_VIEW, analyticsConfig.eventCategories.CERTIFICATIONS, certificateName);
  }

  trackProjectView(projectName: string) {
    this.trackEvent(analyticsConfig.customEvents.PROJECT_VIEW, analyticsConfig.eventCategories.PROJECTS, projectName);
  }

  trackLanguageChange(language: string) {
    this.trackEvent(analyticsConfig.customEvents.LANGUAGE_CHANGE, analyticsConfig.eventCategories.USER_INTERACTION, language);
  }

  trackThemeChange(theme: string) {
    this.trackEvent(analyticsConfig.customEvents.THEME_CHANGE, analyticsConfig.eventCategories.USER_INTERACTION, theme);
  }

  trackCVDownload() {
    this.trackEvent(analyticsConfig.customEvents.CV_DOWNLOAD, analyticsConfig.eventCategories.DOCUMENTS, 'curriculum_vitae');
    // También trackear como conversión
    this.trackConversion('cv_download');
  }

  trackCVPreview() {
    this.trackEvent(analyticsConfig.customEvents.CV_PREVIEW, analyticsConfig.eventCategories.DOCUMENTS, 'curriculum_vitae');
  }

  trackContactClick(contactType: string) {
    this.trackEvent(analyticsConfig.customEvents.CONTACT_CLICK, analyticsConfig.eventCategories.CONTACT, contactType);
    // También trackear como conversión
    this.trackConversion('contact_interaction');
  }

  trackSocialClick(platform: string) {
    this.trackEvent(analyticsConfig.customEvents.SOCIAL_CLICK, analyticsConfig.eventCategories.SOCIAL_MEDIA, platform);
  }

  trackSkillHover(skillName: string) {
    this.trackEvent(analyticsConfig.customEvents.SKILL_HOVER, analyticsConfig.eventCategories.SKILLS, skillName);
  }

  trackExperienceExpand(companyName: string) {
    this.trackEvent(analyticsConfig.customEvents.EXPERIENCE_EXPAND, analyticsConfig.eventCategories.EXPERIENCE, companyName);
  }

  trackEducationExpand(institutionName: string) {
    this.trackEvent(analyticsConfig.customEvents.EDUCATION_EXPAND, analyticsConfig.eventCategories.EDUCATION, institutionName);
  }
}
