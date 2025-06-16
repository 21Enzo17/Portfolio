import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../services/analytics.service';

interface Education {
  degree: string;
  institution: string;
  period: string;
  location: string;
  description: string;
  achievements?: string[];
  skills?: string[];
  gpa?: string;
  url?: string;
  logo?: string;
  certificateUrl?: string;
  type?: 'formal' | 'course' | 'certification' | 'certificate';
  issuer?: string; // Para certificaciones externas
  date?: string;   // Fecha específica para certificaciones
}

@Component({
  selector: 'app-education',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.scss']
})
export class EducationComponent implements OnInit {
  educationItems: Education[] = [];
  filteredEducationItems: Education[] = [];
  expandedItems: Set<string> = new Set();
  filterTypes: string[] = [];
  currentFilter: string = 'all';

  constructor(
    private translateService: TranslateService,
    private analyticsService: AnalyticsService
  ) {}
  
  ngOnInit(): void {
    this.loadEducationData();
    
    this.translateService.onLangChange.subscribe(() => {
      this.loadEducationData();
    });
  }
  
  private loadEducationData(): void {
    // Cargar educación formal
    this.translateService.get('education.items').subscribe((educationData: Education[]) => {
        this.educationItems = [...educationData];
        this.filteredEducationItems = [...this.educationItems];
        
        // Extract available education types for filtering
        const types = new Set<string>();
        types.add('all');
        
        this.educationItems.forEach(item => {
          if (item.type) {
            types.add(item.type);
          }
        });
        
        this.filterTypes = Array.from(types);
      });
  }

  // Filter methods
  filterEducationByType(type: string): void {
    this.currentFilter = type;
    
    if (type === 'all') {
      this.filteredEducationItems = [...this.educationItems];
    } else {
      this.filteredEducationItems = this.educationItems.filter(item => item.type === type);
    }
    
    this.analyticsService.trackEvent('education_filter', 'education', type);
  }
  
  // Expansion methods
  toggleExpand(education: Education): void {
    const key = education.degree;
    
    if (this.expandedItems.has(key)) {
      this.expandedItems.delete(key);
    } else {
      this.expandedItems.add(key);
      this.onEducationClick(key);
    }
  }
  
  isExpanded(education: Education): boolean {
    return this.expandedItems.has(education.degree);
  }

  // Analytics methods
  onEducationClick(educationTitle: string): void {
    this.analyticsService.trackEvent('education_click', 'education', educationTitle);
  }

  onEducationHover(educationTitle: string): void {
    this.analyticsService.trackEvent('education_hover', 'education', educationTitle);
  }
  
  onCertificateClick(certificateName: string): void {
    this.analyticsService.trackEvent('certificate_click', 'education', certificateName);
  }
  
  // Helper methods for optimization
  trackByDegree(index: number, item: Education): string {
    return item.degree;
  }
}