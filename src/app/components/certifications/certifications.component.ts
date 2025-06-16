import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../../services/analytics.service';

interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

@Component({
  selector: 'app-certifications',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss']
})
export class CertificationsComponent implements OnInit {
  certificates: Certificate[] = [];
  
  constructor(
    private translateService: TranslateService,
    private analyticsService: AnalyticsService
  ) {}
  
  ngOnInit(): void {
    this.loadCertificationsData();
    
    // Rastrear vista de la sección de certificaciones
    this.analyticsService.trackSectionView('certifications');
    
    this.translateService.onLangChange.subscribe(() => {
      this.loadCertificationsData();
    });
  }

  private loadCertificationsData(): void {
    this.translateService.get('certifications.items').subscribe((data: Certificate[]) => {
      this.certificates = data || [];
    });
  }

  // Métodos para rastrear eventos
  onCertificateClick(certificateName: string): void {
    this.analyticsService.trackEvent('certificate_click', 'certifications', certificateName);
  }
}