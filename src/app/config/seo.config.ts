import { SOCIAL_CONFIG } from './social.config';

/**
 * Configuración SEO para el sitio web
 */
export const SEO_CONFIG = {  // Configuración general
  siteName: 'Enzo Meneghini | Especialista en Redes e Infraestructura IT',
  siteUrl: SOCIAL_CONFIG.portfolioUrl,
  
  // Metadatos por defecto
  defaultMetaTags: {
    title: 'Enzo Meneghini | Especialista en Redes e Infraestructura IT',
    description: 'Enzo Meneghini, especialista de redes e infraestructura IT en Jujuy, Argentina. Más de 6 años entre data centers, la operación 24/7 de un ISP de más de 50.000 abonados, soporte en un sitio minero con Accenture y liderazgo de equipos. Creador de isitmyisp.',
    keywords: 'Enzo Meneghini, redes, infraestructura IT, NOC, ISP, GPON/FTTH, BGP, OSPF, IPv6, MikroTik, Cisco, UniFi, Proxmox, Windows Server, Docker, isitmyisp, Jujuy, Argentina',
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
      title: 'Inicio | Enzo Meneghini | Especialista en Redes e Infraestructura IT',
      description: 'Enzo Meneghini, especialista de redes e infraestructura IT en Jujuy, Argentina. Más de 6 años entre data centers, la operación 24/7 de un ISP de más de 50.000 abonados, soporte en un sitio minero con Accenture y liderazgo de equipos. Creador de isitmyisp.',
      keywords: 'Enzo Meneghini, redes, infraestructura IT, NOC, ISP, GPON/FTTH, BGP, OSPF, IPv6, MikroTik, Cisco, UniFi, Proxmox, Windows Server, Docker, isitmyisp, Jujuy, Argentina',
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
      description: 'CV de Enzo Meneghini en PDF, en español e inglés: redes, infraestructura IT, NOC y liderazgo de equipos.',
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
      "jobTitle": "Especialista en Redes e Infraestructura IT",
      "worksFor": [
        {
          "@type": "Organization",
          "name": "BEXCA"
        }
      ],
      "alumniOf": {
        "@type": "CollegeOrUniversity",
        "name": "Universidad Nacional de Jujuy"
      },
      "knowsAbout": ["Infrastructure Management", "DevOps", "Networking", "Azure", "Docker", "CI/CD", "Cisco", "MikroTik", "Virtualization", "Prometheus", "Linux", "AI On-Premise", "Angular", "Java"],      "sameAs": [
        SOCIAL_CONFIG.linkedinUrl,
        SOCIAL_CONFIG.githubUrl
      ]
    },
    portfolio: {
      "@context": "https://schema.org",
      "@type": "WebSite",      "name": "Portfolio de Enzo Meneghini",
      "url": `${SOCIAL_CONFIG.portfolioUrl}/`,
      "description": "Enzo Meneghini, especialista de redes e infraestructura IT en Jujuy, Argentina. Más de 6 años entre data centers, la operación 24/7 de un ISP de más de 50.000 abonados, soporte en un sitio minero con Accenture y liderazgo de equipos. Creador de isitmyisp.",
      "author": {
        "@type": "Person",
        "name": "Enzo Meneghini"
      }
    }
  }
};