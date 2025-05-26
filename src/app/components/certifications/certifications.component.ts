import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

interface Language {
  language: string;
  level: string;
  comment?: string;
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
  languages: Language[] = [];
  hasCertificates: boolean = false;
  
  constructor(private translateService: TranslateService) {}
  
  ngOnInit(): void {
    this.loadCertificationsData();
    
    this.translateService.onLangChange.subscribe(() => {
      this.loadCertificationsData();
    });
  }
    private loadCertificationsData(): void {
    this.translateService.get('certifications.hasCertificates').subscribe((hasData: boolean) => {
      this.hasCertificates = hasData;
    });
    
    this.translateService.get('certifications.certificates').subscribe((data: any) => {
      if (data && Array.isArray(data)) {
        this.certificates = data;
      } else if (data && data.items && Array.isArray(data.items)) {
        this.certificates = data.items;
      } else {
        this.certificates = [];
      }
    });
    
    this.translateService.get('certifications.languages.items').subscribe((data: Language[]) => {
      this.languages = data || [];
    });
  }
}