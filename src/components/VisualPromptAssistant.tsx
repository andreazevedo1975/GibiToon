import React, { useState } from 'react';
import { ArtStyle, CameraAngle, VisualPromptSuggestion } from '../types/comic';
import { ART_STYLES } from '../data/styles';
import {
  Sparkles,
  Copy,
  Check,
  Wand2,
  Camera,
  Layers,
  ArrowRight,
  Info,
  X,
  RefreshCw,
  Lightbulb,
} from 'lucide-react';

interface VisualPromptAssistantProps {
  topic: string;
  artStyle: ArtStyle;
  onApplyPrompt?: (prompt: string, cameraAngle?: CameraAngle) => void;
  initialPrompt?: string;
  isModal?: boolean;
  onClose?: () => void;
}

export const VisualPromptAssistant: React.FC<VisualPromptAssistantProps> = ({
  topic,
  artStyle,
  onApplyPrompt,
  initialPrompt = '',
  isModal = false,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'suggest' | 'optimize'>(
    initialPrompt ? 'optimize' : 'suggest'
  );

  // Suggestion State
  const [suggestions, setSuggestions] = useState<VisualPromptSuggestion[]>([]);
  const [customIdea, setCustomIdea] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [suggestError, setSuggestError] = useState('');

  // Optimization State
  const [promptToOptimize, setPromptToOptimize] = useState(initialPrompt);
  const [optimizedResult, setOptimizedResult] = useState<{
    optimized_prompt: string;
    style_anchor_prompt: string;
    recommended_camera: CameraAngle;
    negative_space_tip: string;
    improvements_summary: string;
  } | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizeError, setOptimizeError] = useState('');

  // Copy status
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [copiedOptimized, setCopiedOptimized] = useState(false);

  const styleInfo = ART_STYLES[artStyle] || ART_STYLES.clean_vector_bd;

  const handleFetchSuggestions = async () => {
    if (!topic.trim()) {
      setSuggestError('Defina um tema antes de buscar sugestões visuais.');
      return;
    }
    setSuggestError('');
    setIsSuggesting(true);

    try {
      const res = await fetch('/api/suggest-visual-prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          art_style: artStyle,
          custom_idea: customIdea,
          count: 3,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao obter sugestões do modelo.');
      }

      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err: any) {
      console.error(err);
      setSuggestError(err?.message || 'Falha ao sugerir prompts.');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleOptimizePrompt = async () => {
    if (!promptToOptimize.trim()) {
      setOptimizeError('Digite ou cole a descrição visual que deseja otimizar.');
      return;
    }
    setOptimizeError('');
    setIsOptimizing(true);

    try {
      const res = await fetch('/api/optimize-visual-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_prompt: promptToOptimize,
          topic,
          art_style: artStyle,
        }),
      });

      if (!res.ok) {
        throw new Error('Erro ao otimizar o prompt.');
      }

      const data = await res.json();
      setOptimizedResult(data);
    } catch (err: any) {
      console.error(err);
      setOptimizeError(err?.message || 'Falha ao otimizar o prompt.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCopy = (text: string, idx?: number) => {
    navigator.clipboard.writeText(text);
    if (idx !== undefined) {
      setCopiedIdx(idx);
      setTimeout(() => setCopiedIdx(null), 2000);
    } else {
      setCopiedOptimized(true);
      setTimeout(() => setCopiedOptimized(false), 2000);
    }
  };

  const content = (
    <div className="space-y-5 text-neutral-200">
      {/* Header Info */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-purple-500/10 text-purple-400 border border-purple-500/30">
              Serviço de IA • Prompt Crafting para Difusão
            </span>
            <span className="text-xs text-neutral-400 font-mono">
              Estilo: <strong className="text-white">{styleInfo.name}</strong>
            </span>
          </div>
          <h3 className="text-lg font-bold font-display text-white mt-1">
            ENGENHARIA DE PROMPTS VISUAIS (FLUX / MIDJOURNEY / SDXL)
          </h3>
          <p className="text-xs text-neutral-400">
            Gera descrições visuais fotoquímicas e cinematográficas, adaptadas à consistência artística e com espaço reservado para balões de fala.
          </p>
        </div>

        {isModal && onClose && (
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Mode Tabs */}
      <div className="flex space-x-2 border-b border-neutral-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveTab('suggest')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'suggest'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Sugerir Metáforas & Cenas</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('optimize')}
          className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition ${
            activeTab === 'optimize'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-neutral-400 hover:text-white bg-neutral-900 border border-neutral-800'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Otimizar Prompt Específico</span>
        </button>
      </div>

      {/* TAB 1: SUGGEST VISUAL PROMPTS */}
      {activeTab === 'suggest' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="Opcional: Direcione uma ideia (ex: analogia do trânsito, corte transversal, visão microscópica...)"
              className="flex-1 bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400"
            />
            <button
              type="button"
              onClick={handleFetchSuggestions}
              disabled={isSuggesting}
              className="flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition disabled:opacity-50 shrink-0 shadow-md"
            >
              <Sparkles className={`w-3.5 h-3.5 ${isSuggesting ? 'animate-spin' : ''}`} />
              <span>{isSuggesting ? 'Gerando Ideias...' : 'Sugerir com IA'}</span>
            </button>
          </div>

          {suggestError && (
            <p className="text-xs text-red-400 font-bold">{suggestError}</p>
          )}

          {/* Suggestions List */}
          <div className="space-y-3">
            {suggestions.map((item, idx) => (
              <div
                key={idx}
                className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-2.5 hover:border-purple-500/40 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-display text-sm text-purple-300 font-bold tracking-wide">
                        {item.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-neutral-800 text-neutral-300 border border-neutral-700">
                        📐 {item.camera_angle}
                      </span>
                    </div>
                    <p className="text-[11px] text-amber-300 font-mono mt-0.5">
                      💡 Conceito: {item.pedagogical_concept}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopy(`${item.visual_prompt}, ${item.style_anchor_prompt}`, idx)}
                      className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-700 text-xs transition"
                      title="Copiar prompt completo para Midjourney/Flux"
                    >
                      {copiedIdx === idx ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {onApplyPrompt && (
                      <button
                        type="button"
                        onClick={() => onApplyPrompt(item.visual_prompt, item.camera_angle)}
                        className="px-2.5 py-1 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white border border-purple-500/40 text-xs font-bold transition flex items-center space-x-1"
                      >
                        <span>Aplicar</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Prompt block */}
                <div className="bg-black/60 rounded-lg p-2.5 border border-neutral-900 font-mono text-[11px] text-neutral-300 leading-relaxed select-all">
                  "{item.visual_prompt}"
                </div>

                {/* Meta details: negative space & style tags */}
                <div className="flex flex-wrap items-center justify-between text-[10px] text-neutral-400 gap-2 pt-1 border-t border-neutral-900">
                  <span className="text-emerald-400">
                    🎯 {item.negative_space_tip}
                  </span>
                  <span className="font-mono text-neutral-500 truncate max-w-xs">
                    Tags: {item.style_anchor_prompt}
                  </span>
                </div>
              </div>
            ))}

            {suggestions.length === 0 && !isSuggesting && (
              <div className="text-center py-6 border border-dashed border-neutral-800 rounded-xl p-4 text-xs text-neutral-500">
                <Lightbulb className="w-6 h-6 mx-auto mb-2 text-neutral-600" />
                <p>Clique em <strong>"Sugerir com IA"</strong> para que o modelo crie metáforas visuais concebidas para difusão.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: OPTIMIZE EXISTING PROMPT */}
      {activeTab === 'optimize' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-1.5">
              Descrição Visual Atual / Ideia Bruta:
            </label>
            <textarea
              value={promptToOptimize}
              onChange={(e) => setPromptToOptimize(e.target.value)}
              rows={3}
              placeholder="Ex: Dr. Byte mostra um mapa de computadores conectados com cabos azuis..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-purple-400 font-mono"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[11px] text-neutral-500 font-mono">
              O modelo injetará volumetria, iluminação, composição e âncoras do estilo {styleInfo.name}.
            </span>
            <button
              type="button"
              onClick={handleOptimizePrompt}
              disabled={isOptimizing}
              className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition disabled:opacity-50 shadow-md"
            >
              <Wand2 className={`w-3.5 h-3.5 ${isOptimizing ? 'animate-spin' : ''}`} />
              <span>{isOptimizing ? 'Otimizando...' : 'Otimizar para Difusão'}</span>
            </button>
          </div>

          {optimizeError && (
            <p className="text-xs text-red-400 font-bold">{optimizeError}</p>
          )}

          {/* Optimized Output Card */}
          {optimizedResult && (
            <div className="bg-neutral-950 border-2 border-purple-500/40 rounded-xl p-4 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    Prompt Otimizado para Flux/MJ
                  </span>
                  <span className="text-xs font-mono text-purple-300">
                    📐 {optimizedResult.recommended_camera}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleCopy(
                        `${optimizedResult.optimized_prompt}, ${optimizedResult.style_anchor_prompt}`
                      )
                    }
                    className="flex items-center space-x-1 px-2.5 py-1 rounded bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs font-medium"
                  >
                    {copiedOptimized ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedOptimized ? 'Copiado!' : 'Copiar'}</span>
                  </button>

                  {onApplyPrompt && (
                    <button
                      type="button"
                      onClick={() =>
                        onApplyPrompt(
                          optimizedResult.optimized_prompt,
                          optimizedResult.recommended_camera
                        )
                      }
                      className="px-3 py-1 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition flex items-center space-x-1 shadow-xs"
                    >
                      <span>Aplicar ao Painel</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Enhanced Prompt */}
              <div className="bg-black/70 p-3 rounded-lg border border-neutral-800 font-mono text-xs text-purple-200 leading-relaxed select-all">
                "{optimizedResult.optimized_prompt}"
              </div>

              {/* Improvements note & Negative space */}
              <div className="space-y-1 text-xs">
                <p className="text-amber-300 text-[11px]">
                  ✨ <strong>Melhorias aplicadas:</strong> {optimizedResult.improvements_summary}
                </p>
                <p className="text-emerald-400 text-[11px]">
                  🛡️ <strong>Espaço para balões:</strong> {optimizedResult.negative_space_tip}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
        <div className="bg-neutral-900 border-2 border-neutral-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 text-neutral-100 shadow-2xl">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-900/90 border border-neutral-800 rounded-2xl p-5 shadow-xl">
      {content}
    </div>
  );
};
