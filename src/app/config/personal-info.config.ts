import { SOCIAL_CONFIG } from './social.config';

/**
 * Configuración de información personal para el CV
 * Ahora utiliza SOCIAL_CONFIG para centralizar URLs
 */
export const PERSONAL_INFO = {
  name: 'Enzo Meneghini',
  title: 'Infrastructure Engineer | DevOps Engineer | IT Support Specialist',
  email: SOCIAL_CONFIG.email,
  phone: SOCIAL_CONFIG.phone,
  linkedin: SOCIAL_CONFIG.linkedinDisplay,
  github: SOCIAL_CONFIG.githubDisplay,
  portfolio: SOCIAL_CONFIG.portfolioDisplay,
  portfolioUrl: SOCIAL_CONFIG.portfolioDisplay,
  githubUrl: SOCIAL_CONFIG.githubDisplay,
} as const;