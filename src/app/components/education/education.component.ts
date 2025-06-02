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
    this.translateService.get('education.items').subscribe((data: Education[]) => {
      this.educationItems = data;
    });
  }

  // Analytics method for education item interactions
  onEducationClick(educationTitle: string): void {
    this.analyticsService.trackEvent('education_click', 'education', educationTitle);
  }

  onEducationHover(educationTitle: string): void {
    this.analyticsService.trackEvent('education_hover', 'education', educationTitle);
  }
}