import { SOCIAL_CONFIG } from './social.config';

/**
 * Configuración SEO para el sitio web
 */
export const SEO_CONFIG = {  // Configuración general
  siteName: 'Enzo Meneghini - Site Lead en Accenture · Infrastructure Manager & DevOps',
  siteUrl: SOCIAL_CONFIG.portfolioUrl,
  
  // Metadatos por defecto
  defaultMetaTags: {
    title: 'Enzo Meneghini - Site Lead en Accenture · Infrastructure Manager & DevOps',
    description: 'Site Lead en Accenture (Rio Tinto) e Infrastructure Manager. Especializado en redes, virtualización, Azure, Docker, CI/CD, DevOps y soluciones de IA on-premise. Jujuy, Argentina.',
    keywords: 'Enzo Meneghini, Site Lead, Accenture, Infrastructure Manager, DevOps, redes, Azure, Docker, CI/CD, Cisco CCNA, MikroTik, Furukawa, virtualización, Prometheus, Linux, portfolio, Jujuy, Argentina',
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
      title: 'Inicio | Enzo Meneghini - Site Lead & Infrastructure Manager',
      description: 'Site Lead en Accenture para Rio Tinto e Infrastructure Manager. Redes, Azure, Docker, CI/CD, monitoreo y soluciones de IA on-premise.',
      keywords: 'Site Lead, Accenture, Infrastructure Manager, DevOps, redes, Azure, Docker, Jujuy',
      canonicalUrl: '/',
    },
    projects: {
      title: 'Proyectos | Enzo Meneghini',
      description: 'Proyectos destacados de infraestructura, DevOps, redes y desarrollo web.',
      keywords: 'proyectos, infraestructura, DevOps, redes, desarrollo web, portfolio',
      canonicalUrl: '/projects',
    },
    cv: {
      title: 'Curriculum Vitae | Enzo Meneghini',
      description: 'CV de Enzo Meneghini — Site Lead en Accenture, Infrastructure Manager, DevOps y redes.',
      keywords: 'cv, curriculum, experiencia, infraestructura, DevOps, redes',
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
      "jobTitle": "Site Lead & Support Engineer en Accenture | Infrastructure Manager & DevOps",
      "worksFor": [
        {
          "@type": "Organization",
          "name": "Accenture"
        },
        {
          "@type": "Organization",
          "name": "Agua Potable de Jujuy"
        }
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Universidad Nacional de Jujuy"
      },
      "knowsAbout": ["Infrastructure Management", "DevOps", "Networking", "Azure", "Docker", "CI/CD", "Cisco CCNA", "MikroTik", "Virtualization", "Prometheus", "Linux", "AI On-Premise", "Angular", "Java"],      "sameAs": [
        SOCIAL_CONFIG.linkedinUrl,
        SOCIAL_CONFIG.githubUrl
      ]
    },
    portfolio: {
      "@context": "https://schema.org",
      "@type": "WebSite",      "name": "Portfolio de Enzo Meneghini",
      "url": `${SOCIAL_CONFIG.portfolioUrl}/`,
      "description": "Site Lead en Accenture (Rio Tinto) e Infrastructure Manager. Especializado en redes, DevOps, Azure, Docker y soluciones de IA on-premise.",
      "author": {
        "@type": "Person",
        "name": "Enzo Meneghini"
      }
    }
  }
};