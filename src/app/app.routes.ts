import type { Routes } from "@angular/router"

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./pages/home/home.component").then((m) => m.HomeComponent),
    data: { 
      seo: { 
        title: 'Inicio | Enzo Meneghini - Desarrollador Full Stack',
        canonicalUrl: '/'
      }
    }
  },
  {
    path: "proyectos",
    loadComponent: () => import("./pages/projects/projects-page.component").then((m) => m.ProjectsPageComponent),
    data: { 
      seo: { 
        title: 'Proyectos | Enzo Meneghini - Portfolio',
        canonicalUrl: '/proyectos'
      },
      preload: true // Esta ruta se precargará después de 2 segundos
    }
  },
  {
    path: "skills",
    redirectTo: "/#skills",
  },
  {
    path: "experiencia",
    redirectTo: "/#experience",  
  },
  {
    path: "idiomas",
    redirectTo: "/#languages",
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
]
