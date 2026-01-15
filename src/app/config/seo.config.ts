import { SOCIAL_CONFIG } from './social.config';

/**
 * Configuración SEO para el sitio web
 */
export const SEO_CONFIG = {  // Configuración general
  siteName: 'Enzo Meneghini - Infrstructure Manager',
  siteUrl: SOCIAL_CONFIG.portfolioUrl,
  
  // Metadatos por defecto
  defaultMetaTags: {
    title: 'Enzo Meneghini - Infrstructure Manager',
    description: 'Desarrollador Full Stack con experiencia en Angular, React, Node.js y más tecnologías. Conoce mi portafolio, CV y proyectos destacados.',
    keywords: 'desarrollador full stack, angular, react, node.js, desarrollador web, frontend, backend, jujuy, argentina, java, spring boot, typescript',
    author: 'Enzo Meneghini',
    image: `${SOCIAL_CONFIG.portfolioUrl}/assets/fotoPerfil.webp`,
  },
  
  // Configuración de redes sociales (Open Graph y Twitter)
  socialMedia: {
    openGraph: {
      type: 'website',
      locale: 'es_AR',
    },
    twitter: {
      card: 'summary_large_image',
      creator: '@enzomeneghini',
      site: '@enzomeneghini',
    }
  },
  
  // Configuración por ruta
  routes: {
    home: {
      title: 'Inicio | Enzo Meneghini - Infrstructure Manager',
      description: 'Desarrollador Full Stack con enfoque en tecnologías web modernas. Servicios de desarrollo web profesional.',
      keywords: 'desarrollador web, full stack, angular, react, frontend, backend, jujuy',
      canonicalUrl: '/',
    },
    projects: {
      title: 'Proyectos | Enzo Meneghini',
      description: 'Portafolio de proyectos destacados de desarrollo web, aplicaciones y soluciones digitales.',
      keywords: 'proyectos web, portafolio desarrollo, aplicaciones, soluciones digitales',
      canonicalUrl: '/projects',
    },
    cv: {
      title: 'Curriculum Vitae | Enzo Meneghini',
      description: 'Curriculum Vitae de Enzo Meneghini, desarrollador Full Stack con experiencia en tecnologías frontend y backend.',
      keywords: 'cv, curriculum, experiencia, habilidades, desarrollo web',
      canonicalUrl: '/cv',
    },
  },  
  // Estructurado JSON-LD para Person
  jsonLd: {
    person: {
      "@context": "https://schema.org",
      "@type": "Person",      "name": "Enzo Meneghini",
      "url": SOCIAL_CONFIG.portfolioUrl,
      "image": `${SOCIAL_CONFIG.portfolioUrl}/assets/fotoPerfil.webp`,
      "jobTitle": "Full Stack Developer | Jefe de Infraestructura",
      "worksFor": {
        "@type": "Organization",
        "name": "Agua Potable de Jujuy"
      },
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Universidad Nacional de Jujuy"
      },
      "knowsAbout": ["Angular", "Java", "Spring Boot", "React", "TypeScript", "Node.js", "Full Stack Development"],      "sameAs": [
        SOCIAL_CONFIG.linkedinUrl,
        SOCIAL_CONFIG.githubUrl
      ]
    },
    portfolio: {
      "@context": "https://schema.org",
      "@type": "WebSite",      "name": "Portfolio de Enzo Meneghini",
      "url": `${SOCIAL_CONFIG.portfolioUrl}/`,
      "description": "Portfolio profesional de Enzo Meneghini, desarrollador Full Stack con experiencia en Angular, Java, Spring Boot y otras tecnologías web modernas",
      "author": {
        "@type": "Person",
        "name": "Enzo Meneghini"
      }
    }
  }
};