import React, { useState } from 'react';
import { ComicBook } from '../types/comic';
import { Copy, Check, Download, Upload, FileCode, Sparkles } from 'lucide-react';
import { ART_STYLES } from '../data/styles';

interface StoryboardJsonViewerProps {
  book: ComicBook;
  onImportJson: (imported: ComicBook) => void;
}

export const StoryboardJsonViewer: React.FC<StoryboardJsonViewerProps> = ({
  book,
  onImportJson,
}) => {
  const [copiedJson, setCopiedJson] = useState(false);
  const [copiedPrompts, setCopiedPrompts] = useState(false);
  const [importText, setImportText] = useState('');
  const [showImportArea, setShowImportArea] = useState(false);
  const [importError, setImportError] = useState('');

  const jsonString = JSON.stringify(book, null, 2);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonString);
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2000);
  };

  const handleDownloadJson = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comicdocs-${book.book_metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyDiffusionPrompts = () => {
    const styleInfo = ART_STYLES[book.book_metadata.art_style];
    let output = `# PROMPTS DE DIFUSÃO SEQUENCIAIS (FLUX.1 / MIDJOURNEY / SDXL)\n`;
    output += `# Título: ${book.book_metadata.title}\n`;
    output += `# Âncora de Estilo: ${styleInfo?.styleAnchorPrompt || ''}\n\n`;

    book.pages.forEach((page) => {
      output += `## PÁGINA ${page.page_number} (${page.page_summary || ''})\n`;
      page.panels.forEach((p) => {
        output += `Painel ${p.panel_index} [Ângulo: ${p.camera_angle}]:\n`;
        output += `Prompt: "${p.visual_prompt}, ${styleInfo?.styleAnchorPrompt || ''} --ar 1:1"\n`;
        output += `Narração: "${p.narration_box || ''}"\n\n`;
      });
    });

    navigator.clipboard.writeText(output);
    setCopiedPrompts(true);
    setTimeout(() => setCopiedPrompts(false), 2000);
  };

  const handleDoImport = () => {
    setImportError('');
    try {
      const parsed = JSON.parse(importText);
      if (!parsed.book_metadata || !parsed.pages) {
        throw new Error('O JSON precisa conter "book_metadata" e "pages".');
      }
      onImportJson(parsed);
      setShowImportArea(false);
      setImportText('');
    } catch (err: any) {
      setImportError(err?.message || 'JSON inválido.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-6 px-3 sm:px-4 space-y-6">
      {/* Top Banner and Actions */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold uppercase bg-sky-500/10 text-sky-400 border border-sky-500/20">
              Esquema de Dados • JSON Storyboard Engine
            </span>
          </div>
          <h2 className="text-lg font-bold text-white font-display mt-1">
            Storyboard Estruturado & Prompts de Difusão
          </h2>
          <p className="text-xs text-neutral-400">
            Estrutura canônica estrita para orquestração sequencial com LLMs e pipelines de imagem.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyDiffusionPrompts}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition shadow-md"
          >
            {copiedPrompts ? <Check className="w-4 h-4 text-emerald-300" /> : <Sparkles className="w-4 h-4" />}
            <span>{copiedPrompts ? 'Prompts Copiados!' : 'Copiar Prompts Flux/MJ'}</span>
          </button>

          <button
            onClick={handleCopyJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition border border-neutral-700"
          >
            {copiedJson ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copiedJson ? 'Copiado!' : 'Copiar JSON'}</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-medium text-xs transition border border-neutral-700"
          >
            <Download className="w-4 h-4" />
            <span>Baixar .json</span>
          </button>

          <button
            onClick={() => setShowImportArea(!showImportArea)}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-medium text-xs transition"
          >
            <Upload className="w-4 h-4" />
            <span>Importar JSON</span>
          </button>
        </div>
      </div>

      {/* Import Drawer */}
      {showImportArea && (
        <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-2xl p-5 space-y-3">
          <h3 className="text-sm font-bold text-white uppercase font-mono">
            Cole aqui o JSON estruturado do Storyboard:
          </h3>
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            rows={6}
            placeholder='{ "book_metadata": { ... }, "pages": [ ... ] }'
            className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs font-mono text-neutral-200 focus:outline-none focus:border-amber-400"
          />
          {importError && <p className="text-xs text-red-400 font-bold">{importError}</p>}
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setShowImportArea(false)}
              className="px-3 py-1.5 rounded-lg text-neutral-400 text-xs hover:text-white"
            >
              Cancelar
            </button>
            <button
              onClick={handleDoImport}
              className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs"
            >
              Carregar Storyboard
            </button>
          </div>
        </div>
      )}

      {/* JSON Viewer */}
      <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-4 overflow-x-auto shadow-2xl">
        <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
          <code>{jsonString}</code>
        </pre>
      </div>
    </div>
  );
};
