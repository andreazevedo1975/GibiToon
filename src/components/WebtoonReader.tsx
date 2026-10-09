import React from 'react';
import { ComicBook, ColorThemeId } from '../types/comic';
import { COLOR_THEMES, COLOR_THEME_LIST } from '../data/colorThemes';
import { ComicPanelCard } from './ComicPanelCard';
import { ArrowDown, BookOpen, Palette } from 'lucide-react';

interface WebtoonReaderProps {
  book: ComicBook;
  onUpdatePanel: (pageIdx: number, panelIdx: number, updatedPanel: any) => void;
  onOpenBubbleEditor: (pageIdx: number, panelIdx: number, bubble: any, bubbleIdx: number) => void;
  onAddBubble: (pageIdx: number, panelIdx: number) => void;
  onChangeColorTheme?: (theme: ColorThemeId) => void;
}

export const WebtoonReader: React.FC<WebtoonReaderProps> = ({
  book,
  onUpdatePanel,
  onOpenBubbleEditor,
  onAddBubble,
  onChangeColorTheme,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-6 px-3 sm:px-4 space-y-10">
      {/* Webtoon Series Banner */}
      <div className="text-center space-y-3 pb-6 border-b-2 border-black/50">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="px-3 py-1 rounded-md text-xs font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
            Gibi Webtoon Vertical • Scroll Contínuo
          </span>

          {/* Quick Color Theme Selector in Webtoon */}
          <div className="inline-flex items-center space-x-1.5 bg-[#141B2D] px-3 py-1 rounded-md border border-black shadow-[1.5px_1.5px_0px_0px_#000] text-xs">
            <Palette className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px] font-cartoon font-bold text-slate-300">Tema:</span>
            <select
              value={book.book_metadata.color_theme || 'default'}
              onChange={(e) => onChangeColorTheme && onChangeColorTheme(e.target.value as ColorThemeId)}
              className="bg-transparent text-xs font-cartoon font-bold text-amber-400 focus:outline-none cursor-pointer"
            >
              {COLOR_THEME_LIST.map((theme) => (
                <option key={theme.id} value={theme.id} className="bg-[#0D121F] text-white">
                  {theme.shortLabel}
                </option>
              ))}
            </select>
          </div>
        </div>

        <h1 className="text-3xl sm:text-4xl font-cartoon font-extrabold text-amber-400 tracking-wide drop-shadow-[1px_1px_0px_#000]">
          {book.book_metadata.title}
        </h1>
        <p className="text-sm text-amber-200/90 font-comic font-bold max-w-lg mx-auto">
          {book.book_metadata.topic}
        </p>

        {/* Character badges */}
        <div className="flex items-center justify-center space-x-4 pt-2">
          {book.book_metadata.characters.map((char) => (
            <div key={char.id} className="flex items-center space-x-2 text-xs text-neutral-300">
              <span
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: char.avatar_color || '#3b82f6' }}
              />
              <span className="font-bold">{char.name}</span>
              <span className="text-neutral-500 uppercase text-[10px]">({char.role})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pages and Panels in Vertical Stream */}
      {book.pages.map((page, pageIdx) => (
        <section key={page.page_number} className="space-y-6">
          {/* Chapter header */}
          <div className="flex items-center justify-between bg-neutral-900/80 border border-neutral-800 rounded-xl px-4 py-2.5">
            <div className="flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-300">
                Página {page.page_number} de {book.pages.length}
              </span>
            </div>
            {page.page_summary && (
              <span className="text-xs text-neutral-400 font-medium truncate max-w-xs sm:max-w-md">
                {page.page_summary}
              </span>
            )}
          </div>

          {/* Sequential Panels */}
          <div className="space-y-6">
            {page.panels.map((panel, panelIdx) => (
              <div key={panel.panel_index} className="w-full">
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

          {pageIdx < book.pages.length - 1 && (
            <div className="flex items-center justify-center py-4 text-neutral-600">
              <ArrowDown className="w-5 h-5 animate-bounce" />
            </div>
          )}
        </section>
      ))}

      {/* Webtoon Footer */}
      <div className="text-center py-10 border-t border-neutral-800 text-neutral-500 text-xs">
        <p className="font-display text-lg text-amber-500 tracking-wider">FIM DA APOSTILA</p>
        <p className="mt-1">ComicDocs AI • Transposição Didática em Histórias em Quadrinhos</p>
      </div>
    </div>
  );
};
