import { environment } from '../../environments/environment';

export const analyticsConfig = {
  // ID dinámico basado en el environment
  measurementId: environment.analytics.measurementId,
  
  // Configuraciones adicionales
  config: {
    // Enviar automáticamente page views
    send_page_view: true,
    
    // Configuraciones de privacidad
    anonymize_ip: true,
    
    // Configuraciones de cookies
    cookie_expires: 63072000, // 2 años en segundos
    
    // Configuraciones de debugging (solo para desarrollo)
    debug_mode: false,
    
    // Configuraciones de enhanced measurement
    enhanced_measurement_settings: {
      scrolls: true,
      outbound_clicks: true,
      site_search: false,
      video_engagement: false,
      file_downloads: true
    }
  },
  
  // Nombres de eventos personalizados
  customEvents: {
    SECTION_VIEW: 'section_view',
    CERTIFICATE_VIEW: 'certificate_view',
    PROJECT_VIEW: 'project_view',
    LANGUAGE_CHANGE: 'language_change',
    THEME_CHANGE: 'theme_change',
    CV_DOWNLOAD: 'cv_download',
    CV_PREVIEW: 'cv_preview',
    CONTACT_CLICK: 'contact_click',
    SOCIAL_CLICK: 'social_click',
    SKILL_HOVER: 'skill_hover',
    EXPERIENCE_EXPAND: 'experience_expand',
    EDUCATION_EXPAND: 'education_expand'
  },
  
  // Categorías de eventos
  eventCategories: {
    PORTFOLIO: 'portfolio',
    CERTIFICATIONS: 'certifications',
    PROJECTS: 'projects',
    USER_INTERACTION: 'user_interaction',
    DOCUMENTS: 'documents',
    CONTACT: 'contact',
    SOCIAL_MEDIA: 'social_media',
    SKILLS: 'skills',
    EXPERIENCE: 'experience',
    EDUCATION: 'education'
  }
};
