import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-skeleton-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="animate-pulse space-y-4">
      <div class="h-8 bg-muted rounded w-3/4"></div>
      <div class="h-4 bg-muted rounded w-full"></div>
      <div class="h-4 bg-muted rounded w-5/6"></div>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <div class="h-64 bg-muted rounded-xl"></div>
        <div class="h-64 bg-muted rounded-xl"></div>
        <div class="h-64 bg-muted rounded-xl"></div>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class SkeletonLoaderComponent {}
