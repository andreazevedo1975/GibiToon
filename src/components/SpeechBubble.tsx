import React from 'react';
import { DialogueBubble, ComicCharacter, PositionAnchor, BubbleType } from '../types/comic';
import { MessageSquare, Cloud, Zap, Edit2, Trash2 } from 'lucide-react';

interface SpeechBubbleProps {
  bubble: DialogueBubble;
  characters: ComicCharacter[];
  isEditable?: boolean;
  onEdit?: (bubble: DialogueBubble) => void;
  onDelete?: () => void;
  onMoveAnchor?: (newAnchor: PositionAnchor) => void;
}

export const SpeechBubble: React.FC<SpeechBubbleProps> = ({
  bubble,
  characters,
  isEditable = false,
  onEdit,
  onDelete,
}) => {
  const char = characters.find((c) => c.id === bubble.character_id) || {
    name: 'Personagem',
    role: 'learner',
    avatar_color: '#3b82f6',
  };

  const isMentor = char.role === 'mentor';

  // Anchor styling positions
  const anchorStyles: Record<PositionAnchor, string> = {
    'top-left': 'top-4 left-4 origin-top-left',
    'top-right': 'top-4 right-4 origin-top-right',
    'bottom-left': 'bottom-6 left-4 origin-bottom-left',
    'bottom-right': 'bottom-6 right-4 origin-bottom-right',
    'bottom-center': 'bottom-6 left-1/2 -translate-x-1/2 origin-bottom',
    'center-left': 'top-1/2 -translate-y-1/2 left-4 origin-left',
    'center-right': 'top-1/2 -translate-y-1/2 right-4 origin-right',
  };

  // Tail positioning
  const tailSide = bubble.position_anchor.includes('left')
    ? 'left'
    : bubble.position_anchor.includes('right')
    ? 'right'
    : 'center';

  return (
    <div
      className={`absolute z-20 max-w-[85%] sm:max-w-[70%] group transition-all duration-150 ${
        anchorStyles[bubble.position_anchor] || 'top-4 left-4'
      }`}
    >
      {/* Action Toolbar on hover in editor mode */}
      {isEditable && (
        <div className="absolute -top-7 left-0 hidden group-hover:flex items-center space-x-1 bg-black/90 text-white rounded-md px-1.5 py-0.5 text-[11px] shadow-lg z-30 border border-white/20">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(bubble);
            }}
            title="Editar texto ou tipo do balão"
            className="hover:text-amber-400 p-0.5"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.();
            }}
            title="Excluir balão"
            className="hover:text-red-400 p-0.5"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Bubble Container according to Type */}
      <div className="relative">
        {/* Character Identifier Badge */}
        <div className="flex items-center space-x-1.5 mb-1 px-1">
          <span
            className="w-2.5 h-2.5 rounded-full ring-1 ring-black/40 inline-block shadow-sm"
            style={{ backgroundColor: char.avatar_color || (isMentor ? '#2563EB' : '#F59E0B') }}
          />
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-900 bg-white/90 backdrop-blur-xs px-1.5 py-0.2 rounded border border-black/40 shadow-xs font-mono">
            {char.name}
          </span>
          {bubble.type === 'thought' && (
            <Cloud className="w-3 h-3 text-neutral-600 inline ml-0.5" />
          )}
          {bubble.type === 'shout' && (
            <Zap className="w-3 h-3 text-amber-600 inline ml-0.5" />
          )}
        </div>

        {/* Bubble Shape */}
        {bubble.type === 'speech' && (
          <div className="relative bg-white text-neutral-950 font-comic font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border-2 border-black shadow-[3px_3px_0px_#000] leading-snug">
            {bubble.text}
            {/* Speech Tail */}
            <div
              className={`absolute -bottom-2 w-0 h-0 border-solid ${
                tailSide === 'left'
                  ? 'left-4 border-t-[8px] border-t-white border-l-[8px] border-l-transparent border-r-[4px] border-r-transparent'
                  : tailSide === 'right'
                  ? 'right-4 border-t-[8px] border-t-white border-r-[8px] border-r-transparent border-l-[4px] border-l-transparent'
                  : 'left-1/2 -translate-x-1/2 border-t-[8px] border-t-white border-x-[6px] border-x-transparent'
              }`}
            />
            {/* Tail border underlay */}
            <div
              className={`absolute -bottom-2.5 w-0 h-0 border-solid -z-10 ${
                tailSide === 'left'
                  ? 'left-3.5 border-t-[10px] border-t-black border-l-[9px] border-l-transparent border-r-[5px] border-r-transparent'
                  : tailSide === 'right'
                  ? 'right-3.5 border-t-[10px] border-t-black border-r-[9px] border-r-transparent border-l-[5px] border-l-transparent'
                  : 'left-1/2 -translate-x-1/2 border-t-[10px] border-t-black border-x-[7px] border-x-transparent'
              }`}
            />
          </div>
        )}

        {bubble.type === 'thought' && (
          <div className="relative bg-sky-50 text-neutral-900 font-comic italic font-semibold text-xs sm:text-sm px-3.5 py-2.5 rounded-3xl border-2 border-sky-950 shadow-[3px_3px_0px_#0369a1] leading-snug">
            {bubble.text}
            {/* Thought cloud bubbles */}
            <div
              className={`absolute -bottom-2 w-2.5 h-2.5 bg-sky-50 rounded-full border border-sky-950 ${
                tailSide === 'left' ? 'left-4' : 'right-4'
              }`}
            />
            <div
              className={`absolute -bottom-4 w-1.5 h-1.5 bg-sky-50 rounded-full border border-sky-950 ${
                tailSide === 'left' ? 'left-6' : 'right-6'
              }`}
            />
          </div>
        )}

        {bubble.type === 'shout' && (
          <div className="relative bg-amber-300 text-neutral-950 font-display text-xs sm:text-sm tracking-wide px-4 py-2.5 border-3 border-black shadow-[4px_4px_0px_#dc2626] leading-tight transform -rotate-1">
            {bubble.text}
            {/* Sharp shout spikes effect */}
            <div className="absolute -bottom-2 left-6 w-0 h-0 border-t-[10px] border-t-amber-300 border-x-[8px] border-x-transparent" />
            <div className="absolute -bottom-3 left-5.5 w-0 h-0 border-t-[12px] border-t-black border-x-[9px] border-x-transparent -z-10" />
          </div>
        )}
      </div>
    </div>
  );
};
