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
    redirectTo: "/#projects",
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
