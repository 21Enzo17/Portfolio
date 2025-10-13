import { Component, type ElementRef, type OnDestroy, type OnInit, ViewChild, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { ThemeService } from "@app/services/theme.service"
import { MobileService } from "@app/services/mobile.service"
import type { Subscription } from "rxjs"

@Component({
  selector: "app-background-animation",
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="fixed top-0 left-0 w-full h-full -z-10 opacity-70 pointer-events-none" 
            style="will-change: contents;"></canvas>
  `,
  styles: [],
})
export class BackgroundAnimationComponent implements OnInit, OnDestroy {
  @ViewChild("canvas", { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>

  private ctx!: CanvasRenderingContext2D | null
  private particlesArray: Particle[] = []
  private animationFrameId?: number
  private lastTime = 0
  private fpsInterval = 1000 / 30 // 30 fps
  private isVisible = true
  private mouseX = 0
  private mouseY = 0
  private mouseActive = false
  private mouseRadius = 200
  private inactivityTimer?: ReturnType<typeof setTimeout>
  private subscriptions: Subscription[] = []

  private isDarkTheme = false
  private isMobile = false

  private themeService = inject(ThemeService)
  private mobileService = inject(MobileService)

  ngOnInit() {
    const canvas = this.canvasRef.nativeElement
    this.ctx = canvas.getContext("2d")

    if (!this.ctx) return

    // Suscribirse a cambios de tema
    this.subscriptions.push(
      this.themeService.isDarkTheme$.subscribe((isDark) => {
        this.isDarkTheme = isDark
      }),
    )

    // Suscribirse a cambios de tamaño de pantalla
    this.subscriptions.push(
      this.mobileService.isMobile$.subscribe((isMobile) => {
        this.isMobile = isMobile
        this.mouseRadius = isMobile ? 100 : 200
        this.resizeCanvas()
        this.initParticles()
      }),
    )

    // Configurar el canvas
    this.resizeCanvas()

    // Eventos del mouse
    window.addEventListener("mousemove", this.handleMouseMove)
    window.addEventListener("touchmove", this.handleTouchMove, { passive: true })
    window.addEventListener("resize", this.resizeCanvas)

    // Detectar cuando el tab/ventana no es visible para pausar la animación
    document.addEventListener("visibilitychange", this.handleVisibilityChange)

    // Inicializar partículas
    this.initParticles()

    // Iniciar animación
    this.animate(0)
  }

  private resizeCanvas = () => {
    const canvas = this.canvasRef.nativeElement
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseActive = true
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    this.resetInactivityTimer()
  }

  private handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length > 0) {
      this.mouseActive = true
      this.mouseX = e.touches[0].clientX
      this.mouseY = e.touches[0].clientY
      this.resetInactivityTimer()
    }
  }

  private resetInactivityTimer() {
    clearTimeout(this.inactivityTimer)
    this.mouseActive = true
    this.inactivityTimer = setTimeout(() => {
      this.mouseActive = false
    }, 2000)
  }

  private handleVisibilityChange = () => {
    this.isVisible = !document.hidden
    if (this.isVisible && !this.animationFrameId) {
      // Reanudar animación cuando la ventana vuelve a ser visible
      this.animate(performance.now())
    }
  }

  private initParticles() {
    this.particlesArray = []
    // Reducir número de partículas en móviles para mejor rendimiento
    const numberOfParticles = this.isMobile ? 15 : 40

    for (let i = 0; i < numberOfParticles; i++) {
      this.particlesArray.push(
        new Particle(
          this.canvasRef.nativeElement.width,
          this.canvasRef.nativeElement.height,
          this.isMobile,
          this.getThemeColors(),
        ),
      )
    }
  }

  private getThemeColors() {
    if (this.isDarkTheme) {
      return [
        { r: 160, g: 174, b: 192 }, // gris azulado claro
        { r: 168, g: 85, b: 247 }, // púrpura
        { r: 59, g: 130, b: 246 }, // azul
      ]
    } else {
      return [
        { r: 74, g: 85, b: 104 }, // gris azulado oscuro
        { r: 139, g: 92, b: 246 }, // púrpura
        { r: 37, g: 99, b: 235 }, // azul
      ]
    }
  }

  private connect() {
    const maxDistance = this.isMobile ? 100 : 150

    for (let a = 0; a < this.particlesArray.length; a++) {
      for (let b = a; b < this.particlesArray.length; b++) {
        const dx = this.particlesArray[a].x - this.particlesArray[b].x
        const dy = this.particlesArray[a].y - this.particlesArray[b].y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity =
            0.8 *
            (1 - distance / maxDistance) *
            Math.min(this.particlesArray[a].opacity, this.particlesArray[b].opacity)

          const p1 = this.particlesArray[a]
          const p2 = this.particlesArray[b]

          const lineColor = {
            r: Math.floor((p1.color.r + p2.color.r) / 2),
            g: Math.floor((p1.color.g + p2.color.g) / 2),
            b: Math.floor((p1.color.b + p2.color.b) / 2),
          }

          if (this.ctx) {
            this.ctx.strokeStyle = `rgba(${lineColor.r}, ${lineColor.g}, ${lineColor.b}, ${opacity})`
            this.ctx.lineWidth = Math.min(0.8, (p1.size + p2.size) / 10)
            this.ctx.beginPath()
            this.ctx.moveTo(p1.x, p1.y)
            this.ctx.lineTo(p2.x, p2.y)
            this.ctx.stroke()
          }
        }
      }
    }
  }

  private animate = (timestamp: number) => {
    // Pausar animación si el tab no es visible
    if (!this.isVisible) {
      this.animationFrameId = undefined
      return
    }

    const elapsed = timestamp - this.lastTime

    if (elapsed > this.fpsInterval) {
      this.lastTime = timestamp - (elapsed % this.fpsInterval)

      if (this.ctx) {
        // Limpieza con efecto fade
        this.ctx.fillStyle = this.isDarkTheme
          ? "rgba(26, 32, 43, 0.15)" // Azul oscuro semitransparente
          : "rgba(224, 229, 236, 0.15)" // Gris claro semitransparente
        this.ctx.fillRect(0, 0, this.canvasRef.nativeElement.width, this.canvasRef.nativeElement.height)

        // Actualizar y dibujar partículas
        for (let i = 0; i < this.particlesArray.length; i++) {
          this.particlesArray[i].update(this.mouseActive, this.mouseX, this.mouseY, this.mouseRadius)
          this.particlesArray[i].draw(this.ctx)
        }

        // Optimizar conexiones en móviles
        if (!this.isMobile || this.particlesArray.length < 25) {
          this.connect()
        }
      }
    }

    this.animationFrameId = requestAnimationFrame(this.animate)
  }

  ngOnDestroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId)
    }

    window.removeEventListener("mousemove", this.handleMouseMove)
    window.removeEventListener("touchmove", this.handleTouchMove)
    window.removeEventListener("resize", this.resizeCanvas)
    document.removeEventListener("visibilitychange", this.handleVisibilityChange)

    clearTimeout(this.inactivityTimer)

    // Desuscribirse de todos los observables
    this.subscriptions.forEach((sub) => sub.unsubscribe())
  }
}

// Clase Particle
class Particle {
  x: number
  y: number
  size: number
  baseSize: number
  speedX: number
  speedY: number
  color: { r: number; g: number; b: number }
  colorIndex: number
  opacity: number
  maxOpacity: number
  life: number
  maxLife: number
  growing: boolean
  canvasWidth: number
  canvasHeight: number

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    isMobile: boolean,
    colors: { r: number; g: number; b: number }[],
  ) {
    this.canvasWidth = canvasWidth
    this.canvasHeight = canvasHeight

    // Posición inicial aleatoria
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight

    // Tamaño con variación
    this.baseSize = Math.random() * (isMobile ? 2 : 3) + 1
    this.size = this.baseSize

    // Velocidad más natural
    const speedFactor = isMobile ? 0.15 : 0.3
    this.speedX = (Math.random() - 0.5) * speedFactor
    this.speedY = (Math.random() - 0.5) * speedFactor

    // Color aleatorio de la paleta
    this.colorIndex = Math.floor(Math.random() * colors.length)
    this.color = colors[this.colorIndex]

    // Opacidad variable para efecto de pulso
    this.maxOpacity = Math.random() * 0.2 + 0.3 // Entre 0.3 y 0.5
    this.opacity = Math.random() * this.maxOpacity

    // Ciclo de vida para renovación de partículas
    this.maxLife = Math.random() * 200 + 100 // Entre 100 y 300 frames
    this.life = Math.random() * this.maxLife // Iniciar en punto aleatorio del ciclo

    // Estado de crecimiento para efecto pulso
    this.growing = Math.random() > 0.5
  }

  pulse() {
    // Efecto de pulso modificando tamaño y opacidad
    if (this.growing) {
      this.size += 0.03
      this.opacity += 0.005
      if (this.size >= this.baseSize * 1.5 || this.opacity >= this.maxOpacity) {
        this.growing = false
      }
    } else {
      this.size -= 0.03
      this.opacity -= 0.005
      if (this.size <= this.baseSize * 0.7 || this.opacity <= this.maxOpacity * 0.6) {
        this.growing = true
      }
    }

    // Limitar valores
    this.opacity = Math.max(0.1, Math.min(this.opacity, this.maxOpacity))
    this.size = Math.max(this.baseSize * 0.7, Math.min(this.size, this.baseSize * 1.5))
  }

  update(mouseActive: boolean, mouseX: number, mouseY: number, mouseRadius: number) {
    // Actualizar ciclo de vida
    this.life--

    // Renovar partícula al final de su vida
    if (this.life <= 0) {
      this.x = Math.random() * this.canvasWidth
      this.y = Math.random() * this.canvasHeight
      this.life = this.maxLife
    }

    // Aplicar efecto de pulso
    this.pulse()

    // Movimiento básico
    this.x += this.speedX
    this.y += this.speedY

    // Rebote en los bordes con pequeña variación
    if (this.x > this.canvasWidth) {
      this.x = this.canvasWidth
      this.speedX = -Math.abs(this.speedX) * (0.9 + Math.random() * 0.2)
    } else if (this.x < 0) {
      this.x = 0
      this.speedX = Math.abs(this.speedX) * (0.9 + Math.random() * 0.2)
    }

    if (this.y > this.canvasHeight) {
      this.y = this.canvasHeight
      this.speedY = -Math.abs(this.speedY) * (0.9 + Math.random() * 0.2)
    } else if (this.y < 0) {
      this.y = 0
      this.speedY = Math.abs(this.speedY) * (0.9 + Math.random() * 0.2)
    }

    // Interacción con el cursor si está activo
    if (mouseActive) {
      const dx = mouseX - this.x
      const dy = mouseY - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < mouseRadius) {
        // Factor de influencia basado en la distancia
        const force = (1 - distance / mouseRadius) * 0.2

        // Atracción/repulsión - diferentes comportamientos por color
        if (this.colorIndex === 0) {
          // Las partículas grises se alejan
          this.x -= dx * force * 0.1
          this.y -= dy * force * 0.1
        } else {
          // Las coloridas se acercan
          this.x += dx * force * 0.05
          this.y += dy * force * 0.05
        }

        // Acelerar un poco cuando están cerca del cursor
        this.size += 0.1
        if (this.size > this.baseSize * 2) {
          this.size = this.baseSize * 2
        }
      } else {
        // Regresar gradualmente al tamaño base cuando están lejos
        if (this.size > this.baseSize) {
          this.size -= 0.05
        }
      }
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    const { r, g, b } = this.color
    ctx.globalAlpha = this.opacity
    ctx.fillStyle = `rgb(${r}, ${g}, ${b})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
    ctx.globalAlpha = 1
  }
}
