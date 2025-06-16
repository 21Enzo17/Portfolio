import { Injectable } from '@angular/core';

// Declare gtag function for TypeScript
declare let gtag: (...args: any[]) => void;

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() {}

  // Rastrear páginas
  trackPage(pageName: string, path: string) {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('config', 'GTM-N656G9R6', {
        page_title: pageName,
        page_location: path
      });
    }
  }

  // Rastrear eventos personalizados
  trackEvent(action: string, category: string, label?: string, value?: number) {
    if (typeof (window as any).gtag !== 'undefined') {
      (window as any).gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value
      });
    }
  }

  // Eventos específicos para el portfolio
  trackSectionView(sectionName: string) {
    this.trackEvent('section_view', 'portfolio', sectionName);
  }

  trackCertificateView(certificateName: string) {
    this.trackEvent('certificate_view', 'certifications', certificateName);
  }

  trackProjectView(projectName: string) {
    this.trackEvent('project_view', 'projects', projectName);
  }

  trackLanguageChange(language: string) {
    this.trackEvent('language_change', 'user_interaction', language);
  }

  trackThemeChange(theme: string) {
    this.trackEvent('theme_change', 'user_interaction', theme);
  }

  trackCVDownload() {
    this.trackEvent('cv_download', 'documents', 'curriculum_vitae');
  }

  trackCVPreview() {
    this.trackEvent('cv_preview', 'documents', 'curriculum_vitae');
  }

  trackContactClick(contactType: string) {
    this.trackEvent('contact_click', 'contact', contactType);
  }

  trackSocialClick(platform: string) {
    this.trackEvent('social_click', 'social_media', platform);
  }

  trackSkillHover(skillName: string) {
    this.trackEvent('skill_hover', 'skills', skillName);
  }

  trackExperienceExpand(companyName: string) {
    this.trackEvent('experience_expand', 'experience', companyName);
  }

  trackEducationExpand(institutionName: string) {
    this.trackEvent('education_expand', 'education', institutionName);
  }
}
