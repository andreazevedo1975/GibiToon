import React, { useState } from 'react';
import { Sparkles, ChevronDown, ChevronUp, BookOpen, Wand2, Rocket, Palette, Sliders, Check } from 'lucide-react';
import { ArtStyle, TargetAudience, ComicCharacter, ColorThemeId } from '../types/comic';
import { ART_STYLES, CHARACTER_ARCHETYPES } from '../data/styles';
import { COLOR_THEMES, COLOR_THEME_LIST } from '../data/colorThemes';

export interface ApostilaFormData {
  disciplina: string;
  assunto: string;
  publico: string;
  objetivo: string;
  nivel: 'Introdutório' | 'Intermediário' | 'Avançado' | 'Concursos / Especialista';
  tipoMaterial: string;
  formato: 'Formato A4' | 'Formato Webtoon (Vertical)' | 'Formato E-book / Slide';
  paginas: number;
  tom: 'socratic' | 'humorous' | 'formal' | 'enthusiastic';
  estiloEscrita?: string;
  paletaVisual?: string;
  colorTheme?: ColorThemeId;
  artStyle: ArtStyle;
  mentor: ComicCharacter;
  learner: ComicCharacter;
  incluirAtividades: boolean;
}

interface ApostilaConfigFormProps {
  formData: ApostilaFormData;
  onChange: (updated: Partial<ApostilaFormData>) => void;
  onGeneratePrompt: () => void;
  onGenerateFullBooklet: () => void;
  onOpenHelp: (type: 'nivel' | 'formato') => void;
  onOpenSingleImage?: () => void;
  isLoadingPrompt: boolean;
  isLoadingFull: boolean;
}

export const ApostilaConfigForm: React.FC<ApostilaConfigFormProps> = ({
  formData,
  onChange,
  onGeneratePrompt,
  onGenerateFullBooklet,
  onOpenHelp,
  onOpenSingleImage,
  isLoadingPrompt,
  isLoadingFull,
}) => {
  const [openPedagogica, setOpenPedagogica] = useState(false);
  const [openVisual, setOpenVisual] = useState(true);
  const [styleTab, setStyleTab] = useState<'referencia' | 'manga_hqs'>('referencia');

  const referenceStyles: ArtStyle[] = [
    'cartoon',
    'hand_drawn',
    'doodle',
    'cartoon_educacional',
    'scientific_illustration',
    'futuristic_digital',
    'infografico_moderno',
    'minimalista',
    'three_d_educacional',
    'realista',
    'livro_didatico',
    'colorido_infantil',
  ];

  const mangaHqStyles: ArtStyle[] = [
    'modern_manga',
    'anime_cinematic',
    'cartoon_retro',
    'chibi_kawaii',
    'vintage_comic',
    'clean_vector_bd',
    'watercolor_graphic_novel',
    'pixel_art',
    'cyberpunk_noir',
  ];

  const samplePresets = [
    {
      disciplina: 'Biologia',
      assunto: 'Genética e Hereditariedade Mendeliana',
      publico: 'Ensino Médio (15 a 17 anos)',
      objetivo: 'Ensinar os fundamentos de genética de maneira visual, simples e progressiva, explicando alelos, dominância e quadros de Punnett.',
      nivel: 'Intermediário' as const,
      tipoMaterial: 'Apostila em quadrinhos (Graphic Novel)',
      formato: 'Formato A4' as const,
      artStyle: 'clean_vector_bd' as ArtStyle,
      paginas: 3,
    },
    {
      disciplina: 'Física / Astronomia',
      assunto: 'Buracos Negros e o Espaço-Tempo',
      publico: 'Ensino Médio (15 a 17 anos)',
      objetivo: 'Desmistificar a relatividade geral, o horizonte de eventos e a curvatura do espaço-tempo com metáforas cósmicas.',
      nivel: 'Intermediário' as const,
      tipoMaterial: 'Apostila didática',
      formato: 'Formato A4' as const,
      artStyle: 'anime_cinematic' as ArtStyle,
      paginas: 3,
    },
    {
      disciplina: 'Ciências / Saúde',
      assunto: 'O Sistema Imunológico em Ação',
      publico: 'Ensino Fundamental II (11 a 14 anos)',
      objetivo: 'Mostrar como os glóbulos brancos, anticorpos e linfócitos protegem o corpo contra vírus e bactérias.',
      nivel: 'Introdutório' as const,
      tipoMaterial: 'Apostila em quadrinhos (Graphic Novel)',
      formato: 'Formato Webtoon (Vertical)' as const,
      artStyle: 'cartoon_retro' as ArtStyle,
      paginas: 3,
    },
  ];

  const handleApplyExample = () => {
    const randomPreset = samplePresets[Math.floor(Math.random() * samplePresets.length)];
    onChange(randomPreset);
  };

  return (
    <div className="w-full max-w-[480px] lg:max-w-[490px] bg-[#0D121F] border-2 border-black rounded-2xl p-5 sm:p-6 text-white shadow-[4px_4px_0px_0px_#000000] flex flex-col justify-between shrink-0">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-3 border-b-2 border-black/40">
          <div>
            <div className="flex items-center space-x-1.5 mb-0.5">
              <span className="text-base">🎨</span>
              <h2 className="text-lg font-cartoon font-extrabold text-amber-400 tracking-wide">
                Estúdio de Criação
              </h2>
            </div>
            <p className="text-xs text-slate-300 font-comic">
              Configure o roteiro pedagógico e o estilo do seu gibi.
            </p>
          </div>
          <button
            type="button"
            onClick={handleApplyExample}
            className="flex items-center space-x-1 text-xs font-cartoon font-bold bg-amber-400 text-neutral-950 py-1 px-2.5 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-amber-300 transition cursor-pointer"
            title="Preencher com um exemplo didático em 1 clique"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-950 stroke-[2.5]" />
            <span>Exemplo</span>
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-3.5 text-xs">
          {/* Disciplina */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Disciplina
            </label>
            <input
              type="text"
              value={formData.disciplina}
              onChange={(e) => onChange({ disciplina: e.target.value })}
              placeholder="Ex: Matemática, Português, Biologia, História..."
              className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Assunto principal * */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Assunto principal <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.assunto}
              onChange={(e) => onChange({ assunto: e.target.value })}
              placeholder="Ex: Genética, Frações, Revolução Francesa..."
              className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
            />
          </div>

          {/* Público / faixa etária * */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Público / faixa etária <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <select
                value={formData.publico}
                onChange={(e) => onChange({ publico: e.target.value })}
                className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none pr-9 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="">Selecione a faixa etária</option>
                <option value="Educação Infantil (3 a 5 anos)">Educação Infantil (3 a 5 anos)</option>
                <option value="Ensino Fundamental I (6 a 10 anos)">Ensino Fundamental I (6 a 10 anos)</option>
                <option value="Ensino Fundamental II (11 a 14 anos)">Ensino Fundamental II (11 a 14 anos)</option>
                <option value="Ensino Médio (15 a 17 anos)">Ensino Médio (15 a 17 anos)</option>
                <option value="Ensino Superior / Graduação">Ensino Superior / Graduação</option>
                <option value="Concursos Públicos / Vestibulares">Concursos Públicos / Vestibulares</option>
                <option value="Profissional / Adulto">Profissional / Adulto</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Objetivo da apostila */}
          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              Objetivo da apostila
            </label>
            <textarea
              rows={2}
              value={formData.objetivo}
              onChange={(e) => onChange({ objetivo: e.target.value })}
              placeholder="Ex: Ensinar os fundamentos de genética de maneira visual, simples e progressiva."
              className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition resize-none"
            />
          </div>

          {/* Nível de profundidade Row */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-slate-300 font-semibold">
                Nível de profundidade
              </label>
              <button
                type="button"
                onClick={() => onOpenHelp('nivel')}
                className="text-[11px] text-slate-400 hover:text-cyan-400 underline transition"
              >
                o que é?
              </button>
            </div>
            <div className="relative">
              <select
                value={formData.nivel}
                onChange={(e) => onChange({ nivel: e.target.value as any })}
                className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none pr-9 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
              >
                <option value="Introdutório">Introdutório</option>
                <option value="Intermediário">Intermediário</option>
                <option value="Avançado">Avançado</option>
                <option value="Concursos / Especialista">Concursos / Especialista</option>
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Tipo de material & Formato Row */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Tipo de material
              </label>
              <div className="relative">
                <select
                  value={formData.tipoMaterial}
                  onChange={(e) => onChange({ tipoMaterial: e.target.value })}
                  className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-white appearance-none pr-8 focus:outline-none focus:border-cyan-500 transition cursor-pointer truncate"
                >
                  <option value="Apostila didática">Apostila didática</option>
                  <option value="Apostila em quadrinhos (Graphic Novel)">Apostila em HQ</option>
                  <option value="Guia prático / Resumo visual">Guia prático visual</option>
                  <option value="Caderno com exercícios">Caderno de atividades</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-slate-300 font-semibold truncate">
                  Formato da apostila
                </label>
                <button
                  type="button"
                  onClick={() => onOpenHelp('formato')}
                  className="text-[10px] text-slate-400 hover:text-cyan-400 underline transition shrink-0 ml-1"
                >
                  o que é?
                </button>
              </div>
              <div className="relative">
                <select
                  value={formData.formato}
                  onChange={(e) => onChange({ formato: e.target.value as any })}
                  className="w-full bg-[#060B14] border border-[#1E293B] rounded-xl px-3 py-2.5 text-xs text-white appearance-none pr-8 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                >
                  <option value="Formato A4">Formato A4</option>
                  <option value="Formato Webtoon (Vertical)">Formato Webtoon</option>
                  <option value="Formato E-book / Slide">E-book (16:9)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Accordion 1: Configuração Pedagógica */}
          <div className="border border-[#1E293B] rounded-xl overflow-hidden bg-[#070D18]">
            <button
              type="button"
              onClick={() => setOpenPedagogica(!openPedagogica)}
              className="w-full flex items-center justify-between px-3.5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition text-left"
            >
              <span>Configuração pedagógica</span>
              {openPedagogica ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openPedagogica && (
              <div className="p-3.5 border-t border-[#1E293B] space-y-3 bg-[#050A14]">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Número de Páginas / Capítulos
                  </label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {[1, 2, 3, 4].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => onChange({ paginas: num })}
                        className={`py-1.5 rounded-lg text-xs font-bold transition ${
                          formData.paginas === num
                            ? 'bg-cyan-500 text-neutral-950 font-black'
                            : 'bg-[#0A1222] text-slate-400 border border-[#16233B] hover:text-white'
                        }`}
                      >
                        {num} pág{num > 1 ? 's' : ''}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">
                    Tom Didático
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'socratic' as const, label: 'Socrático (Perguntas)' },
                      { id: 'humorous' as const, label: 'Bem-humorado' },
                      { id: 'enthusiastic' as const, label: 'Entusiasta' },
                      { id: 'formal' as const, label: 'Formal / Acadêmico' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => onChange({ tom: t.id })}
                        className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition text-left truncate ${
                          formData.tom === t.id
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                            : 'bg-[#0A1222] text-slate-400 border border-[#16233B] hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center space-x-2 pt-1">
                  <input
                    type="checkbox"
                    id="chkAtividades"
                    checked={formData.incluirAtividades}
                    onChange={(e) => onChange({ incluirAtividades: e.target.checked })}
                    className="w-4 h-4 rounded border-[#1E293B] bg-[#0A1222] text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <label htmlFor="chkAtividades" className="text-xs text-slate-300 cursor-pointer select-none">
                    Gerar Atividades e Exercícios de Fixação com Gabarito
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Accordion 2: Estilo e Identidade Visual (Conforme a imagem de referência) */}
          <div className="border border-[#1E293B] rounded-xl overflow-hidden bg-[#070D18]">
            <button
              type="button"
              onClick={() => setOpenVisual(!openVisual)}
              className="w-full flex items-center justify-between px-3.5 py-3 text-xs font-bold text-white hover:text-cyan-300 transition text-left"
            >
              <span className="font-sans text-sm">Estilo e identidade visual</span>
              {openVisual ? (
                <ChevronUp className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {openVisual && (
              <div className="p-4 border-t border-[#1E293B] space-y-4 bg-[#050A14]">
                {/* 1. Estilo de escrita */}
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs font-sans">
                    Estilo de escrita
                  </label>
                  <div className="relative">
                    <select
                      value={formData.estiloEscrita || 'Didático'}
                      onChange={(e) => onChange({ estiloEscrita: e.target.value })}
                      className="w-full bg-[#080E1C] border border-[#182642] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none pr-9 focus:outline-none focus:border-white transition cursor-pointer font-medium"
                    >
                      <option value="Didático">Didático</option>
                      <option value="Descontraído">Descontraído</option>
                      <option value="Acadêmico / Formal">Acadêmico / Formal</option>
                      <option value="Socrático">Socrático (Perguntas & Respostas)</option>
                      <option value="Narrativo / Storytelling">Narrativo / Storytelling</option>
                      <option value="Infantil / Lúdico">Infantil / Lúdico</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 2. Estilo visual */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-slate-200 font-bold text-xs font-sans">
                      Estilo visual
                    </label>
                    {/* Style Category Selector */}
                    <div className="flex items-center space-x-1 bg-[#080E1C] p-0.5 rounded-lg border border-[#182642]">
                      <button
                        type="button"
                        onClick={() => setStyleTab('referencia')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          styleTab === 'referencia'
                            ? 'bg-white text-neutral-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Didáticos ({referenceStyles.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => setStyleTab('manga_hqs')}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition ${
                          styleTab === 'manga_hqs'
                            ? 'bg-white text-neutral-950 shadow-xs'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        Mangá & HQs ({mangaHqStyles.length})
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Grid matching user's reference image */}
                  <div className="grid grid-cols-2 gap-2 max-h-[340px] overflow-y-auto pr-1">
                    {(styleTab === 'referencia' ? referenceStyles : mangaHqStyles).map((styleKey) => {
                      const style = ART_STYLES[styleKey];
                      const isSelected = formData.artStyle === styleKey;

                      return (
                        <button
                          key={styleKey}
                          type="button"
                          onClick={() => onChange({ artStyle: styleKey })}
                          className={`p-3 rounded-2xl text-left transition border ${
                            isSelected
                              ? 'bg-[#0B152A] border-white ring-1 ring-white/90 shadow-md'
                              : 'bg-[#080E1C] border-[#182642] hover:border-[#283E6B] hover:bg-[#0B1426]'
                          }`}
                        >
                          <p className="text-xs sm:text-[13px] font-bold text-white tracking-tight leading-snug">
                            {style.name}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 leading-snug">
                            {style.subtitle || style.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Paleta visual */}
                <div>
                  <label className="block text-slate-200 font-bold mb-1.5 text-xs font-sans">
                    Paleta visual
                  </label>
                  <div className="relative">
                    <select
                      value={formData.paletaVisual || 'Automática'}
                      onChange={(e) => onChange({ paletaVisual: e.target.value })}
                      className="w-full bg-[#080E1C] border border-[#182642] rounded-xl px-3.5 py-2.5 text-xs text-white appearance-none pr-9 focus:outline-none focus:border-white transition cursor-pointer font-medium"
                    >
                      <option value="Automática">Automática</option>
                      <option value="Tons Pastel">Tons Pastel</option>
                      <option value="Vibrante / Colorida">Vibrante / Colorida</option>
                      <option value="Monocromática (P&B)">Monocromática (P&B)</option>
                      <option value="Tecnológica (Ciano & Azul)">Tecnológica (Ciano & Azul)</option>
                      <option value="Editorial Clássica">Editorial Clássica</option>
                      <option value="Natureza / Terra">Natureza / Terra</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* 4. Temas de Cores & Filtros CSS Automáticos (User Request) */}
                <div className="space-y-2 pt-2 border-t border-[#182642]">
                  <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-1.5 text-slate-200 font-bold text-xs font-sans">
                      <Palette className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Temas de Cores (Filtros CSS dos Painéis)</span>
                    </label>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/50">
                      Auto em todos os painéis
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-snug">
                    Aplica filtros CSS visuais automaticamente a todas as ilustrações e quadrinhos da apostila gerada.
                  </p>

                  {/* Grid de Seleção dos Temas de Cores */}
                  <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {COLOR_THEME_LIST.map((theme) => {
                      const isCurrentSelected = (formData.colorTheme || 'default') === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => onChange({ colorTheme: theme.id })}
                          className={`p-2.5 rounded-xl text-left transition border relative group cursor-pointer ${
                            isCurrentSelected
                              ? 'bg-[#0E1A33] border-cyan-400 ring-1 ring-cyan-400/80 shadow-md'
                              : 'bg-[#080E1C] border-[#182642] hover:border-[#283E6B] hover:bg-[#0B1426]'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            {/* Swatch dots */}
                            <div className="flex items-center space-x-1">
                              {theme.swatchColors.map((color, idx) => (
                                <span
                                  key={idx}
                                  className="w-2.5 h-2.5 rounded-full border border-black/40 shadow-xs"
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>

                            {isCurrentSelected && (
                              <span className="w-4 h-4 rounded-full bg-cyan-400 text-neutral-950 flex items-center justify-center text-[10px] font-black">
                                <Check className="w-2.5 h-2.5" />
                              </span>
                            )}
                          </div>

                          <p className="text-xs font-bold text-white tracking-tight truncate">
                            {theme.shortLabel}
                          </p>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {theme.tag}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Mini Preview Box com o filtro CSS ativo aplicado */}
                  {(() => {
                    const activeTheme = COLOR_THEMES[formData.colorTheme || 'default'] || COLOR_THEMES.default;
                    return (
                      <div className="mt-2 p-2.5 rounded-xl bg-[#080E1C] border border-[#182642] flex items-center space-x-3">
                        {/* Sample Mini Canvas with CSS filter applied */}
                        <div
                          className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-slate-700 bg-linear-to-br from-indigo-500 via-sky-400 to-amber-300 relative flex items-center justify-center shadow-inner"
                          style={{ filter: activeTheme.cssFilter }}
                          title={`Filtro CSS: ${activeTheme.cssFilter}`}
                        >
                          <div className="w-7 h-7 rounded-full bg-amber-400 border border-black shadow-xs absolute top-1.5 left-1.5 flex items-center justify-center text-[8px] font-black text-black">
                            HQ
                          </div>
                          <div className="w-10 h-3 bg-white/90 rounded border border-black shadow-xs absolute bottom-2 flex items-center justify-center text-[7px] font-black text-black">
                            PREVIEW
                          </div>
                        </div>

                        {/* Theme details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5">
                            <span className="text-xs font-bold text-white truncate">
                              {activeTheme.name}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                            {activeTheme.description}
                          </p>
                          <code className="text-[9px] font-mono text-cyan-300/90 block truncate mt-1 bg-[#050A14] px-1.5 py-0.5 rounded border border-cyan-950">
                            CSS: {activeTheme.cssFilter === 'none' ? 'sem filtro' : activeTheme.cssFilter}
                          </code>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-5 space-y-2.5">
        {/* Main Prompt Button */}
        <button
          type="button"
          onClick={onGeneratePrompt}
          disabled={isLoadingPrompt || !formData.assunto.trim()}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl btn-cartoon-yellow text-sm cursor-pointer disabled:opacity-50"
        >
          <Sparkles className={`w-4 h-4 ${isLoadingPrompt ? 'animate-spin text-neutral-900' : 'text-neutral-900 stroke-[2.5]'}`} />
          <span>{isLoadingPrompt ? 'Escrevendo Roteiro do Gibi...' : '💥 Gerar Roteiro da Apostila'}</span>
        </button>

        {/* Secondary Full Generation Button */}
        <button
          type="button"
          onClick={onGenerateFullBooklet}
          disabled={isLoadingFull || !formData.assunto.trim()}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl btn-cartoon-cyan text-xs cursor-pointer disabled:opacity-50"
        >
          <Rocket className={`w-3.5 h-3.5 ${isLoadingFull ? 'animate-bounce' : 'stroke-[2.5]'}`} />
          <span>{isLoadingFull ? 'Desenhando Páginas...' : '🚀 Gerar Apostila Completa (HQ)'}</span>
        </button>

        {/* Shortcut to Single Image Generator */}
        {onOpenSingleImage && (
          <button
            type="button"
            onClick={onOpenSingleImage}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 rounded-xl bg-[#141B2D] hover:bg-[#1D2740] text-amber-300 font-cartoon font-bold text-xs border-2 border-black shadow-[2px_2px_0px_0px_#000] transition cursor-pointer"
          >
            <span className="text-xs">🍌</span>
            <span>Criar Imagens Únicas (Nano Banana)</span>
          </button>
        )}
      </div>
    </div>
  );
};
