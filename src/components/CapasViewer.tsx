import React, { useState } from 'react';
import { Sparkles, Copy, Check, Download, Wand2, ArrowRight } from 'lucide-react';
import { ART_STYLES } from '../data/styles';
import { ArtStyle } from '../types/comic';

interface CapasViewerProps {
  title: string;
  topic: string;
  mentor: string;
  learner: string;
  currentStyle: ArtStyle;
  onApplyStyle: (style: ArtStyle) => void;
  onGoToBooklet: () => void;
}

export const CapasViewer: React.FC<CapasViewerProps> = ({
  title,
  topic,
  mentor,
  learner,
  currentStyle,
  onApplyStyle,
  onGoToBooklet,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(currentStyle);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const styleKeys = Object.keys(ART_STYLES) as ArtStyle[];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Galeria de Capas de Gibis
            </span>
            <span className="text-xs text-amber-200/90 font-comic font-bold">
              Formato A4 (3:4) & Webtoon (9:16)
            </span>
          </div>
          <h1 className="text-2xl font-cartoon font-extrabold text-amber-400 tracking-wide">
            Capas Ilustradas: {title || topic}
          </h1>
          <p className="text-xs text-slate-300 font-comic mt-1">
            Escolha uma capa impactante com prompts otimizados para Midjourney v6, Flux.1 Dev e SDXL.
          </p>
        </div>

        <button
          onClick={onGoToBooklet}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
        >
          <span>Abrir Leitor do Gibi</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </button>
      </div>

      {/* Grid of Styles / Covers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {styleKeys.map((key) => {
          const style = ART_STYLES[key];
          const isSelected = selectedStyle === key;
          const coverPrompt = `${key} style, heroic front cover art for educational graphic novel booklet about ${topic}. ${mentor} and ${learner} at center in an expansive conceptual setting with glowing volumetric diagrams, vivid atmospheric lighting, dynamic composition, clean typography-ready negative space at top, no embedded text, masterpiece --ar 3:4`;
          const mjCommand = `/imagine prompt: ${coverPrompt} --v 6.0`;

          return (
            <div
              key={key}
              className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#0E1A35] border-cyan-400 shadow-xl shadow-cyan-950/40'
                  : 'bg-[#080D1A] border-[#16233B] hover:border-[#22365C]'
              }`}
            >
              <div className="space-y-3">
                {/* Header & Badges */}
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#142140] text-cyan-300 border border-cyan-500/20">
                    {style.tag}
                  </span>
                  {isSelected && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500 text-neutral-950">
                      Estilo Ativo
                    </span>
                  )}
                </div>

                {/* Simulated Graphic Novel Cover Art Banner */}
                <div className="w-full h-44 rounded-xl relative overflow-hidden bg-gradient-to-br from-slate-900 via-[#0A1224] to-black border border-[#1E2E4E] flex flex-col justify-between p-3.5 select-none">
                  {/* Decorative background gradients */}
                  <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_40%,rgba(6,182,212,0.4),transparent_70%)]" />

                  {/* Title banner */}
                  <div className="relative z-10 text-center">
                    <span className="inline-block px-2 py-0.5 rounded bg-black/60 border border-white/20 text-[9px] font-mono tracking-widest text-cyan-300 uppercase">
                      COMICDOCS APOSTILA
                    </span>
                    <h3 className="text-sm font-black text-white font-sans mt-1 line-clamp-2 drop-shadow-md">
                      {title || topic}
                    </h3>
                  </div>

                  {/* Character icons & concept preview */}
                  <div className="relative z-10 flex items-center justify-between px-2 pt-2">
                    <div className="flex items-center space-x-1.5">
                      <div className="w-7 h-7 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-xs font-bold text-cyan-300">
                        {mentor.slice(0, 1)}
                      </div>
                      <span className="text-[10px] font-bold text-slate-300">{mentor}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-[10px] font-bold text-slate-300">{learner}</span>
                      <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xs font-bold text-amber-300">
                        {learner.slice(0, 1)}
                      </div>
                    </div>
                  </div>

                  {/* Bottom tagline */}
                  <div className="relative z-10 flex items-center justify-between text-[9px] text-slate-400 border-t border-white/10 pt-1.5">
                    <span className="truncate max-w-[140px]">{style.name}</span>
                    <span className="font-mono text-cyan-400">Edição Didática</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 line-clamp-2">
                  {style.description}
                </p>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-[#16233B] space-y-2 mt-4">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => {
                      setSelectedStyle(key);
                      onApplyStyle(key);
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition text-center ${
                      isSelected
                        ? 'bg-cyan-500 text-neutral-950 font-black'
                        : 'bg-[#121E38] hover:bg-[#1A2C52] text-slate-200'
                    }`}
                  >
                    {isSelected ? 'Estilo Selecionado' : 'Usar este Estilo'}
                  </button>

                  <button
                    onClick={() => handleCopy(mjCommand, key)}
                    title="Copiar comando Midjourney da Capa"
                    className="p-2 rounded-xl bg-[#101C36] hover:bg-[#182B50] text-cyan-400 border border-cyan-500/20 transition"
                  >
                    {copiedKey === key ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
