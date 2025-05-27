import { Injectable } from "@angular/core"
import { TranslateService } from "@ngx-translate/core"
import jsPDF from "jspdf"
import { firstValueFrom } from "rxjs"
import { PERSONAL_INFO } from "../config/personal-info.config"

// Definición de temas para el CV optimizado para ATS
export interface CvTheme {
  primary: string
  secondary: string
  text: string
  background: string
  accent: string
  fontPrimary: string
  fontSecondary: string
  sectionBackground?: string
  headerBackground?: string
  borderColor?: string
}

// Temas predefinidos optimizados para ATS con mejor diseño visual
export const CV_THEMES = {
  ats_professional: {
    primary: "#1A1A1A",
    secondary: "#444444",
    text: "#333333",
    background: "#ffffff",
    accent: "#0B5394",
    fontPrimary: "Calibri, Arial, sans-serif",
    fontSecondary: "Calibri, Arial, sans-serif",
    sectionBackground: "#f9f9f9",
    headerBackground: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  ats_modern: {
    primary: "#2D3748",
    secondary: "#4A5568",
    text: "#1A202C",
    background: "#ffffff",
    accent: "#3182CE",
    fontPrimary: "Helvetica, Arial, sans-serif",
    fontSecondary: "Helvetica, Arial, sans-serif",
    sectionBackground: "#f7fafc",
    headerBackground: "#edf2f7",
    borderColor: "#e2e8f0",
  },
  ats_elegant: {
    primary: "#1a3c5a",
    secondary: "#2c5282",
    text: "#2d3748",
    background: "#ffffff",
    accent: "#4299e1",
    fontPrimary: "Georgia, Times New Roman, serif",
    fontSecondary: "Arial, sans-serif",
    sectionBackground: "#f8fafc",
    headerBackground: "#e6f0f9",
    borderColor: "#cbd5e0",
  },
}

@Injectable({
  providedIn: "root",
})
export class CvGeneratorAtsService {  // Constantes para márgenes y tamaños de página A4 en mm
  private readonly PAGE_WIDTH = 210 // A4 width in mm
  private readonly PAGE_HEIGHT = 297 // A4 height in mm
  private readonly MARGIN_TOP = 20
  private readonly MARGIN_RIGHT = 20
  private readonly MARGIN_BOTTOM = 20
  private readonly MARGIN_LEFT = 20
  private readonly CONTENT_WIDTH = this.PAGE_WIDTH - this.MARGIN_LEFT - this.MARGIN_RIGHT
  private readonly CONTENT_HEIGHT = this.PAGE_HEIGHT - this.MARGIN_TOP - this.MARGIN_BOTTOM
  
  // Textos según idioma
  private texts: {[key: string]: string} = {};

  // Centralized Page Manager (Solution 3)
  private pageManager = {
    pdf: null as jsPDF | null,
    currentPage: 1,
    yPos: this.MARGIN_TOP,
    footerHeight: 15, // Space reserved for footer
    theme: null as CvTheme | null,

    initialize: (pdf: jsPDF, theme: CvTheme) => {
      this.pageManager.pdf = pdf;
      this.pageManager.theme = theme;
      this.pageManager.currentPage = 1;
      this.pageManager.yPos = this.MARGIN_TOP;
      this.addPageNumber(pdf, 1);
    },

    addNewPage: () => {
      if (!this.pageManager.pdf) return;
      this.pageManager.pdf.addPage();
      this.pageManager.currentPage++;
      this.pageManager.yPos = this.MARGIN_TOP;
      this.addPageNumber(this.pageManager.pdf, this.pageManager.currentPage);
    },

    checkSpace: (heightNeeded: number): boolean => {
      const availableSpace = this.PAGE_HEIGHT - this.MARGIN_BOTTOM - this.pageManager.footerHeight;
      return (this.pageManager.yPos + heightNeeded) <= availableSpace;
    },

    reserveSpace: (heightNeeded: number): boolean => {
      if (!this.pageManager.checkSpace(heightNeeded)) {
        this.pageManager.addNewPage();
        return true; // Page break occurred
      }
      return false; // No page break needed
    },

    getCurrentY: (): number => {
      return this.pageManager.yPos;
    },

    setCurrentY: (newY: number): void => {
      this.pageManager.yPos = newY;
    },

    updateY: (increment: number): void => {
      this.pageManager.yPos += increment;
    }
  };

  constructor(private translateService: TranslateService) {}

  /**
   * Precise Content Height Measurement Functions (Solution 2)
   */
  
  /**
   * Measures the exact height needed for text content
   */
  private measureTextHeight(pdf: jsPDF, text: string, width: number, fontSize: number): number {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, width);
    return lines.length * (fontSize * 0.352778); // Convert pt to mm (1pt = 0.352778mm)
  }

  /**
   * Measures height for a section header
   */
  private measureSectionHeaderHeight(): number {
    return 8; // Title (12pt) + line + spacing
  }

  /**
   * Measures height for experience section content
   */
  private measureExperienceHeight(pdf: jsPDF, experience: any): number {
    let height = 15; // Base height for title, company, period
    
    if (experience.sections) {
      for (const section of experience.sections) {
        switch (section.type) {
          case 'projects':
            for (const project of section.content) {
              height += 4; // Project title
              height += this.measureTextHeight(pdf, project.descriptions.join(' '), this.CONTENT_WIDTH - 15, 9);
              height += 4; // Spacing
            }
            break;
          case 'list':
            for (const item of section.content) {
              height += this.measureTextHeight(pdf, item, this.CONTENT_WIDTH - 15, 9);
            }
            break;
          case 'technologies':
            const techText = `Tecnologías: ${section.content.join(', ')}`;
            height += this.measureTextHeight(pdf, techText, this.CONTENT_WIDTH - 5, 9);
            break;
          case 'text':
            for (const textItem of section.content) {
              height += this.measureTextHeight(pdf, textItem, this.CONTENT_WIDTH - 15, 9);
            }
            break;
        }
        height += 3; // Section spacing
      }
    }
    
    return height + 5; // Final spacing
  }

  /**
   * Measures height for education section content
   */
  private measureEducationHeight(pdf: jsPDF, education: any): number {
    let height = 15; // Base height for degree, institution, period
    
    if (education.description) {
      height += this.measureTextHeight(pdf, education.description, this.CONTENT_WIDTH - 5, 9);
      height += 2;
    }
    
    return height;
  }

  /**
   * Measures height for project section content
   */
  private measureProjectContentHeight(pdf: jsPDF, project: any): number {
    let height = 5; // Project name
    height += this.measureTextHeight(pdf, project.description, this.CONTENT_WIDTH - 5, 9);
    height += 2;
    
    const techText = `Tecnologías: ${project.technologies.join(', ')}`;
    height += this.measureTextHeight(pdf, techText, this.CONTENT_WIDTH - 5, 9);
    
    if (project.url) {
      height += 4;
    }
    
    return height + 3; // Final spacing
  }

  /**
   * Measures height for skills category content
   */
  private measureSkillsCategoryHeight(pdf: jsPDF, category: any, theme: CvTheme): number {
    let height = 4; // Category title
    
    const skillsText = category.items.map((skill: any) => skill.name).join(", ");
    height += this.measureTextHeight(pdf, skillsText, this.CONTENT_WIDTH / 2 - 5, 9);
    height += 5; // Spacing after category
    
    return height;
  }

  /**
   * Genera un CV en formato PDF optimizado para ATS con paginación mejorada
   * @param photoUrl URL de la foto de perfil (opcional)
   * @param themeName Nombre del tema a utilizar
   * @param customTheme Tema personalizado (opcional)
   * @param keywords Palabras clave adicionales para optimización ATS
   * @returns Promise que se resuelve cuando el PDF se ha generado y descargado
   */
  async generateCV(
    photoUrl?: string,
    themeName: keyof typeof CV_THEMES = "ats_professional",
    customTheme?: Partial<CvTheme>,
    keywords?: string[],
  ): Promise<void> {
    // Seleccionar tema base
    const baseTheme = CV_THEMES[themeName]
    // Aplicar personalizaciones si existen
    const theme: CvTheme = { ...baseTheme, ...(customTheme || {}) }

    try {
      // Obtener los datos del idioma actual
      const currentLang = this.translateService.currentLang

      // Obtener los datos del CV
      const [heroData, experienceData, skillsData, contactData, projectsData, educationData] = await Promise.all([
        firstValueFrom(this.translateService.get("hero")),
        firstValueFrom(this.translateService.get("experience")),
        firstValueFrom(this.translateService.get("skills")),
        firstValueFrom(this.translateService.get("footer.contact")),
        firstValueFrom(this.translateService.get("projects")),
        firstValueFrom(this.translateService.get("education")),
      ])

      // Cargar la foto si se proporciona una URL
      let photoDataUrl = ""
      if (photoUrl) {
        try {
          photoDataUrl = await this.loadImageAsDataUrl(photoUrl)
        } catch (error) {
          console.error("Error al cargar la foto:", error)
        }
      }

      // Generar el PDF directamente con jsPDF para mejor control de paginación
      await this.generatePdfDirectly(
        currentLang,
        { heroData, experienceData, skillsData, contactData, projectsData, educationData },
        theme,
        photoDataUrl,
        keywords,
      )
    } catch (error) {
      console.error("Error al generar el CV:", error)
      throw new Error("No se pudo generar el CV")
    }
  }
  /**
   * Carga una imagen como Data URL con redimensionamiento automático
   * @param url URL de la imagen a cargar
   * @returns Promise que se resuelve con la imagen en formato Data URL
   */
  private loadImageAsDataUrl(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.crossOrigin = "anonymous"
      img.onload = () => {
        // Redimensionar la imagen si es demasiado grande
        const maxSize = 400 // tamaño máximo en píxeles
        let width = img.width
        let height = img.height

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width
          width = maxSize
        } else if (height > maxSize) {
          width = (width * maxSize) / height
          height = maxSize
        }

        const canvas = document.createElement("canvas")
        canvas.width = width
        canvas.height = height
        const ctx = canvas.getContext("2d")
        ctx?.drawImage(img, 0, 0, width, height)
        resolve(canvas.toDataURL("image/jpeg", 0.9))
      }
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = url
    })
  }  /**
   * Genera el PDF directamente con jsPDF usando el sistema de gestión centralizada de páginas (Soluciones 2 y 3)
   * @param currentLang Idioma actual ('es' o 'en')
   * @param data Datos del CV organizados por secciones
   * @param theme Tema del CV con colores y fuentes
   * @param photoDataUrl URL de la foto en formato Data URL (opcional)
   * @param keywords Palabras clave adicionales para optimización ATS
   */
  private async generatePdfDirectly(
    currentLang: string,
    data: any,
    theme: CvTheme,
    photoDataUrl = "",
    keywords: string[] = [],
  ): Promise<void> {
    // Initialize texts based on current language
    this.texts = {
      professionalSummary: currentLang === "es" ? "RESUMEN PROFESIONAL" : "PROFESSIONAL SUMMARY",
      coreCompetencies: currentLang === "es" ? "COMPETENCIAS CLAVE" : "CORE COMPETENCIES",
      education: currentLang === "es" ? "EDUCACIÓN" : "EDUCATION",
      experience: currentLang === "es" ? "EXPERIENCIA" : "EXPERIENCE",
      skills: currentLang === "es" ? "HABILIDADES" : "SKILLS",
      projects: currentLang === "es" ? "PROYECTOS" : "PROJECTS",
      technologies: currentLang === "es" ? "Tecnologías" : "Technologies",
      resume: currentLang === "es" ? "Curriculum Vitae" : "Resume",
    };
    
    // Configuración para jsPDF
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
      putOnlyUsedFonts: true,
      hotfixes: ["px_scaling"],
    })

    // Initialize centralized page manager (Solution 3)
    this.pageManager.initialize(pdf, theme);

    // Extraer palabras clave de las habilidades para optimización ATS
    const skillKeywords = this.extractSkillKeywords(data.skillsData)
    const allKeywords = [...new Set([...skillKeywords, ...(keywords || [])])]

    // Configurar fuentes
    pdf.setFont(theme.fontPrimary.split(",")[0].trim())
    pdf.setTextColor(theme.text)    // ============ TWO-PASS RENDERING SYSTEM (Solution 2) ============
    
    // PASS 1: PRE-CALCULATE SECTION HEADERS ONLY
    const sectionHeaderHeight = this.measureSectionHeaderHeight();
    const professionalSummaryHeight = sectionHeaderHeight + this.measureTextHeight(pdf, data.heroData.bio.replace(/<[^>]*>/g, ""), this.CONTENT_WIDTH, 10) + 5;

    // PASS 2: RENDER WITH ITEM-BY-ITEM SPACE MANAGEMENT    
    // Create compatibility wrapper for legacy checkForNewPage function
    const legacyCheckForNewPage = (heightNeeded: number): boolean => {
      return this.pageManager.reserveSpace(heightNeeded);
    };

    // Create compatibility wrapper for getCurrentYPos function  
    const getCurrentYPos = (): number => {
      return this.pageManager.getCurrentY();
    };
    
    // Añadir encabezado con foto
    this.pageManager.setCurrentY(this.addHeader(pdf, data.contactData, photoDataUrl, theme, this.pageManager.getCurrentY()));

    // Añadir resumen profesional
    this.pageManager.reserveSpace(professionalSummaryHeight);
    this.pageManager.setCurrentY(this.addProfessionalSummary(pdf, data.heroData, currentLang, theme, this.pageManager.getCurrentY()));

    // Añadir experiencia laboral (item-by-item calculation)
    this.pageManager.setCurrentY(this.addExperienceSection(pdf, data.experienceData, currentLang, theme, this.pageManager.getCurrentY(), legacyCheckForNewPage));

    // Añadir educación (item-by-item calculation)
    this.pageManager.setCurrentY(this.addEducationSection(pdf, data.educationData, currentLang, theme, this.pageManager.getCurrentY(), legacyCheckForNewPage));

    // Añadir habilidades (pre-calculated section)
    this.pageManager.reserveSpace(45); // Estimated for two-column layout
    this.pageManager.setCurrentY(this.addSkillsSection(pdf, data.skillsData, currentLang, theme, this.pageManager.getCurrentY(), legacyCheckForNewPage));

    // Añadir proyectos (item-by-item calculation)
    this.pageManager.setCurrentY(this.addProjectsSection(pdf, data.projectsData, currentLang, theme, this.pageManager.getCurrentY(), legacyCheckForNewPage, getCurrentYPos));

    // Añadir pie de página
    this.addFooter(pdf, currentLang, theme)

    // Guardar el PDF con un nombre descriptivo y fecha
    const date = new Date().toISOString().split("T")[0]
    pdf.save(`CV_${PERSONAL_INFO.name.replace(/\s+/g, "_")}_${currentLang === "es" ? "ESP" : "ENG"}_${date}.pdf`)
  }
  /**
   * Añade el número de página al pie de página
   * @param pdf Instancia de jsPDF
   * @param pageNumber Número de página actual
   */
  private addPageNumber(pdf: jsPDF, pageNumber: number): void {
    const pageText = `${pageNumber}`
    pdf.setFontSize(8)
    pdf.setTextColor(100, 100, 100)
    // Ajustamos la posición para que coincida con el espacio reservado para el footer
    pdf.text(pageText, this.PAGE_WIDTH - this.MARGIN_RIGHT - 5, this.PAGE_HEIGHT - this.MARGIN_BOTTOM - 5)
  }
  /**
   * Añade el encabezado del CV con información personal
   * @param pdf Instancia de jsPDF
   * @param contactData Datos de contacto adicionales (como ubicación)
   * @param photoDataUrl URL de la foto en formato Data URL
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @returns Nueva posición Y después del encabezado
   */
  private addHeader(pdf: jsPDF, contactData: any, photoDataUrl: string, theme: CvTheme, startY: number): number {
    let yPos = startY;
    
    // Dibujar fondo del encabezado
    pdf.setFillColor(theme.headerBackground || "#f5f5f5");
    pdf.rect(this.MARGIN_LEFT, yPos, this.CONTENT_WIDTH, 40, "F");

    // Añadir nombre y título usando PERSONAL_INFO
    pdf.setFontSize(18);
    pdf.setTextColor(theme.primary);
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold");
    pdf.text(PERSONAL_INFO.name, this.MARGIN_LEFT + 5, yPos + 10);

    pdf.setFontSize(12);
    pdf.setTextColor(theme.secondary);
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal");
    pdf.text(PERSONAL_INFO.title, this.MARGIN_LEFT + 5, yPos + 16);

    // Calcular posición X para alinear información de contacto a la derecha
    const contactX = photoDataUrl ? this.PAGE_WIDTH - this.MARGIN_RIGHT - 40 : this.PAGE_WIDTH - this.MARGIN_RIGHT - 5;    // Información de contacto básica
    pdf.setFontSize(9);
    pdf.setTextColor(theme.text);
    
    // Solo mostrar ubicación si está disponible en contactData
    if (contactData?.location) {
      pdf.text(contactData.location, contactX, yPos + 8, { align: "right" });
    }
    
    // Email clickeable
    pdf.setTextColor(theme.accent);
    pdf.textWithLink(PERSONAL_INFO.email, contactX, yPos + 13, { 
      align: "right",
      url: `mailto:${PERSONAL_INFO.email}`
    });
    
    // Teléfono clickeable (WhatsApp)
    pdf.textWithLink(PERSONAL_INFO.phone, contactX, yPos + 18, { 
      align: "right",
      url: `https://wa.me/${PERSONAL_INFO.phone.replace(/\s+/g, '').replace(/[^\d+]/g, '')}`
    });

    // Enlaces profesionales con color de acento y clickeables
    pdf.textWithLink(PERSONAL_INFO.linkedin, contactX, yPos + 23, { 
      align: "right",
      url: `https://${PERSONAL_INFO.linkedin}`
    });
    
    pdf.textWithLink(PERSONAL_INFO.portfolio, contactX, yPos + 28, { 
      align: "right",
      url: `https://${PERSONAL_INFO.portfolio}`
    });
    
    pdf.textWithLink(PERSONAL_INFO.github, contactX, yPos + 33, { 
      align: "right",
      url: `https://${PERSONAL_INFO.github}`
    });

    // Añadir foto si existe
    if (photoDataUrl) {
      try {
        pdf.addImage(photoDataUrl, "JPEG", this.PAGE_WIDTH - this.MARGIN_RIGHT - 30, yPos + 10, 25, 25);
      } catch (error) {
        console.error("Error al añadir la foto al PDF:", error);
      }
    }

    yPos += 40;
    return yPos;
  }
  /**
   * Añade la sección de resumen profesional al PDF
   * @param pdf Instancia de jsPDF
   * @param heroData Datos del héroe con información personal
   * @param currentLang Idioma actual ('es' o 'en')
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @returns Nueva posición Y después de añadir la sección
   */
  private addProfessionalSummary(
    pdf: jsPDF,
    heroData: any,
    currentLang: string,
    theme: CvTheme,
    startY: number,
  ): number {
    let yPos = startY

    // Título de la sección
    pdf.setFontSize(12)
    pdf.setTextColor(theme.primary)
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
    pdf.text(this.texts['professionalSummary'], this.MARGIN_LEFT, yPos)

    // Línea debajo del título
    pdf.setDrawColor(theme.accent)
    pdf.setLineWidth(0.5)
    pdf.line(this.MARGIN_LEFT, yPos + 1, this.PAGE_WIDTH - this.MARGIN_RIGHT, yPos + 1)

    yPos += 6    // Contenido del resumen
    pdf.setFontSize(10)
    pdf.setTextColor(theme.text)
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

    const bio = heroData.bio.replace(/<[^>]*>/g, "")
    const bioLines = pdf.splitTextToSize(bio, this.CONTENT_WIDTH)

    // Texto justificado para el resumen profesional
    pdf.text(bioLines, this.MARGIN_LEFT, yPos, { align: "justify", maxWidth: this.CONTENT_WIDTH })

    // Actualizar posición Y
    yPos += bioLines.length * 5 + 5

    return yPos
  }  /**
   * Añade la sección de experiencia laboral con gestión centralizada de páginas
   * @param pdf Instancia de jsPDF
   * @param experienceData Datos de experiencia laboral
   * @param currentLang Idioma actual
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @param checkForNewPage Función para verificar nueva página (legacy compatibility)
   * @returns Nueva posición Y después de la sección
   */
  private addExperienceSection(
    pdf: jsPDF,
    experienceData: any,
    currentLang: string,
    theme: CvTheme,
    startY: number,
    checkForNewPage: (height: number) => boolean,
  ): number {
    // Usar pageManager para gestión centralizada
    this.pageManager.setCurrentY(startY);

    // Título de la sección
    pdf.setFontSize(12);
    pdf.setTextColor(theme.primary);
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold");
    pdf.text(experienceData.title.toUpperCase(), this.MARGIN_LEFT, this.pageManager.getCurrentY());

    // Línea debajo del título
    pdf.setDrawColor(theme.accent);
    pdf.setLineWidth(0.5);
    pdf.line(this.MARGIN_LEFT, this.pageManager.getCurrentY() + 1, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY() + 1);

    this.pageManager.updateY(6);

    // Contenido de experiencia
    if (experienceData.items && experienceData.items.length) {
      for (let i = 0; i < experienceData.items.length; i++) {
        const exp = experienceData.items[i];

        // Medición precisa del espacio necesario para esta experiencia
        const expHeight = this.measureExperienceHeight(pdf, exp);
        
        // Reservar espacio usando pageManager
        if (this.pageManager.reserveSpace(expHeight)) {
          // Page break occurred, continue from new Y position
        } else if (i > 0) {
          // Añadir espacio entre experiencias solo si no hubo page break
          this.pageManager.updateY(3);
        }

        const currentY = this.pageManager.getCurrentY();

        // Dibujar fondo para esta experiencia
        if (i % 2 === 0) {
          pdf.setFillColor(theme.sectionBackground || "#f9f9f9");
          pdf.rect(this.MARGIN_LEFT, currentY - 3, this.CONTENT_WIDTH, 15, "F");
        }

        // Título del puesto
        pdf.setFontSize(11);
        pdf.setTextColor(theme.primary);
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold");
        pdf.text(exp.jobTitle, this.MARGIN_LEFT, currentY);

        // Empresa
        pdf.setFontSize(10);
        pdf.setTextColor(theme.secondary);
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal");
        pdf.text(exp.company, this.MARGIN_LEFT, currentY + 5);

        // Período y ubicación
        pdf.setFontSize(9);
        pdf.text(`${exp.period} | ${exp.location}`, this.PAGE_WIDTH - this.MARGIN_RIGHT, currentY + 5, { align: "right" });

        this.pageManager.updateY(10);

        // Secciones de la experiencia
        if (exp.sections && exp.sections.length) {
          for (const section of exp.sections) {
            // Usar pageManager para verificar espacio de secciones
            this.pageManager.reserveSpace(10);

            const sectionY = this.pageManager.getCurrentY();

            // Título de la sección sin iconos
            const sectionTitle = this.cleanIcons(section.title);

            pdf.setFontSize(10);
            pdf.setTextColor(theme.accent);
            pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold");
            pdf.text(sectionTitle, this.MARGIN_LEFT + 5, sectionY);

            this.pageManager.updateY(5);

            // Contenido de la sección según su tipo
            pdf.setFontSize(9);
            pdf.setTextColor(theme.text);
            pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal");

            switch (section.type) {
              case "projects":
                for (const project of section.content) {
                  // Medición precisa para proyectos
                  const projectHeight = 4 + this.measureTextHeight(pdf, project.descriptions.join(' '), this.CONTENT_WIDTH - 15, 9) + 4;
                  this.pageManager.reserveSpace(projectHeight);

                  const projectY = this.pageManager.getCurrentY();

                  // Título del proyecto
                  pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold");
                  pdf.text(project.title, this.MARGIN_LEFT + 10, projectY);
                  pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal");

                  this.pageManager.updateY(4);

                  // Descripciones del proyecto
                  for (const desc of project.descriptions) {
                    this.pageManager.reserveSpace(5);

                    const cleanDesc = desc.replace(/^- /, "");
                    const descLines = pdf.splitTextToSize(cleanDesc, this.CONTENT_WIDTH - 15);

                    // Añadir viñeta
                    pdf.text("•", this.MARGIN_LEFT + 10, this.pageManager.getCurrentY());
                    pdf.text(descLines, this.MARGIN_LEFT + 15, this.pageManager.getCurrentY());

                    this.pageManager.updateY(descLines.length * 4);
                  }

                  this.pageManager.updateY(2);
                }
                break;

              case "list":
                for (const item of section.content) {
                  // Medición precisa para items de lista
                  const itemHeight = this.measureTextHeight(pdf, item, this.CONTENT_WIDTH - 15, 9);
                  this.pageManager.reserveSpace(itemHeight);

                  const itemLines = pdf.splitTextToSize(item, this.CONTENT_WIDTH - 15);

                  // Añadir viñeta
                  pdf.text("•", this.MARGIN_LEFT + 10, this.pageManager.getCurrentY());
                  pdf.text(itemLines, this.MARGIN_LEFT + 15, this.pageManager.getCurrentY());

                  this.pageManager.updateY(itemLines.length * 4);
                }
                break;

              case "technologies":
                // Medición precisa para tecnologías
                const techText = `${this.texts['technologies']}: ${section.content.join(", ")}`;
                const techHeight = this.measureTextHeight(pdf, techText, this.CONTENT_WIDTH - 5, 9);
                this.pageManager.reserveSpace(techHeight);

                const techLines = pdf.splitTextToSize(techText, this.CONTENT_WIDTH - 5);
                pdf.text(techLines, this.MARGIN_LEFT + 5, this.pageManager.getCurrentY());

                this.pageManager.updateY(techLines.length * 4);
                break;

              case "text":
                for (const textItem of section.content) {
                  // Medición precisa para texto
                  const textHeight = this.measureTextHeight(pdf, textItem, this.CONTENT_WIDTH - 15, 9);
                  this.pageManager.reserveSpace(textHeight);

                  const textLines = pdf.splitTextToSize(textItem, this.CONTENT_WIDTH - 15);
                  pdf.text(textLines, this.MARGIN_LEFT + 10, this.pageManager.getCurrentY());

                  this.pageManager.updateY(textLines.length * 4);
                }
                break;
            }

            this.pageManager.updateY(3);
          }
        }

        this.pageManager.updateY(5);
      }
    } else {
      pdf.setFontSize(10);
      pdf.setTextColor(theme.text);
      pdf.text("No hay experiencia disponible.", this.MARGIN_LEFT, this.pageManager.getCurrentY());
      this.pageManager.updateY(5);
    }

    return this.pageManager.getCurrentY();
  }  /**
   * Añade la sección de educación al PDF
   * @param pdf Instancia de jsPDF
   * @param educationData Datos de educación
   * @param currentLang Idioma actual ('es' o 'en')
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @param checkForNewPage Función para verificar si se necesita nueva página
   * @returns Nueva posición Y después de añadir la sección
   */
  private addEducationSection(
    pdf: jsPDF,
    educationData: any,
    currentLang: string,
    theme: CvTheme,
    startY: number,
    checkForNewPage: (height: number) => boolean,
  ): number {
    // Usar pageManager para centralizar la gestión de posición
    this.pageManager.setCurrentY(startY);    // Medir y reservar espacio para el encabezado de la sección
    const headerHeight = this.measureSectionHeaderHeight();
    this.pageManager.reserveSpace(headerHeight);

    // Título de la sección
    pdf.setFontSize(12)
    pdf.setTextColor(theme.primary)
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
    pdf.text(this.texts['education'], this.MARGIN_LEFT, this.pageManager.getCurrentY())

    // Línea debajo del título
    pdf.setDrawColor(theme.accent)
    pdf.setLineWidth(0.5)
    pdf.line(this.MARGIN_LEFT, this.pageManager.getCurrentY() + 1, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY() + 1)

    this.pageManager.updateY(6);

    // Contenido de educación
    if (educationData && educationData.items && educationData.items.length) {
      for (let i = 0; i < educationData.items.length; i++) {
        const edu = educationData.items[i]        // Medir altura total necesaria para este item de educación
        const eduHeight = this.measureEducationHeight(pdf, edu);
        
        // Reservar espacio para el item completo
        this.pageManager.reserveSpace(eduHeight + (i > 0 ? 3 : 0));

        const currentY = this.pageManager.getCurrentY();

        // Añadir espacio entre elementos de educación
        if (i > 0) {
          this.pageManager.updateY(3);
        }

        // Dibujar fondo para esta educación
        if (i % 2 === 0) {
          pdf.setFillColor(theme.sectionBackground || "#f9f9f9")
          pdf.rect(this.MARGIN_LEFT, this.pageManager.getCurrentY() - 3, this.CONTENT_WIDTH, 15, "F")
        }

        // Título del grado
        pdf.setFontSize(11)
        pdf.setTextColor(theme.primary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
        pdf.text(edu.degree, this.MARGIN_LEFT, this.pageManager.getCurrentY())

        // Institución
        pdf.setFontSize(10)
        pdf.setTextColor(theme.secondary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")
        pdf.text(edu.institution, this.MARGIN_LEFT, this.pageManager.getCurrentY() + 5)

        // Período
        pdf.setFontSize(9)
        pdf.text(edu.period, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY() + 5, { align: "right" })

        this.pageManager.updateY(10);

        // Descripción si existe
        if (edu.description) {
          pdf.setFontSize(9)
          pdf.setTextColor(theme.text)

          const descLines = pdf.splitTextToSize(edu.description, this.CONTENT_WIDTH - 5)
          pdf.text(descLines, this.MARGIN_LEFT + 5, this.pageManager.getCurrentY())

          this.pageManager.updateY(descLines.length * 4 + 2);
        }
      }
    } else {
      pdf.setFontSize(10)
      pdf.setTextColor(theme.text)
      pdf.text("No hay información educativa disponible.", this.MARGIN_LEFT, this.pageManager.getCurrentY())
      this.pageManager.updateY(5);
    }

    return this.pageManager.getCurrentY();
  }  /**
   * Añade la sección de habilidades al PDF con layout de dos columnas
   * @param pdf Instancia de jsPDF
   * @param skillsData Datos de habilidades organizados por categorías
   * @param currentLang Idioma actual ('es' o 'en')
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @param checkForNewPage Función para verificar si se necesita nueva página
   * @returns Nueva posición Y después de añadir la sección
   */
  private addSkillsSection(
    pdf: jsPDF,
    skillsData: any,
    currentLang: string,
    theme: CvTheme,
    startY: number,
    checkForNewPage: (height: number) => boolean,
  ): number {
    // Usar pageManager para centralizar la gestión de posición
    this.pageManager.setCurrentY(startY);    // Medir y reservar espacio para el encabezado de la sección
    const headerHeight = this.measureSectionHeaderHeight();
    this.pageManager.reserveSpace(headerHeight);

    // Título de la sección
    pdf.setFontSize(12)
    pdf.setTextColor(theme.primary)
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
    pdf.text(skillsData.title.toUpperCase(), this.MARGIN_LEFT, this.pageManager.getCurrentY())

    // Línea debajo del título
    pdf.setDrawColor(theme.accent)
    pdf.setLineWidth(0.5)
    pdf.line(this.MARGIN_LEFT, this.pageManager.getCurrentY() + 1, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY() + 1)

    this.pageManager.updateY(6);

    // Contenido de habilidades
    const categories = ["frontend", "backend", "databases", "devops", "tools", "languages"]

    // Calcular cuántas categorías por columna (2 columnas)
    const halfIndex = Math.ceil(categories.length / 2)

    // Dibujar fondo para las habilidades
    pdf.setFillColor(theme.sectionBackground || "#f9f9f9")
    pdf.rect(this.MARGIN_LEFT, this.pageManager.getCurrentY() - 3, this.CONTENT_WIDTH, 5, "F")

    // Variables para tracking de posiciones de columnas
    let colYPos = this.pageManager.getCurrentY();
    let col2YPos = this.pageManager.getCurrentY();
    const col2X = this.MARGIN_LEFT + this.CONTENT_WIDTH / 2 + 5;

    // Primera columna de habilidades
    for (let i = 0; i < halfIndex; i++) {
      const category = categories[i]

      if (skillsData[category] && skillsData[category].items && skillsData[category].items.length) {
        // Medir altura necesaria para esta categoría
        const categoryHeight = this.measureSkillsCategoryHeight(pdf, skillsData[category], theme);
        
        // Verificar si necesitamos nueva página para esta categoría
        if (this.pageManager.getCurrentY() + categoryHeight > this.PAGE_HEIGHT - this.MARGIN_BOTTOM) {
          this.pageManager.addNewPage();
          colYPos = this.pageManager.getCurrentY();
        }

        // Título de la categoría
        pdf.setFontSize(10)
        pdf.setTextColor(theme.primary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
        pdf.text(skillsData[category].title, this.MARGIN_LEFT, colYPos)

        colYPos += 4

        // Lista de habilidades
        pdf.setFontSize(9)
        pdf.setTextColor(theme.text)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

        const skillsText = skillsData[category].items.map((skill: any) => skill.name).join(", ")
        const skillsLines = pdf.splitTextToSize(skillsText, this.CONTENT_WIDTH / 2 - 5)

        pdf.text(skillsLines, this.MARGIN_LEFT, colYPos)
        colYPos += skillsLines.length * 4 + 5
      }
    }

    // Segunda columna de habilidades
    for (let i = halfIndex; i < categories.length; i++) {
      const category = categories[i]

      if (skillsData[category] && skillsData[category].items && skillsData[category].items.length) {
        // Medir altura necesaria para esta categoría
        const categoryHeight = this.measureSkillsCategoryHeight(pdf, skillsData[category], theme);
        
        // Verificar si necesitamos nueva página para esta categoría
        if (col2YPos + categoryHeight > this.PAGE_HEIGHT - this.MARGIN_BOTTOM) {
          this.pageManager.addNewPage();
          col2YPos = this.pageManager.getCurrentY();
        }

        // Título de la categoría
        pdf.setFontSize(10)
        pdf.setTextColor(theme.primary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
        pdf.text(skillsData[category].title, col2X, col2YPos)

        col2YPos += 4

        // Lista de habilidades
        pdf.setFontSize(9)
        pdf.setTextColor(theme.text)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

        const skillsText = skillsData[category].items.map((skill: any) => skill.name).join(", ")
        const skillsLines = pdf.splitTextToSize(skillsText, this.CONTENT_WIDTH / 2 - 5)

        pdf.text(skillsLines, col2X, col2YPos)
        col2YPos += skillsLines.length * 4 + 5
      }
    }

    // Actualizar la posición Y global al máximo de las dos columnas
    const finalY = Math.max(colYPos, col2YPos) + 2;
    this.pageManager.setCurrentY(finalY);

    return this.pageManager.getCurrentY();
  }
  /**
   * Añade la sección de proyectos
   * @param pdf Instancia de jsPDF
   * @param projectsData Datos de los proyectos
   * @param currentLang Idioma actual
   * @param theme Tema del CV
   * @param startY Posición Y inicial
   * @param checkForNewPage Función para verificar nueva página
   * @param getCurrentYPos Función para obtener posición Y actual
   * @returns Nueva posición Y después de la sección
   */
  private addProjectsSection(
    pdf: jsPDF,
    projectsData: any,
    currentLang: string,
    theme: CvTheme,
    startY: number,
    checkForNewPage: (height: number) => boolean,
    getCurrentYPos: () => number,
  ): number {
    // Usar pageManager para centralizar la gestión de posición
    this.pageManager.setCurrentY(startY);

    // Medir y reservar espacio para el encabezado de la sección
    const headerHeight = this.measureSectionHeaderHeight();
    this.pageManager.reserveSpace(headerHeight);

    // Título de la sección
    pdf.setFontSize(12)
    pdf.setTextColor(theme.primary)
    pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
    pdf.text(projectsData.title.toUpperCase(), this.MARGIN_LEFT, this.pageManager.getCurrentY())

    // Línea debajo del título
    pdf.setDrawColor(theme.accent)
    pdf.setLineWidth(0.5)
    pdf.line(this.MARGIN_LEFT, this.pageManager.getCurrentY() + 1, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY() + 1)

    this.pageManager.updateY(6);

    // Contenido de proyectos
    if (projectsData.items && projectsData.items.length) {
      for (let i = 0; i < projectsData.items.length; i++) {
        const project = projectsData.items[i]

        // Medir altura precisa necesaria para este proyecto
        const projectHeight = this.measureProjectContentHeight(pdf, project);
        
        // Reservar espacio para el proyecto completo
        this.pageManager.reserveSpace(projectHeight + (i > 0 ? 3 : 0));

        // Añadir espacio entre proyectos
        if (i > 0) {
          this.pageManager.updateY(3);
        }

        // Dibujar fondo para proyectos alternos
        if (i % 2 === 0) {
          pdf.setFillColor(theme.sectionBackground || "#f9f9f9")
          pdf.rect(this.MARGIN_LEFT, this.pageManager.getCurrentY() - 3, this.CONTENT_WIDTH, projectHeight, "F")
        }

        // Nombre del proyecto
        pdf.setFontSize(11)
        pdf.setTextColor(theme.primary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "bold")
        pdf.text(project.name, this.MARGIN_LEFT, this.pageManager.getCurrentY())

        // Año del proyecto si existe
        if (project.year) {
          pdf.setFontSize(9)
          pdf.setTextColor(theme.secondary)
          pdf.text(project.year, this.PAGE_WIDTH - this.MARGIN_RIGHT, this.pageManager.getCurrentY(), { align: "right" })
        }

        this.pageManager.updateY(5);

        // Descripción del proyecto
        pdf.setFontSize(9)
        pdf.setTextColor(theme.text)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

        const descLines = pdf.splitTextToSize(project.description, this.CONTENT_WIDTH - 5)
        pdf.text(descLines, this.MARGIN_LEFT + 5, this.pageManager.getCurrentY())
        this.pageManager.updateY(descLines.length * 4 + 2);

        // Tecnologías utilizadas
        pdf.setFontSize(9)
        pdf.setTextColor(theme.secondary)
        pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

        const techText = `${this.texts['technologies']}: ${project.technologies.join(", ")}`
        const techLines = pdf.splitTextToSize(techText, this.CONTENT_WIDTH - 5)
        pdf.text(techLines, this.MARGIN_LEFT + 5, this.pageManager.getCurrentY())
        this.pageManager.updateY(techLines.length * 4);

        // URL del proyecto si existe
        if (project.url) {
          pdf.setTextColor(theme.accent)
          pdf.text(project.url, this.MARGIN_LEFT + 5, this.pageManager.getCurrentY())
          this.pageManager.updateY(4);
        }

        this.pageManager.updateY(3);
      }
    } else {
      pdf.setFontSize(10)
      pdf.setTextColor(theme.text)
      pdf.text("No hay proyectos disponibles.", this.MARGIN_LEFT, this.pageManager.getCurrentY())
      this.pageManager.updateY(5);
    }

    return this.pageManager.getCurrentY();
  }
  /**
   * Calcula la altura aproximada que necesitará un proyecto en el PDF
   * @param pdf Instancia de jsPDF para medición de texto
   * @param project Datos del proyecto
   * @param theme Tema del CV para referencias de fuente
   * @returns Altura estimada en milímetros
   */
  private calculateProjectHeight(pdf: jsPDF, project: any, theme: CvTheme): number {
    // Altura base: nombre (5) + descripción mínima (8) + tecnologías (8) + márgenes (6)
    let height = 27

    // Calcular líneas de descripción
    const descLines = pdf.splitTextToSize(project.description, this.CONTENT_WIDTH - 5)
    height += (descLines.length - 2) * 4 // -2 porque ya contamos altura mínima

    // Calcular líneas de tecnologías
    const techText = `${this.texts['technologies']}: ${project.technologies.join(", ")}`
    const techLines = pdf.splitTextToSize(techText, this.CONTENT_WIDTH - 5)
    height += (techLines.length - 2) * 4 // -2 porque ya contamos altura mínima

    // Añadir espacio para URL si existe
    if (project.url) {
      height += 4
    }

    return height
  }
  /**
   * Añade el pie de página al PDF en todas las páginas
   * @param pdf Instancia de jsPDF
   * @param currentLang Idioma actual ('es' o 'en')
   * @param theme Tema del CV
   */
  private addFooter(pdf: jsPDF, currentLang: string, theme: CvTheme): void {
    // Añadir pie de página en todas las páginas
    const totalPages = pdf.getNumberOfPages()

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i)

      // Línea superior del pie de página
      pdf.setDrawColor(theme.secondary)
      pdf.setLineWidth(0.3)
      pdf.line(
        this.MARGIN_LEFT,
        this.PAGE_HEIGHT - this.MARGIN_BOTTOM - 10,
        this.PAGE_WIDTH - this.MARGIN_RIGHT,
        this.PAGE_HEIGHT - this.MARGIN_BOTTOM - 10,
      )      // Texto del pie de página
      pdf.setFontSize(8)
      pdf.setTextColor(100, 100, 100)
      pdf.setFont(theme.fontPrimary.split(",")[0].trim(), "normal")

      const footerText = `${this.texts['resume']} - ${PERSONAL_INFO.name} - ${new Date().toLocaleDateString(currentLang === "es" ? "es-AR" : "en-US")}`

      pdf.text(footerText, this.PAGE_WIDTH / 2, this.PAGE_HEIGHT - this.MARGIN_BOTTOM - 5, { align: "center" })
    }
  }
  /**
   * Extrae palabras clave de las habilidades para optimización ATS
   * @param skillsData Datos de habilidades organizados por categorías
   * @returns Array de palabras clave extraídas de todas las categorías de habilidades
   */
  private extractSkillKeywords(skillsData: any): string[] {
    const keywords: string[] = []
    const categories = ["frontend", "backend", "databases", "devops", "tools", "languages"]

    categories.forEach((category) => {
      if (skillsData[category] && skillsData[category].items) {
        skillsData[category].items.forEach((skill: any) => {
          keywords.push(skill.name)
        })
      }
    })

    return keywords
  }  /**
   * Método para previsualizar el CV optimizado para ATS en el navegador
   * Este método crea un elemento HTML que simula el diseño del PDF
   * @param photoUrl URL de la foto de perfil (opcional)
   * @param themeName Nombre del tema a utilizar
   * @param customTheme Tema personalizado (opcional)
   * @param keywords Palabras clave adicionales para optimización ATS
   * @returns Promise que se resuelve con un elemento HTML que contiene la vista previa del CV
   */
  async previewAtsCV(
    photoUrl?: string,
    themeName: keyof typeof CV_THEMES = "ats_professional",
    customTheme?: Partial<CvTheme>,
    keywords?: string[],
  ): Promise<HTMLElement> {
    // Seleccionar tema base
    const baseTheme = CV_THEMES[themeName]
    // Aplicar personalizaciones si existen
    const theme: CvTheme = { ...baseTheme, ...(customTheme || {}) }

    // Crear un elemento HTML para la vista previa
    const previewElement = document.createElement("div")
    previewElement.className = "cv-preview"
    previewElement.style.width = "210mm"
    previewElement.style.margin = "0 auto"
    previewElement.style.boxShadow = "0 0 10px rgba(0,0,0,0.1)"
    previewElement.style.backgroundColor = "white"
    previewElement.style.padding = "20mm"
    previewElement.style.fontFamily = theme.fontPrimary

    try {
      // Obtener los datos del idioma actual
      const currentLang = this.translateService.currentLang

      // Obtener los datos del CV
      const [heroData, experienceData, skillsData, contactData, projectsData, educationData] = await Promise.all([
        firstValueFrom(this.translateService.get("hero")),
        firstValueFrom(this.translateService.get("experience")),
        firstValueFrom(this.translateService.get("skills")),
        firstValueFrom(this.translateService.get("footer.contact")),
        firstValueFrom(this.translateService.get("projects")),
        firstValueFrom(this.translateService.get("education")),
      ])

      // Cargar la foto si se proporciona una URL
      let photoDataUrl = ""
      if (photoUrl) {
        try {
          photoDataUrl = await this.loadImageAsDataUrl(photoUrl)
        } catch (error) {
          console.error("Error al cargar la foto:", error)
        }
      }

      // Construir el HTML para la vista previa
      previewElement.innerHTML = this.buildPreviewHtml(
        currentLang,
        { heroData, experienceData, skillsData, contactData, projectsData, educationData },
        theme,
        photoDataUrl,
        keywords,
      )

      return previewElement
    } catch (error) {
      console.error("Error al previsualizar el CV:", error)
      throw new Error("No se pudo previsualizar el CV")
    }
  }
  /**
   * Construye el HTML para la vista previa del CV
   * @param currentLang Idioma actual ('es' o 'en')
   * @param data Datos del CV (héroe, experiencia, habilidades, etc.)
   * @param theme Tema del CV
   * @param photoDataUrl URL de la foto en formato Data URL (opcional)
   * @param keywords Palabras clave adicionales para optimización ATS
   * @returns String HTML completo con estilos CSS incluidos
   */
  private buildPreviewHtml(
    currentLang: string,
    data: any,
    theme: CvTheme,
    photoDataUrl = "",
    keywords: string[] = [],
  ): string {
    // Extraer palabras clave de las habilidades para optimización ATS
    const skillKeywords = this.extractSkillKeywords(data.skillsData)
    const allKeywords = [...new Set([...skillKeywords, ...(keywords || [])])]

    return `
      <style>
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: ${theme.fontPrimary};
          color: ${theme.text};
          line-height: 1.4;
        }
        .section {
          margin-bottom: 15px;
          page-break-inside: avoid;
        }
        .section-title {
          color: ${theme.primary};
          font-size: 14pt;
          font-weight: bold;
          text-transform: uppercase;
          border-bottom: 1px solid ${theme.accent};
          padding-bottom: 5px;
          margin-bottom: 10px;
        }
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
          background-color: ${theme.headerBackground || "#f5f5f5"};
          padding: 15px;
        }
        .contact-info {
          text-align: right;
          font-size: 10pt;
        }
        .profile-photo {
          width: 120px;
          height: 120px;
          border-radius: 5px;
          object-fit: cover;
          border: 1px solid ${theme.accent};
        }
        .striped-row:nth-child(even) {
          background-color: ${theme.sectionBackground || "#f9f9f9"};
        }
        .experience-item, .education-item, .project-item {
          padding: 10px;
          margin-bottom: 10px;
        }
        .job-title, .degree {
          color: ${theme.primary};
          font-weight: bold;
          font-size: 12pt;
        }
        .company, .institution {
          color: ${theme.secondary};
          font-size: 11pt;
        }
        .period {
          color: ${theme.secondary};
          font-size: 10pt;
        }
        .section-content {
          margin-left: 10px;
        }
        .keyword-tag {
          display: inline-block;
          padding: 3px 8px;
          background-color: #f5f5f5;
          border-radius: 3px;
          margin: 0 5px 5px 0;
          font-size: 9pt;
        }
        .skills-container {
          display: flex;
          flex-wrap: wrap;
        }
        .skill-category {
          width: 50%;
          padding-right: 10px;
          margin-bottom: 10px;
        }
        .skill-title {
          color: ${theme.primary};
          font-weight: bold;
          font-size: 11pt;
          margin-bottom: 5px;
        }
        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 8pt;
          color: ${theme.secondary};
          border-top: 1px solid ${theme.secondary};
          padding-top: 10px;
        }
        ul {
          padding-left: 20px;
        }
        li {
          margin-bottom: 3px;
        }
      </style>
      
      <!-- Header -->
      <div class="header">
        <div>
          <h1 style="margin: 0; font-size: 18pt; color: ${theme.primary};">${PERSONAL_INFO.name}</h1>
          <h2 style="margin: 5px 0 0 0; font-size: 14pt; font-weight: 500; color: ${theme.secondary};">${PERSONAL_INFO.title}</h2>
          
          <div class="contact-info" style="text-align: left; margin-top: 10px;">
            <p>${data.contactData.location}</p>
            <p>${PERSONAL_INFO.email}</p>
            <p>${PERSONAL_INFO.phone}</p>
            <p style="color: ${theme.accent};">${PERSONAL_INFO.linkedin}</p>
            <p style="color: ${theme.accent};">${PERSONAL_INFO.portfolio}</p>
            <p style="color: ${theme.accent};">${PERSONAL_INFO.github}</p>
          </div>
        </div>
        
        ${
          photoDataUrl
            ? `        
          <div>
            <img src="${photoDataUrl}" alt="${PERSONAL_INFO.name}" class="profile-photo" />
          </div>
        `
            : ""
        }
      </div>
      
      <!-- Resumen Profesional -->
      <div class="section">
        <h2 class="section-title">
          ${currentLang === "es" ? "Resumen Profesional" : "Professional Summary"}
        </h2>
        <p>${data.heroData.bio.replace(/<[^>]*>/g, "")}</p>
      </div>
      
      <!-- Experiencia -->
      <div class="section">
        <h2 class="section-title">${data.experienceData.title}</h2>
        ${data.experienceData.items
          .map(
            (exp: any, index: number) => `        
          <div class="experience-item striped-row">
            <div style="display: flex; justify-content: space-between;">
              <div>
                <div class="job-title">${exp.jobTitle}</div>
                <div class="company">${exp.company}</div>
              </div>
              <div class="period">${exp.period} | ${exp.location}</div>
            </div>
            
            ${
              exp.sections && exp.sections.length
                ? exp.sections
                    .map((section: any) => {
                      // Título de la sección sin iconos
                      const sectionTitle = this.cleanIcons(section.title);

                      let sectionContent = ""

                      switch (section.type) {
                        case "projects":
                          sectionContent = `        
                    <div class="section-content">
                      ${section.content
                        .map(
                          (project: any) => `        
                        <div style="margin-bottom: 8px;">
                          <div style="font-weight: bold;">${project.title}</div>
                          <ul>
                            ${project.descriptions
                              .map((desc: string) => `<li>${desc.replace(/^- /, "")}</li>`)
                              .join("")}
                          </ul>
                        </div>
                      `,
                        )
                        .join("")}
                    </div>
                  `
                          break

                        case "list":
                          sectionContent = `        
                    <div class="section-content">
                      <ul>
                        ${section.content.map((item: string) => `<li>${item}</li>`).join("")}
                      </ul>
                    </div>
                  `
                          break

                        case "technologies":
                          sectionContent = `        
                    <div class="section-content">
                      <p>${currentLang === "es" ? "Tecnologías" : "Technologies"}: ${section.content.join(", ")}</p>
                    </div>
                  `
                          break

                        case "text":
                          sectionContent = `        
                    <div class="section-content">
                      ${section.content.map((text: string) => `<p>${text}</p>`).join("")}
                    </div>
                  `
                          break
                      }

                      return `        
                <div style="margin-top: 10px;">
                  <div style="font-weight: bold; color: ${theme.accent};">${sectionTitle}</div>
                  ${sectionContent}
                </div>
              `
                    })
                    .join("")

                : ""
            }
          </div>
        `,
          )
          .join("")}
      </div>
      
      <!-- Educación -->
      ${
        data.educationData && data.educationData.items
          ? `        
        <div class="section">
          <h2 class="section-title">
            ${currentLang === "es" ? "Educación" : "Education"}
          </h2>
          ${data.educationData.items
            .map(
              (edu: any, index: number) => `        
            <div class="education-item striped-row">
              <div style="display: flex; justify-content: space-between;">
                <div>
                  <div class="degree">${edu.degree}</div>
                  <div class="institution">${edu.institution}</div>
                </div>
                <div class="period">${edu.period}</div>
              </div>
              ${edu.description ? `<p style="margin-top: 5px;">${edu.description}</p>` : ""}
            </div>
          `,
            )
            .join("")}
        </div>
      `

          : ""
      }
      
      <!-- Habilidades -->
      <div class="section">
        <h2 class="section-title">${data.skillsData.title}</h2>
        <div class="skills-container">
          ${["frontend", "backend", "databases", "devops", "tools", "languages"]
            .map((category) => {
              if (data.skillsData[category] && data.skillsData[category].items) {
                return `        
                <div class="skill-category">
                  <div class="skill-title">${data.skillsData[category].title}</div>
                  <p>${data.skillsData[category].items.map((skill: any) => skill.name).join(", ")}</p>
                </div>
              `
              }
              return ""
            })
            .join("")}
        </div>
      </div>
      
      <!-- Proyectos -->
      <div class="section">
        <h2 class="section-title">${data.projectsData.title}</h2>
        ${data.projectsData.items
          .map(
            (project: any, index: number) => `        
          <div class="project-item striped-row">
            <div style="display: flex; justify-content: space-between;">
              <div class="job-title">${project.name}</div>
              ${project.year ? `<div class="period">${project.year}</div>` : ""}
            </div>
            <p style="margin: 5px 0;">${project.description}</p>
            <p style="font-style: italic; color: ${theme.secondary};">${currentLang === "es" ? "Tecnologías" : "Technologies"}: ${project.technologies.join(", ")}</p>
            ${project.url ? `<p style="color: ${theme.accent};">${project.url}</p>` : ""}
          </div>
        `,

          )
          .join("")}
      </div>
      
      <!-- Footer -->
      <div class="footer">
        ${currentLang === "es" ? "Curriculum Vitae" : "Resume"} - ${PERSONAL_INFO.name} - ${new Date().toLocaleDateString(currentLang === "es" ? "es-AR" : "en-US")}
      </div>
    `
  }

  /**
   * Función de utilidad para eliminar íconos y símbolos de los textos
   * @param text Texto a limpiar
   * @returns Texto sin íconos ni símbolos
   */
  private cleanIcons(text: string): string {
    // Eliminar todos los emojis, incluidos los íconos específicos como 💻🔧⚙️🤝 y cualquier otro emoji
    return text.replace(/[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/ug, "").trim();
  }
}

// Ejemplo de uso:
// const cvService = new CvGeneratorAtsProService(translateService);
//
// // Generar CV con foto
// cvService.generateCV('https://example.com/mi-foto.jpg');
//
// // Generar CV con tema específico y palabras clave adicionales
// cvService.generateCV(
//   'https://example.com/mi-foto.jpg',
//   'ats_modern',
//   { accent: '#4A90E2' },
//   ['JavaScript', 'React', 'Node.js', 'TypeScript', 'AWS']
// );
//
// // Previsualizar CV
// const previewElement = await cvService.previewAtsCV('https://example.com/mi-foto.jpg');
// document.body.appendChild(previewElement);
