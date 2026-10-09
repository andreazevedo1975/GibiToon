import React, { useState, useRef } from 'react';
import { ComicBook, ColorThemeId } from '../types/comic';
import { COLOR_THEMES, COLOR_THEME_LIST } from '../data/colorThemes';
import { ComicPanelCard } from './ComicPanelCard';
import { exportA4BookletToPdf, PdfExportProgress } from '../utils/pdfExport';
import {
  Printer,
  Download,
  Sparkles,
  AlertCircle,
  Palette,
  CheckCircle2,
  FileCheck,
  Loader2,
  Sliders,
  Type,
  BookOpen,
} from 'lucide-react';

interface A4BookletPrintViewProps {
  book: ComicBook;
  onUpdatePanel: (pageIdx: number, panelIdx: number, updatedPanel: any) => void;
  onOpenBubbleEditor: (pageIdx: number, panelIdx: number, bubble: any, bubbleIdx: number) => void;
  onAddBubble: (pageIdx: number, panelIdx: number) => void;
  onChangeColorTheme?: (theme: ColorThemeId) => void;
}

export const A4BookletPrintView: React.FC<A4BookletPrintViewProps> = ({
  book,
  onUpdatePanel,
  onOpenBubbleEditor,
  onAddBubble,
  onChangeColorTheme,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfQuality, setPdfQuality] = useState<'standard' | 'high'>('high');
  const [includeCover, setIncludeCover] = useState(true);
  const [exportProgress, setExportProgress] = useState<PdfExportProgress | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);

  // References for printable A4 sheets
  const coverSheetRef = useRef<HTMLDivElement>(null);
  const pageSheetRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handlePrintBrowser = () => {
    window.print();
  };

  const handleExportPdf = async () => {
    setIsExportingPdf(true);
    setExportSuccessMessage(null);

    try {
      // Gather elements to export in sequential order
      const elementsToExport: HTMLElement[] = [];

      if (includeCover && coverSheetRef.current) {
        elementsToExport.push(coverSheetRef.current);
      }

      pageSheetRefs.current.forEach((el) => {
        if (el) elementsToExport.push(el);
      });

      if (elementsToExport.length === 0) {
        throw new Error('Nenhuma folha A4 encontrada para exportar.');
      }

      // Safe slugified title for file name
      const safeTitle = book.book_metadata.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

      const fileName = `apostila-a4-${safeTitle || 'quadrinhos'}.pdf`;

      await exportA4BookletToPdf(elementsToExport, {
        fileName,
        quality: pdfQuality,
        colorTheme: book.book_metadata.color_theme || 'default',
        onProgress: (p) => setExportProgress(p),
      });

      setExportSuccessMessage(`Apostila "${book.book_metadata.title}" exportada com sucesso em PDF!`);
      setTimeout(() => setExportSuccessMessage(null), 6000);
    } catch (err: any) {
      console.error('Erro ao exportar PDF:', err);
      alert('Não foi possível gerar o PDF. Verifique o console para mais detalhes.');
    } finally {
      setIsExportingPdf(false);
      setExportProgress(null);
    }
  };

  const activeTheme = COLOR_THEMES[book.book_metadata.color_theme || 'default'] || COLOR_THEMES.default;

  return (
    <div className="w-full max-w-4xl mx-auto py-6 px-3 sm:px-6 space-y-8">
      {/* Print & PDF Export Control Center (Hidden during window.print) */}
      <div className="no-print bg-[#080D1A] border border-[#16233B] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
        {/* Top Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#16233B]">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Layout A4 Oficial • 210mm × 297mm
              </span>
              <span className="text-xs text-slate-400">• Proporção Gráfica Perfeita</span>
            </div>
            <h2 className="text-xl font-bold text-white font-display tracking-wide mt-1">
              Exportação em PDF & Impressão Física A4
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Preserva a tipografia original (<span className="font-comic font-bold text-amber-300">Comic Neue</span> &{' '}
              <span className="font-display text-amber-300">Bangers</span>), balões vetoriais e filtros de cores.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Primary Action: Direct PDF Export */}
            <button
              onClick={handleExportPdf}
              disabled={isExportingPdf}
              className="flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-200 text-neutral-950 font-black text-sm uppercase tracking-wider transition shadow-xl active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Gera e baixa um arquivo PDF no formato A4"
            >
              {isExportingPdf ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                  <span>Gerando PDF...</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 text-neutral-950" />
                  <span>Baixar Arquivo PDF (.pdf)</span>
                </>
              )}
            </button>

            {/* Secondary Action: Browser Native Print */}
            <button
              onClick={handlePrintBrowser}
              disabled={isExportingPdf}
              className="flex items-center space-x-2 px-4 py-3 rounded-xl bg-[#111E38] hover:bg-[#182B50] text-cyan-300 font-bold text-xs uppercase tracking-wider border border-cyan-500/30 transition cursor-pointer"
              title="Abre a caixa de impressão do navegador"
            >
              <Printer className="w-4 h-4" />
              <span>Imprimir / Salvar Navegador</span>
            </button>
          </div>
        </div>

        {/* Export Options & Fidelity Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          {/* 1. Theme Color Filter Switcher */}
          <div className="p-3 rounded-xl bg-[#050A14] border border-[#16233B] space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <Palette className="w-3.5 h-3.5 text-cyan-400" />
              <span>Filtro de Cores Ativo</span>
            </div>
            <select
              value={book.book_metadata.color_theme || 'default'}
              onChange={(e) => onChangeColorTheme && onChangeColorTheme(e.target.value as ColorThemeId)}
              className="w-full bg-[#080E1C] border border-[#182642] rounded-lg px-2 py-1 text-xs text-white font-bold cursor-pointer focus:outline-none"
            >
              {COLOR_THEME_LIST.map((theme) => (
                <option key={theme.id} value={theme.id} className="bg-neutral-950 text-white">
                  {theme.shortLabel} {theme.id === 'grayscale' ? '(P&B Econômico)' : ''}
                </option>
              ))}
            </select>
          </div>

          {/* 2. PDF Resolution Quality */}
          <div className="p-3 rounded-xl bg-[#050A14] border border-[#16233B] space-y-1">
            <div className="flex items-center space-x-1.5 text-slate-400 font-semibold text-[11px]">
              <Sliders className="w-3.5 h-3.5 text-amber-400" />
              <span>Resolução da Exportação</span>
            </div>
            <select
              value={pdfQuality}
              onChange={(e) => setPdfQuality(e.target.value as 'standard' | 'high')}
              className="w-full bg-[#080E1C] border border-[#182642] rounded-lg px-2 py-1 text-xs text-white font-bold cursor-pointer focus:outline-none"
            >
              <option value="high">Alta (300 DPI - Gráfica)</option>
              <option value="standard">Padrão (180 DPI - Leitura)</option>
            </select>
          </div>

          {/* 3. Include Cover Toggle */}
          <div className="p-3 rounded-xl bg-[#050A14] border border-[#16233B] flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[11px] text-slate-400 font-semibold block">Incluir Capa A4</span>
              <span className="text-xs font-bold text-white">
                {includeCover ? 'Capa + Páginas' : 'Apenas Quadrinhos'}
              </span>
            </div>
            <input
              type="checkbox"
              checked={includeCover}
              onChange={(e) => setIncludeCover(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 cursor-pointer"
            />
          </div>

          {/* 4. Fidelity Guarantee Checklist */}
          <div className="p-3 rounded-xl bg-[#050A14] border border-[#16233B] space-y-1 flex flex-col justify-center">
            <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Balões Vetoriais Preservados</span>
            </div>
            <div className="flex items-center space-x-1 text-emerald-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Fontes Comic & Bangers</span>
            </div>
            <div className="flex items-center space-x-1 text-cyan-400 text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 shrink-0" />
              <span>Filtro: {activeTheme.shortLabel}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar during Export */}
        {isExportingPdf && exportProgress && (
          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 space-y-2 animate-pulse">
            <div className="flex items-center justify-between text-xs font-bold text-cyan-300">
              <div className="flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                <span>{exportProgress.stage}</span>
              </div>
              <span className="font-mono">
                {Math.round((exportProgress.current / exportProgress.total) * 100)}%
              </span>
            </div>
            <div className="w-full h-2 bg-[#050A14] rounded-full overflow-hidden border border-cyan-800/40">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-amber-400 transition-all duration-300"
                style={{
                  width: `${(exportProgress.current / exportProgress.total) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* Success Banner */}
        {exportSuccessMessage && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center space-x-2 text-xs font-bold text-emerald-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{exportSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Printable Document Container (A4 Sheets) */}
      <div className="print-container space-y-10">
        {/* Cover / First Page Sheet (A4 Sheet 1) */}
        {includeCover && (
          <div
            ref={coverSheetRef}
            id="a4-page-cover"
            className="a4-page-sheet bg-white text-black p-8 sm:p-10 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] space-y-6 print-page-break relative"
          >
            {/* Top Comic Book Masthead */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4">
              <div>
                <span className="text-xs font-mono font-black tracking-widest uppercase bg-black text-white px-2.5 py-0.5 inline-block">
                  GIBITOON STUDIO • APOSTILA EM QUADRINHOS • FORMATO A4
                </span>
                <h1 className="text-3xl sm:text-5xl font-display text-neutral-950 mt-2 uppercase tracking-wide leading-tight">
                  {book.book_metadata.title}
                </h1>
                <p className="text-sm font-comic font-bold text-neutral-700 mt-1">
                  TEMA DIDÁTICO: {book.book_metadata.topic}
                </p>
              </div>

              <div className="text-right hidden sm:block">
                <span className="text-xs font-mono font-bold block text-neutral-600 uppercase">
                  PÚBLICO-ALVO
                </span>
                <span className="text-sm font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-300 inline-block mt-0.5">
                  {book.book_metadata.target_audience}
                </span>
              </div>
            </div>

            {/* Visual Theme and Filter Badge on Cover */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-neutral-100 rounded-xl border-2 border-black text-xs font-mono">
              <div className="flex items-center space-x-2">
                <span className="font-bold uppercase text-neutral-700">ESTILO ARTÍSTICO:</span>
                <span className="font-black bg-black text-white px-2 py-0.5 rounded text-[11px]">
                  {book.book_metadata.art_style.toUpperCase()}
                </span>
              </div>

              {book.book_metadata.color_theme && book.book_metadata.color_theme !== 'default' && (
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold uppercase text-neutral-700">FILTRO CROMÁTICO:</span>
                  <span className="font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-400">
                    {activeTheme.name}
                  </span>
                </div>
              )}
            </div>

            {/* Character Guide */}
            <div className="bg-neutral-50 p-4 rounded-xl border-2 border-black space-y-2">
              <span className="text-xs font-mono font-black uppercase text-neutral-600 block">
                GUIA DE PERSONAGENS & CONDUTORES DA NARRATIVA:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {book.book_metadata.characters.map((char) => (
                  <div
                    key={char.id}
                    className="flex items-start space-x-2.5 p-2 rounded-lg bg-white border border-black/40"
                  >
                    <span
                      className="w-4 h-4 rounded-full border-2 border-black shrink-0 mt-0.5"
                      style={{ backgroundColor: char.avatar_color || '#2563EB' }}
                    />
                    <div>
                      <span className="font-display text-sm text-neutral-900 block leading-tight">
                        {char.name}
                      </span>
                      <span className="text-neutral-500 text-[10px] uppercase font-mono block">
                        {char.role === 'mentor' ? 'Mentor Especialista' : 'Aprendiz Curioso'}
                      </span>
                      <p className="text-[11px] font-comic text-neutral-700 mt-0.5 leading-snug">
                        {char.visual_description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Objectives Box */}
            <div className="p-4 rounded-xl bg-amber-50 border-2 border-black space-y-1">
              <span className="text-xs font-mono font-black uppercase text-amber-900 block">
                OBJETIVO PEDAGÓGICO DE APRENDIZAGEM:
              </span>
              <p className="text-xs font-comic font-bold text-neutral-800 leading-relaxed">
                Esta apostila em quadrinhos utiliza transposição didática visual, analogias conceituais e
                narrativa sequencial para consolidar o entendimento profundo de{' '}
                <strong>{book.book_metadata.topic}</strong> com retenção mnemônica superior.
              </p>
            </div>

            {/* Cover Sheet Footer */}
            <div className="border-t-2 border-black pt-3 flex items-center justify-between text-[11px] font-comic font-bold text-neutral-600">
              <span>GibiToon Studio • Transposição Pedagógica em Quadrinhos</span>
              <span className="font-mono">PÁGINA 1 • CAPA & APRESENTAÇÃO</span>
            </div>
          </div>
        )}

        {/* Sequential A4 Printable Pages (A4 Sheet 2, 3, etc.) */}
        {book.pages.map((page, pageIdx) => (
          <div
            key={page.page_number}
            ref={(el) => {
              pageSheetRefs.current[pageIdx] = el;
            }}
            id={`a4-page-${page.page_number}`}
            className="a4-page-sheet bg-white text-black p-6 sm:p-8 rounded-2xl border-4 border-black shadow-[8px_8px_0px_#000] space-y-5 print-page-break relative"
          >
            {/* Header of the page */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center space-x-2">
                <span className="font-display text-xl text-neutral-900 tracking-wide">
                  PÁGINA {page.page_number}
                </span>
                <span className="text-xs font-comic font-bold text-neutral-600">
                  {page.page_summary ? `• ${page.page_summary}` : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {book.book_metadata.color_theme && book.book_metadata.color_theme !== 'default' && (
                  <span className="text-[10px] font-mono font-bold uppercase text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded border border-black/30">
                    Filtro: {activeTheme.shortLabel}
                  </span>
                )}
                <span className="text-[11px] font-mono font-bold text-neutral-500 uppercase truncate max-w-[200px]">
                  {book.book_metadata.title}
                </span>
              </div>
            </div>

            {/* Panels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {page.panels.map((panel, panelIdx) => (
                <div
                  key={panel.panel_index}
                  className={
                    page.layout_type === 'hero_top_two_bottom' && panelIdx === 0
                      ? 'md:col-span-2'
                      : 'col-span-1'
                  }
                >
                  <ComicPanelCard
                    panel={panel}
                    characters={book.book_metadata.characters}
                    artStyle={book.book_metadata.art_style}
                    colorTheme={book.book_metadata.color_theme}
                    pageNumber={page.page_number}
                    isEditable={true}
                    topic={book.book_metadata.topic}
                    onUpdatePanel={(updated) => onUpdatePanel(pageIdx, panelIdx, updated)}
                    onOpenBubbleEditor={(bubble, bIdx) =>
                      onOpenBubbleEditor(pageIdx, panelIdx, bubble, bIdx)
                    }
                    onAddBubble={() => onAddBubble(pageIdx, panelIdx)}
                  />
                </div>
              ))}
            </div>

            {/* A4 Page Didactic Footer */}
            <div className="border-t-2 border-black pt-3 flex items-center justify-between text-[11px] font-comic font-bold text-neutral-600">
              <span>GibiToon Studio • Apostila Ilustrada em Quadrinhos</span>
              <span>
                Página {includeCover ? page.page_number + 1 : page.page_number} de{' '}
                {includeCover ? book.pages.length + 1 : book.pages.length}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
