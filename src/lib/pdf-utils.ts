import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

interface CompanyLogo {
  imageData: string;  // Base64 encoded image data
  width: number;
  height: number;
}

interface PDFConfig {
  systemOwnerLogo?: CompanyLogo;  // Logo de la empresa dueña del sistema
  clientLogo?: CompanyLogo;       // Logo del cliente
  companyName: string;
  clientName: string;
  reportTitle: string;
  footerText?: string;
}

export class PDFGenerator {
  private pdf: jsPDF;
  private config: PDFConfig;
  private pageWidth: number;
  private margin: number = 20;
  private headerHeight: number = 40;

  constructor(config: PDFConfig, orientation: 'p' | 'l' = 'p') {
    this.pdf = new jsPDF(orientation, 'mm', 'a4');
    this.config = config;
    this.pageWidth = orientation === 'p' ? 210 : 297;
    this.setupHeader();
  }

  private setupHeader() {
    // Configurar fuentes y estilos
    this.pdf.setFont('helvetica');
    this.pdf.setFontSize(10);

    // Agregar logos si están disponibles
    let currentX = this.margin;
    
    if (this.config.systemOwnerLogo) {
      this.pdf.addImage(
        this.config.systemOwnerLogo.imageData,
        'PNG',
        currentX,
        this.margin,
        this.config.systemOwnerLogo.width,
        this.config.systemOwnerLogo.height
      );
      currentX += this.config.systemOwnerLogo.width + 10;
    }

    // Texto central con nombre de empresas y título
    const centerX = this.pageWidth / 2;
    let currentY = this.margin;

    // Nombre de la empresa dueña del sistema
    this.pdf.setFontSize(12);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.config.companyName, centerX, currentY, { align: 'center' });
    currentY += 6;

    // Nombre del cliente
    this.pdf.setFontSize(11);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(this.config.clientName, centerX, currentY, { align: 'center' });
    currentY += 6;

    // Título del reporte
    this.pdf.setFontSize(14);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.text(this.config.reportTitle, centerX, currentY, { align: 'center' });

    // Logo del cliente a la derecha si está disponible
    if (this.config.clientLogo) {
      this.pdf.addImage(
        this.config.clientLogo.imageData,
        'PNG',
        this.pageWidth - this.margin - this.config.clientLogo.width,
        this.margin,
        this.config.clientLogo.width,
        this.config.clientLogo.height
      );
    }

    // Fecha y hora
    const now = new Date();
    const dateStr = format(now, 'dd/MM/yyyy');
    const timeStr = format(now, 'HH:mm:ss');
    
    this.pdf.setFontSize(9);
    this.pdf.setFont('helvetica', 'normal');
    this.pdf.text(
      `Fecha: ${dateStr}    Hora: ${timeStr}`,
      this.pageWidth - this.margin,
      this.headerHeight + 5,
      { align: 'right' }
    );

    // Línea separadora
    this.pdf.setLineWidth(0.5);
    this.pdf.line(
      this.margin,
      this.headerHeight + 10,
      this.pageWidth - this.margin,
      this.headerHeight + 10
    );
  }

  public startY(): number {
    return this.headerHeight + 15;
  }

  public addFooter(pageNumber: number) {
    const footerY = this.pdf.internal.pageSize.height - 10;
    
    // Agregar número de página
    this.pdf.setFontSize(9);
    this.pdf.text(
      `Página ${pageNumber}`,
      this.pageWidth - this.margin,
      footerY,
      { align: 'right' }
    );

    // Agregar texto de pie de página si está configurado
    if (this.config.footerText) {
      this.pdf.text(
        this.config.footerText,
        this.margin,
        footerY,
        { align: 'left' }
      );
    }
  }

  public getPDF(): jsPDF {
    return this.pdf;
  }

  public save(filename: string) {
    this.pdf.save(filename);
  }
}

// Función de ayuda para convertir una imagen a Base64
export const imageToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// Función de ayuda para redimensionar una imagen manteniendo la proporción
export const resizeImage = (
  imageData: string,
  maxWidth: number,
  maxHeight: number
): Promise<CompanyLogo> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageData;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      resolve({
        imageData: canvas.toDataURL('image/png'),
        width: width / 5, // Convertir a mm (aproximadamente)
        height: height / 5 // Convertir a mm (aproximadamente)
      });
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};
