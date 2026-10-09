import React, { useState } from 'react';
import { Copy, Check, Sparkles, Terminal, Download, ArrowRight } from 'lucide-react';

export interface GeneratedApostilaPrompt {
  title: string;
  cover_prompt: string;
  style_anchor: string;
  aspect_ratio_recommendation: string;
  panels_prompts: {
    panel_number: number;
    concept: string;
    camera_angle: string;
    prompt: string;
    negative_space?: string;
  }[];
  midjourney_command: string;
  flux_tags?: string;
  pedagogical_summary?: string;
}

interface PromptViewerCardProps {
  promptData: GeneratedApostilaPrompt;
  onRenderBooklet: () => void;
}

export const PromptViewerCard: React.FC<PromptViewerCardProps> = ({
  promptData,
  onRenderBooklet,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const fullPromptText = `PROMPT COMPLETO DA APOSTILA: ${promptData.title}
ESTILO: ${promptData.style_anchor}
PROMPT DA CAPA:
${promptData.cover_prompt}

PAINÉIS SEQUENCIAIS:
${promptData.panels_prompts
  .map(
    (p) =>
      `Painel ${p.panel_number} (${p.concept}) [${p.camera_angle}]:\n${p.prompt}\nEspaço para balões: ${p.negative_space || 'Livre nos cantos superiores'}`
  )
  .join('\n\n')}

COMANDO MIDJOURNEY:
${promptData.midjourney_command}
TAGS FLUX: ${promptData.flux_tags || ''}`;

  return (
    <div className="w-full bg-[#0D121F] border-2 border-black rounded-2xl p-6 text-neutral-100 shadow-[4px_4px_0px_0px_#000] space-y-6">
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-black/40 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Roteiro Pronto
            </span>
            <span className="text-xs text-amber-200/90 font-comic font-bold">
              Proporção Gibi: {promptData.aspect_ratio_recommendation || '3:4'}
            </span>
          </div>
          <h2 className="text-xl font-cartoon font-extrabold text-amber-400 mt-1">
            {promptData.title}
          </h2>
          <p className="text-xs text-slate-300 font-comic">
            {promptData.pedagogical_summary || 'Roteiro arquitetado para transposição visual de alto impacto.'}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleCopy(fullPromptText, 'all')}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#162035] hover:bg-[#1E2B47] text-amber-300 border-2 border-black font-cartoon font-bold text-xs shadow-[2px_2px_0px_0px_#000] transition cursor-pointer"
          >
            {copiedKey === 'all' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedKey === 'all' ? 'Copiado!' : 'Copiar Tudo'}</span>
          </button>

          <button
            onClick={onRenderBooklet}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
          >
            <span>Ver Gibi Renderizado</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Cover Prompt Card */}
      <div className="bg-[#050A14] border border-[#16233B] rounded-xl p-4 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-cyan-400 font-mono uppercase tracking-wider flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prompt da Capa Principal (Cover Art)</span>
          </span>
          <button
            onClick={() => handleCopy(promptData.cover_prompt, 'cover')}
            className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
          >
            {copiedKey === 'cover' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'cover' ? 'Copiado' : 'Copiar'}</span>
          </button>
        </div>
        <p className="text-xs font-mono text-slate-300 bg-black/50 p-3 rounded-lg border border-[#16233B]/60 leading-relaxed select-all">
          {promptData.cover_prompt}
        </p>
      </div>

      {/* Sequential Panels Prompts */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
          Prompts Sequenciais dos Painéis Didáticos
        </h3>
        <div className="grid grid-cols-1 gap-3">
          {promptData.panels_prompts.map((panel, idx) => (
            <div
              key={idx}
              className="bg-[#050A14] border border-[#16233B] rounded-xl p-4 space-y-2 hover:border-cyan-500/40 transition"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold flex items-center justify-center font-mono">
                    {panel.panel_number}
                  </span>
                  <span className="text-xs font-bold text-white">{panel.concept}</span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-[#101C38] text-slate-400">
                    📐 {panel.camera_angle}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(panel.prompt, `panel_${idx}`)}
                  className="text-xs text-slate-400 hover:text-white flex items-center space-x-1"
                >
                  {copiedKey === `panel_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedKey === `panel_${idx}` ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>

              <p className="text-xs font-mono text-slate-300 bg-black/50 p-2.5 rounded-lg border border-[#16233B]/60 leading-relaxed select-all">
                "{panel.prompt}"
              </p>

              {panel.negative_space && (
                <p className="text-[11px] text-emerald-400 flex items-center space-x-1">
                  <span>🛡️ Espaço reservado para balões:</span>
                  <span className="text-slate-400">{panel.negative_space}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Midjourney & Flux Terminal Box */}
      <div className="bg-[#040710] border border-[#16233B] rounded-xl p-4 space-y-2 font-mono text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <div className="flex items-center space-x-2">
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Comando Pronto para Midjourney v6</span>
          </div>
          <button
            onClick={() => handleCopy(promptData.midjourney_command, 'mj')}
            className="text-cyan-400 hover:underline flex items-center space-x-1"
          >
            {copiedKey === 'mj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedKey === 'mj' ? 'Copiado!' : 'Copiar Comando'}</span>
          </button>
        </div>
        <p className="text-cyan-300 bg-black/60 p-2.5 rounded border border-[#16233B] select-all break-all">
          {promptData.midjourney_command}
        </p>
      </div>
    </div>
  );
};
