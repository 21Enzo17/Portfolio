import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-container fixed inset-0 z-50 flex flex-col items-center justify-center bg-background">
      <!-- Imagen del perfil con animación de pulso -->
      <div class="relative">
        <!-- Anillos animados detrás -->
        <div class="absolute inset-0 flex items-center justify-center">
          <div class="ring ring-1"></div>
          <div class="ring ring-2"></div>
          <div class="ring ring-3"></div>
        </div>
        
        <!-- Foto de perfil -->
        <div class="profile-image-container relative z-10">
          <img 
            src="assets/FotoPerfil.webp" 
            alt="Loading..." 
            class="profile-image w-32 h-32 rounded-full object-cover shadow-2xl">
        </div>
      </div>
      
      <!-- Texto de carga -->
      <div class="mt-8 text-center">
        <h2 class="text-2xl font-bold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
          Enzo Meneghini
        </h2>
        <p class="text-muted-foreground animate-pulse">
          Cargando portfolio...
        </p>
      </div>
      
      <!-- Barra de progreso -->
      <div class="mt-6 w-64 h-1 bg-muted rounded-full overflow-hidden">
        <div class="progress-bar h-full bg-gradient-to-r from-purple-500 to-blue-500"></div>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      backdrop-filter: blur(10px);
      animation: fadeIn 0.3s ease-out;
    }
    
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    /* Anillos animados */
    .ring {
      position: absolute;
      border: 2px solid;
      border-color: rgba(168, 85, 247, 0.3);
      border-radius: 50%;
      animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    
    .ring-1 {
      width: 140px;
      height: 140px;
      animation-delay: 0s;
    }
    
    .ring-2 {
      width: 170px;
      height: 170px;
      animation-delay: 0.3s;
    }
    
    .ring-3 {
      width: 200px;
      height: 200px;
      animation-delay: 0.6s;
    }
    
    @keyframes pulse-ring {
      0%, 100% {
        transform: scale(1);
        opacity: 1;
      }
      50% {
        transform: scale(1.1);
        opacity: 0.5;
      }
    }
    
    /* Imagen de perfil con efecto de brillo */
    .profile-image-container {
      animation: float 3s ease-in-out infinite;
    }
    
    @keyframes float {
      0%, 100% {
        transform: translateY(0);
      }
      50% {
        transform: translateY(-10px);
      }
    }
    
    .profile-image {
      animation: glow 2s ease-in-out infinite;
      border: 3px solid rgba(168, 85, 247, 0.5);
    }
    
    @keyframes glow {
      0%, 100% {
        box-shadow: 0 0 20px rgba(168, 85, 247, 0.5),
                    0 0 40px rgba(59, 130, 246, 0.3);
      }
      50% {
        box-shadow: 0 0 30px rgba(168, 85, 247, 0.8),
                    0 0 60px rgba(59, 130, 246, 0.5);
      }
    }
    
    /* Barra de progreso */
    .progress-bar {
      animation: loading 2s ease-in-out infinite;
    }
    
    @keyframes loading {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(400%);
      }
    }
  `]
})
export class CustomLoaderComponent {}
