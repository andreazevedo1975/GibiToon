import React from 'react';
import { BookOpen, Smartphone, Printer, Code2, PlusCircle, Sparkles, RefreshCw } from 'lucide-react';

export type ViewMode = 'webtoon' | 'comic_book' | 'print_a4' | 'json_schema';

interface HeaderProps {
  currentMode: ViewMode;
  onChangeMode: (mode: ViewMode) => void;
  onOpenWizard: () => void;
  onResetToSample: () => void;
  onOpenPromptAssistant: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onChangeMode,
  onOpenWizard,
  onResetToSample,
  onOpenPromptAssistant,
  title,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800 px-3 sm:px-6 py-3 no-print">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center text-neutral-950 shadow-[2px_2px_0px_0px_#000] border-2 border-black rotate-[-2deg]">
              <span className="font-cartoon font-extrabold text-base leading-none">GT</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-cartoon font-extrabold text-lg text-amber-400 tracking-wide drop-shadow-[1px_1px_0px_#000]">
                  GibiToon
                </span>
                <span className="px-1.5 py-0.2 rounded text-[10px] font-bangers uppercase bg-rose-500 text-white border border-black shadow-[1px_1px_0px_0px_#000]">
                  STUDIO
                </span>
              </div>
              <p className="text-[11px] text-amber-200/90 font-comic font-bold truncate max-w-[200px] sm:max-w-xs">
                Apostilas Didáticas em Quadrinhos
              </p>
            </div>
          </div>

          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={onOpenWizard}
              className="p-2 rounded-xl bg-amber-500 text-neutral-950 font-bold"
              title="Nova Apostila"
            >
              <PlusCircle className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* View Mode Switcher Pills */}
        <div className="flex items-center space-x-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl text-xs overflow-x-auto max-w-full">
          <button
            onClick={() => onChangeMode('webtoon')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              currentMode === 'webtoon'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Webtoon (Vertical)</span>
          </button>

          <button
            onClick={() => onChangeMode('comic_book')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              currentMode === 'comic_book'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Gibi (Páginas)</span>
          </button>

          <button
            onClick={() => onChangeMode('print_a4')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              currentMode === 'print_a4'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Apostila A4 / PDF</span>
          </button>

          <button
            onClick={() => onChangeMode('json_schema')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              currentMode === 'json_schema'
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-xs'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>JSON Engine</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-2">
          <button
            onClick={onOpenPromptAssistant}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-purple-200 text-xs font-bold border border-purple-700/60 transition shadow-xs"
            title="Abrir o assistente de IA para sugerir e otimizar prompts de difusão"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Prompts Difusão IA</span>
          </button>

          <button
            onClick={onResetToSample}
            className="flex items-center space-x-1 px-3 py-2 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium border border-neutral-800 transition"
            title="Recarregar o exemplo canônico de Redes e TCP/IP (3 páginas)"
          >
            <RefreshCw className="w-3.5 h-3.5 text-neutral-400" />
            <span>Exemplo TCP/IP</span>
          </button>

          <button
            onClick={onOpenWizard}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition shadow-md active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Nova Apostila</span>
          </button>
        </div>
      </div>
    </header>
  );
};
