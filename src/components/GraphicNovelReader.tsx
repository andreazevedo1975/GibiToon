import React, { useState } from 'react';
import { ComicBook, ColorThemeId } from '../types/comic';
import { COLOR_THEMES, COLOR_THEME_LIST } from '../data/colorThemes';
import { ComicPanelCard } from './ComicPanelCard';
import { ChevronLeft, ChevronRight, BookOpen, Palette } from 'lucide-react';

interface GraphicNovelReaderProps {
  book: ComicBook;
  onUpdatePanel: (pageIdx: number, panelIdx: number, updatedPanel: any) => void;
  onOpenBubbleEditor: (pageIdx: number, panelIdx: number, bubble: any, bubbleIdx: number) => void;
  onAddBubble: (pageIdx: number, panelIdx: number) => void;
  onChangeColorTheme?: (theme: ColorThemeId) => void;
}

export const GraphicNovelReader: React.FC<GraphicNovelReaderProps> = ({
  book,
  onUpdatePanel,
  onOpenBubbleEditor,
  onAddBubble,
  onChangeColorTheme,
}) => {
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  const currentPage = book.pages[currentPageIndex] || book.pages[0];

  const handlePrev = () => {
    if (currentPageIndex > 0) setCurrentPageIndex(currentPageIndex - 1);
  };

  const handleNext = () => {
    if (currentPageIndex < book.pages.length - 1) setCurrentPageIndex(currentPageIndex + 1);
  };

  // Determine grid layout classes
  const getLayoutClasses = (layoutType: string, panelCount: number) => {
    if (layoutType === 'hero_top_two_bottom') {
      return {
        container: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        getPanelSpan: (index: number) => (index === 0 ? 'md:col-span-2' : 'md:col-span-1'),
      };
    }
    if (layoutType === 'two_vertical_split') {
      return {
        container: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        getPanelSpan: () => 'md:col-span-1',
      };
    }
    // grid_4_uniform or dynamic default
    return {
      container: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      getPanelSpan: (index: number) => (panelCount === 3 && index === 0 ? 'md:col-span-2' : 'col-span-1'),
    };
  };

  const layout = getLayoutClasses(currentPage.layout_type, currentPage.panels.length);

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-4 space-y-6">
      {/* Top Controls & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#0D121F] border-2 border-black rounded-2xl p-4 shadow-[4px_4px_0px_0px_#000]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-neutral-950 shadow-[2px_2px_0px_0px_#000]">
            <BookOpen className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-base font-cartoon font-extrabold text-amber-400 tracking-wide">
              {book.book_metadata.title}
            </h2>
            <p className="text-xs text-amber-200/90 font-comic font-bold">
              {currentPage.page_summary || `Página ${currentPage.page_number} de ${book.pages.length}`}
            </p>
          </div>
        </div>

        {/* Page Switcher & Theme Selector */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Quick Color Theme Switcher */}
          <div className="flex items-center space-x-1.5 bg-[#141B2D] px-2.5 py-1.5 rounded-xl border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-cartoon font-bold text-slate-300 hidden sm:inline">Tema:</span>
            <select
              value={book.book_metadata.color_theme || 'default'}
              onChange={(e) => onChangeColorTheme && onChangeColorTheme(e.target.value as ColorThemeId)}
              className="bg-transparent text-xs font-cartoon font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {COLOR_THEME_LIST.map((theme) => (
                <option key={theme.id} value={theme.id} className="bg-[#0D121F] text-white">
                  {theme.shortLabel} {theme.id !== 'default' ? `(${theme.tag})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrev}
              disabled={currentPageIndex === 0}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-[#162035] hover:bg-[#1E2B47] text-white font-cartoon text-xs font-bold disabled:opacity-30 disabled:pointer-events-none transition border border-black shadow-[1.5px_1.5px_0px_0px_#000] cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              <span className="hidden sm:inline">Anterior</span>
            </button>

            {/* Page Indicators */}
            <div className="flex items-center space-x-1.5 px-1">
              {book.pages.map((p, idx) => (
                <button
                  key={p.page_number}
                  onClick={() => setCurrentPageIndex(idx)}
                  className={`w-7 h-7 rounded-lg text-xs font-cartoon font-bold transition flex items-center justify-center cursor-pointer border border-black ${
                    currentPageIndex === idx
                      ? 'bg-amber-400 text-neutral-950 shadow-[1.5px_1.5px_0px_0px_#000] scale-105'
                      : 'bg-[#141B2D] text-slate-300 hover:text-white hover:bg-[#1C2740]'
                  }`}
                >
                  {p.page_number}
                </button>
              ))}
            </div>

            <button
              onClick={handleNext}
              disabled={currentPageIndex === book.pages.length - 1}
              className="flex items-center space-x-1 px-3 py-2 rounded-xl btn-cartoon-yellow text-xs cursor-pointer disabled:opacity-30 disabled:pointer-events-none"
            >
              <span className="hidden sm:inline">Próxima</span>
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Comic Page Surface (Styled like a printed graphic novel spread) */}
      <div className="bg-neutral-950 border-4 border-neutral-900 rounded-2xl p-4 sm:p-6 shadow-2xl relative">
        {/* Page header banner */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-800/80">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {currentPage.layout_type.replace(/_/g, ' ')}
            </span>
            {book.book_metadata.color_theme && book.book_metadata.color_theme !== 'default' && (
              <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                Filtro: {COLOR_THEMES[book.book_metadata.color_theme]?.shortLabel}
              </span>
            )}
          </div>
          <span className="text-xs font-mono font-bold text-neutral-400">
            PÁGINA {currentPage.page_number} / {book.pages.length}
          </span>
        </div>

        {/* Dynamic Panel Grid */}
        <div className={layout.container}>
          {currentPage.panels.map((panel, panelIdx) => (
            <div key={panel.panel_index} className={layout.getPanelSpan(panelIdx)}>
              <ComicPanelCard
                panel={panel}
                characters={book.book_metadata.characters}
                artStyle={book.book_metadata.art_style}
                colorTheme={book.book_metadata.color_theme}
                pageNumber={currentPage.page_number}
                isEditable={true}
                topic={book.book_metadata.topic}
                onUpdatePanel={(updated) => onUpdatePanel(currentPageIndex, panelIdx, updated)}
                onOpenBubbleEditor={(bubble, bIdx) =>
                  onOpenBubbleEditor(currentPageIndex, panelIdx, bubble, bIdx)
                }
                onAddBubble={() => onAddBubble(currentPageIndex, panelIdx)}
              />
            </div>
          ))}
        </div>

        {/* Page footer */}
        <div className="mt-6 pt-3 border-t border-neutral-800/60 flex items-center justify-between text-[11px] text-neutral-500 font-mono">
          <span>{book.book_metadata.title}</span>
          <span>ComicDocs AI • Transposição Pedagógica</span>
        </div>
      </div>
    </div>
  );
};
