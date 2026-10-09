import React, { useState } from 'react';
import { DialogueBubble, ComicCharacter, BubbleType, PositionAnchor } from '../types/comic';
import { MessageSquare, Cloud, Zap, X, Check } from 'lucide-react';

interface BubbleEditorModalProps {
  bubble: DialogueBubble;
  characters: ComicCharacter[];
  onSave: (updated: DialogueBubble) => void;
  onClose: () => void;
}

export const BubbleEditorModal: React.FC<BubbleEditorModalProps> = ({
  bubble,
  characters,
  onSave,
  onClose,
}) => {
  const [characterId, setCharacterId] = useState(bubble.character_id);
  const [type, setType] = useState<BubbleType>(bubble.type);
  const [text, setText] = useState(bubble.text);
  const [positionAnchor, setPositionAnchor] = useState<PositionAnchor>(bubble.position_anchor);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...bubble,
      character_id: characterId,
      type,
      text,
      position_anchor: positionAnchor,
    });
    onClose();
  };

  const anchorOptions: { id: PositionAnchor; label: string }[] = [
    { id: 'top-left', label: 'Canto Superior Esquerdo' },
    { id: 'top-right', label: 'Canto Superior Direito' },
    { id: 'bottom-left', label: 'Canto Inferior Esquerdo' },
    { id: 'bottom-right', label: 'Canto Inferior Direito' },
    { id: 'bottom-center', label: 'Centro Inferior' },
    { id: 'center-left', label: 'Centro Esquerda' },
    { id: 'center-right', label: 'Centro Direita' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl w-full max-w-md p-6 text-neutral-100 shadow-[6px_6px_0px_0px_#000] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-amber-400 text-neutral-950 p-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-amber-300 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <h3 className="text-lg font-bold font-display text-amber-400 mb-4 tracking-wide">
          EDITAR BALÃO DIDÁTICO
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Character selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Quem está falando?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {characters.map((char) => (
                <button
                  type="button"
                  key={char.id}
                  onClick={() => setCharacterId(char.id)}
                  className={`flex items-center space-x-2 p-2.5 rounded-xl border text-left transition ${
                    characterId === char.id
                      ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                      : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                  }`}
                >
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: char.avatar_color || '#3b82f6' }}
                  />
                  <div className="truncate">
                    <p className="text-xs truncate">{char.name}</p>
                    <span className="text-[10px] text-neutral-500 uppercase">{char.role}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bubble Type */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Tipo de Balão
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('speech')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                  type === 'speech'
                    ? 'border-white bg-white/10 text-white font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                }`}
              >
                <MessageSquare className="w-4 h-4 mb-1 text-white" />
                <span className="text-xs">Fala Comum</span>
              </button>
              <button
                type="button"
                onClick={() => setType('thought')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                  type === 'thought'
                    ? 'border-sky-400 bg-sky-500/10 text-sky-300 font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                }`}
              >
                <Cloud className="w-4 h-4 mb-1 text-sky-400" />
                <span className="text-xs">Pensamento</span>
              </button>
              <button
                type="button"
                onClick={() => setType('shout')}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition ${
                  type === 'shout'
                    ? 'border-amber-400 bg-amber-500/10 text-amber-300 font-bold'
                    : 'border-neutral-800 bg-neutral-950 text-neutral-400'
                }`}
              >
                <Zap className="w-4 h-4 mb-1 text-amber-400" />
                <span className="text-xs">Grito / Impacto</span>
              </button>
            </div>
          </div>

          {/* Text Input */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Fala / Diálogo Pedagógico
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              required
              placeholder="Digite a fala concisa do personagem..."
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-sm font-comic text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          {/* Position Anchor */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-400 mb-1.5">
              Posição no Painel
            </label>
            <select
              value={positionAnchor}
              onChange={(e) => setPositionAnchor(e.target.value as PositionAnchor)}
              className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
            >
              {anchorOptions.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit */}
          <div className="pt-2 flex items-center justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Salvar Balão</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
