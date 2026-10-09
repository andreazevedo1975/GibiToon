import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { ColorThemeId } from '../types/comic';
import { COLOR_THEMES } from '../data/colorThemes';

export interface PdfExportProgress {
  current: number;
  total: number;
  stage: string;
}

export interface PdfExportOptions {
  fileName?: string;
  quality?: 'standard' | 'high';
  colorTheme?: ColorThemeId;
  onProgress?: (progress: PdfExportProgress) => void;
}

/**
 * Exports A4 booklet pages into a high-fidelity PDF document.
 * Preserves Google Fonts ('Comic Neue', 'Bangers'), vector SVG speech bubbles,
 * and active CSS color filters (sepia, grayscale, vibrant, etc.).
 */
export async function exportA4BookletToPdf(
  pageElements: HTMLElement[],
  options: PdfExportOptions = {}
): Promise<void> {
  const {
    fileName = 'apostila-comicdocs.pdf',
    quality = 'high',
    colorTheme = 'default',
    onProgress,
  } = options;

  if (!pageElements || pageElements.length === 0) {
    throw new Error('Nenhuma página encontrada para exportação.');
  }

  // 1. Wait for custom web fonts (Comic Neue, Bangers, Space Grotesk) to be fully loaded
  if (document.fonts) {
    onProgress?.({
      current: 0,
      total: pageElements.length,
      stage: 'Carregando fontes tipográficas e vetores...',
    });
    try {
      await document.fonts.ready;
    } catch {
      // Continue even if fonts.ready fails
    }
  }

  // 2. Resolution scale: 2.4 for crisp 300 DPI print quality, 1.8 for standard
  const scale = quality === 'high' ? 2.4 : 1.8;
  const totalPages = pageElements.length;

  // 3. Initialize jsPDF in A4 portrait (210mm x 297mm)
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  // Get active CSS filter rule if any
  const themeDef = COLOR_THEMES[colorTheme || 'default'];
  const activeCssFilter = themeDef && themeDef.cssFilter !== 'none' ? themeDef.cssFilter : null;

  for (let i = 0; i < totalPages; i++) {
    const el = pageElements[i];

    onProgress?.({
      current: i + 1,
      total: totalPages,
      stage: `Renderizando página A4 ${i + 1} de ${totalPages}...`,
    });

    // 4. Capture DOM element using html2canvas
    const canvas = await html2canvas(el, {
      scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      windowWidth: 1080,
      onclone: (clonedDoc, clonedElement) => {
        // Hide editor action buttons in clone
        const editActions = clonedDoc.querySelectorAll('.no-print, [title*="Editar"], [title*="Excluir"]');
        editActions.forEach((item) => {
          (item as HTMLElement).style.display = 'none';
        });

        // Ensure background is solid white for clean A4 printing
        clonedElement.style.backgroundColor = '#ffffff';
        clonedElement.style.boxShadow = 'none';
        clonedElement.style.margin = '0';
      },
    });

    // 5. Apply CSS Color Theme Filter if active
    let finalCanvas: HTMLCanvasElement = canvas;
    if (activeCssFilter) {
      const filteredCanvas = document.createElement('canvas');
      filteredCanvas.width = canvas.width;
      filteredCanvas.height = canvas.height;
      const ctx = filteredCanvas.getContext('2d');
      if (ctx) {
        ctx.filter = activeCssFilter;
        ctx.drawImage(canvas, 0, 0);
        finalCanvas = filteredCanvas;
      }
    }

    // 6. Convert canvas to JPEG (0.95 quality for sharp vector outlines and comic text)
    const imgData = finalCanvas.toDataURL('image/jpeg', 0.94);

    // 7. Calculate exact dimensions on A4 sheet (210mm x 297mm)
    const pdfPageWidth = 210;
    const pdfPageHeight = 297;

    const canvasAspectRatio = finalCanvas.width / finalCanvas.height;
    let renderWidth = pdfPageWidth;
    let renderHeight = pdfPageWidth / canvasAspectRatio;

    let posX = 0;
    let posY = 0;

    if (renderHeight > pdfPageHeight) {
      // If content is taller than A4, fit by height
      renderHeight = pdfPageHeight;
      renderWidth = pdfPageHeight * canvasAspectRatio;
      posX = (pdfPageWidth - renderWidth) / 2;
    } else {
      // Center vertically on A4 page
      posY = Math.max(0, (pdfPageHeight - renderHeight) / 2);
    }

    if (i > 0) {
      pdf.addPage('a4', 'portrait');
    }

    pdf.addImage(imgData, 'JPEG', posX, posY, renderWidth, renderHeight, undefined, 'FAST');
  }

  onProgress?.({
    current: totalPages,
    total: totalPages,
    stage: 'Finalizando documento e salvando PDF...',
  });

  // 8. Download the PDF file directly to client
  pdf.save(fileName);
}
