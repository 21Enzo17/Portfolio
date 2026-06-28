import { Component, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-san-expedito-easter-egg',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './san-expedito-easter-egg.component.html',
  styleUrls: ['./san-expedito-easter-egg.component.scss']
})
export class SanExpeditoEasterEggComponent implements OnInit, OnDestroy {
  showModal = false;
  isClosing = false;
  isFeastDay = false;
  private keySequence = '';
  private readonly secretWord = 'expedito';
  private resetTimeout: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    // Verificar si hoy es 19 de abril (día de San Expedito)
    const today = new Date();
    this.isFeastDay = today.getMonth() === 3 && today.getDate() === 19; // Abril es mes 3 (0-indexed)
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Ignorar si se está escribiendo en un input/textarea
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }

    // Acumular teclas
    this.keySequence += event.key.toLowerCase();

    // Resetear después de 2 segundos de inactividad
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    this.resetTimeout = setTimeout(() => {
      this.keySequence = '';
    }, 2000);

    // Verificar si la secuencia contiene la palabra secreta
    if (this.keySequence.includes(this.secretWord)) {
      this.keySequence = '';
      this.openModal();
    }

    // Evitar que la secuencia crezca indefinidamente
    if (this.keySequence.length > 20) {
      this.keySequence = this.keySequence.slice(-10);
    }
  }

  openModal(): void {
    this.showModal = true;
    this.isClosing = false;
    document.body.style.overflow = 'hidden';
  }

  closeModal(): void {
    this.isClosing = true;
    setTimeout(() => {
      this.showModal = false;
      this.isClosing = false;
      document.body.style.overflow = '';
    }, 400);
  }

  ngOnDestroy(): void {
    if (this.resetTimeout) {
      clearTimeout(this.resetTimeout);
    }
    document.body.style.overflow = '';
  }
}
