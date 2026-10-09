import React, { useState } from 'react';
import { ComicPanel, ComicCharacter, ArtStyle, DialogueBubble, CameraAngle, ColorThemeId } from '../types/comic';
import { COLOR_THEMES } from '../data/colorThemes';
import { PanelIllustration } from './PanelIllustration';
import { SpeechBubble } from './SpeechBubble';
import { VisualPromptAssistant } from './VisualPromptAssistant';
import { RefreshCw, Image as ImageIcon, Plus, Edit3, Check, Wand2 } from 'lucide-react';

interface ComicPanelCardProps {
  panel: ComicPanel;
  characters: ComicCharacter[];
  artStyle: ArtStyle;
  pageNumber: number;
  isEditable?: boolean;
  onUpdatePanel: (updatedPanel: ComicPanel) => void;
  onOpenBubbleEditor: (bubble: DialogueBubble, bubbleIndex: number) => void;
  onAddBubble: () => void;
  topic?: string;
  colorTheme?: ColorThemeId;
}

export const ComicPanelCard: React.FC<ComicPanelCardProps> = ({
  panel,
  characters,
  artStyle,
  pageNumber,
  isEditable = false,
  onUpdatePanel,
  onOpenBubbleEditor,
  onAddBubble,
  topic = '',
  colorTheme = 'default',
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEditingNarration, setIsEditingNarration] = useState(false);
  const [narrationInput, setNarrationInput] = useState(panel.narration_box || '');
  const [isPromptAssistantOpen, setIsPromptAssistantOpen] = useState(false);

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const res = await fetch('/api/regenerate-panel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          art_style: artStyle,
          panel_index: panel.panel_index,
          current_panel: panel,
          characters,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onUpdatePanel({
          ...panel,
          visual_prompt: data.visual_prompt || panel.visual_prompt,
          camera_angle: data.camera_angle || panel.camera_angle,
          narration_box: data.narration_box || panel.narration_box,
          bubbles: data.bubbles || panel.bubbles,
        });
      }
    } catch (err) {
      console.error('Failed to regenerate panel:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleGenerateImage = async () => {
    setIsGeneratingImage(true);
    try {
      const res = await fetch('/api/generate-panel-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: panel.visual_prompt,
          art_style: artStyle,
          aspect_ratio: '1:1',
        }),
      });

      const data = await res.json();
      if (data.success && data.imageUrl) {
        onUpdatePanel({
          ...panel,
          image_url: data.imageUrl,
        });
      }
    } catch (err) {
      console.error('Failed to generate image:', err);
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const handleSaveNarration = () => {
    onUpdatePanel({
      ...panel,
      narration_box: narrationInput,
    });
    setIsEditingNarration(false);
  };

  const handleDeleteBubble = (indexToDelete: number) => {
    const updatedBubbles = panel.bubbles.filter((_, i) => i !== indexToDelete);
    onUpdatePanel({
      ...panel,
      bubbles: updatedBubbles,
    });
  };

  const handleApplyOptimizedPrompt = (optimizedPrompt: string, cameraAngle?: CameraAngle) => {
    onUpdatePanel({
      ...panel,
      visual_prompt: optimizedPrompt,
      camera_angle: cameraAngle || panel.camera_angle,
    });
    setIsPromptAssistantOpen(false);
  };

  return (
    <div className="flex flex-col bg-white text-neutral-900 rounded-xl overflow-hidden border-3 border-black shadow-[5px_5px_0px_#000] relative group">
      {/* Top Narration Box (Comic Didactic Caption) */}
      {panel.narration_box !== undefined && (
        <div className="bg-amber-100 border-b-2 border-black p-2.5 px-3 flex items-start justify-between relative z-20">
          {isEditingNarration ? (
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={narrationInput}
                onChange={(e) => setNarrationInput(e.target.value)}
                className="w-full text-xs font-comic font-bold px-2 py-1 bg-white border border-black rounded"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && handleSaveNarration()}
              />
              <button
                onClick={handleSaveNarration}
                className="p-1 bg-black text-white rounded hover:bg-neutral-800"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p className="text-[11px] sm:text-xs font-comic font-bold tracking-wide text-neutral-900 leading-snug flex-1 uppercase">
              {panel.narration_box}
            </p>
          )}

          {isEditable && !isEditingNarration && (
            <button
              onClick={() => {
                setNarrationInput(panel.narration_box || '');
                setIsEditingNarration(true);
              }}
              className="ml-2 text-neutral-500 hover:text-black opacity-0 group-hover:opacity-100 transition-opacity"
              title="Editar texto da caixa de narração"
            >
              <Edit3 className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* Main Panel Visual & Bubbles Canvas */}
      <div className="relative w-full min-h-[260px] sm:min-h-[300px] flex-1 overflow-hidden">
        {/* Visual Scene or Diffusion Image with CSS Filter Theme */}
        <div
          className="w-full h-full min-h-[260px] sm:min-h-[300px] transition-[filter] duration-300"
          style={{
            filter:
              colorTheme && COLOR_THEMES[colorTheme]
                ? COLOR_THEMES[colorTheme].cssFilter
                : 'none',
          }}
        >
          <PanelIllustration
            prompt={panel.visual_prompt}
            cameraAngle={panel.camera_angle}
            artStyle={artStyle}
            imageUrl={panel.image_url || panel.imageUrl}
            panelIndex={panel.panel_index}
          />
        </div>

        {/* Overlay Speech & Thought Bubbles */}
        {panel.bubbles.map((bubble, bIdx) => (
          <SpeechBubble
            key={bIdx}
            bubble={bubble}
            characters={characters}
            isEditable={isEditable}
            onEdit={(b) => onOpenBubbleEditor(b, bIdx)}
            onDelete={() => handleDeleteBubble(bIdx)}
          />
        ))}

        {/* Panel index badge in corner */}
        <div className="absolute top-2 left-2 z-10 no-print flex items-center space-x-1.5">
          <span className="w-6 h-6 rounded-full bg-black text-white text-[11px] font-display flex items-center justify-center border border-white/40 shadow-sm">
            {panel.panel_index}
          </span>
          {colorTheme && colorTheme !== 'default' && COLOR_THEMES[colorTheme] && (
            <span className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-xs text-white text-[9px] font-mono font-bold tracking-wider uppercase border border-white/30 shadow-xs">
              {COLOR_THEMES[colorTheme].shortLabel}
            </span>
          )}
        </div>
      </div>

      {/* Footer Controls in Editor Mode */}
      {isEditable && (
        <div className="no-print bg-[#0D121F] border-t-2 border-black p-2 px-3 flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-300">
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-[#182238] hover:bg-[#202D4A] text-slate-200 border border-black font-cartoon text-[11px] font-bold transition disabled:opacity-50 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
              title="Gera novas ideias didáticas e diálogos mantendo o contexto"
            >
              <RefreshCw className={`w-3 h-3 ${isRegenerating ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isRegenerating ? 'Regenerando...' : 'Regenerar'}</span>
            </button>

            <button
              onClick={() => setIsPromptAssistantOpen(true)}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 text-indigo-200 border border-black font-cartoon text-[11px] font-bold transition shadow-[1px_1px_0px_0px_#000] cursor-pointer"
              title="Otimizar prompt visual com IA para modelos de difusão"
            >
              <Wand2 className="w-3 h-3 text-indigo-400 stroke-[2.5]" />
              <span>Prompt IA</span>
            </button>

            <button
              onClick={handleGenerateImage}
              disabled={isGeneratingImage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 border border-amber-400/50 font-cartoon text-[11px] font-bold transition disabled:opacity-50 cursor-pointer shadow-[1px_1px_0px_0px_#000]"
              title="Gerar ou atualizar ilustração do painel com Nano Banana diretamente na ferramenta"
            >
              <span className="text-xs">🍌</span>
              <span>{isGeneratingImage ? 'Desenhando...' : 'Arte Nano Banana'}</span>
            </button>
          </div>

          <button
            onClick={onAddBubble}
            className="flex items-center space-x-1 px-3 py-1 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-cartoon font-bold text-xs border border-black shadow-[1.5px_1.5px_0px_0px_#000] transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>+ Balão</span>
          </button>
        </div>
      )}

      {/* Visual Prompt Assistant Modal */}
      {isPromptAssistantOpen && (
        <VisualPromptAssistant
          topic={topic}
          artStyle={artStyle}
          initialPrompt={panel.visual_prompt}
          isModal={true}
          onApplyPrompt={handleApplyOptimizedPrompt}
          onClose={() => setIsPromptAssistantOpen(false)}
        />
      )}
    </div>
  );
};

