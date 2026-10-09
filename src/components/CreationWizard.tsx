import React, { useState } from 'react';
import { ArtStyle, ComicBook, TargetAudience, StyleCategory } from '../types/comic';
import { ART_STYLES, CHARACTER_ARCHETYPES } from '../data/styles';
import { VisualPromptAssistant } from './VisualPromptAssistant';
import {
  Sparkles,
  Palette,
  Users,
  Sliders,
  ArrowRight,
  ArrowLeft,
  BookOpen,
  FileText,
  Upload,
  CheckCircle,
  HelpCircle,
  Clock,
  Layers,
  Filter,
} from 'lucide-react';

interface CreationWizardProps {
  onGenerated: (comicBook: ComicBook) => void;
  onCancel: () => void;
}

const QUICK_TOPICS = [
  {
    title: 'Redes & TCP/IP (Ligne Claire)',
    topic: 'Introdução a Redes de Computadores e a Pilha de Protocolos TCP/IP',
    notes: 'Explicar pacotes, handshake SYN/ACK, analogia do correio, encapsulamento e DNS.',
    recommendedStyle: 'clean_vector_bd' as ArtStyle,
    mentorIdx: 10, // Dr. Byte
    learnerIdx: 11, // Leo
  },
  {
    title: 'Computação Quântica (Mangá Shonen)',
    topic: 'Fundamentos de Computação Quântica: Superposição e Entrelaçamento de Qubits',
    notes: 'Explicar por que qubits podem ser 0 e 1 simultaneamente, esfera de Bloch e computadores quânticos.',
    recommendedStyle: 'modern_manga' as ArtStyle,
    mentorIdx: 0, // Sensei Kenji
    learnerIdx: 1, // Yuki
  },
  {
    title: 'Sistema Imunológico (Cartoon 90s)',
    topic: 'Como o Sistema Imunológico Humano Combate Vírus e Bactérias no Corpo',
    notes: 'Fagócitos como patrulha, Linfócitos T como generais, anticorpos como projéteis e memória imunológica.',
    recommendedStyle: 'cartoon_retro' as ArtStyle,
    mentorIdx: 3, // Prof. Pipoca
    learnerIdx: 4, // Tico
  },
  {
    title: 'Astrofísica & Buracos Negros (Anime)',
    topic: 'O Espaço-Tempo, Relatividade Geral e o Horizonte de Eventos de Buracos Negros',
    notes: 'Curvatura do espaço-tempo com uma cama elástica, velocidade da luz e radiação Hawking.',
    recommendedStyle: 'anime_cinematic' as ArtStyle,
    mentorIdx: 0, // Sensei Kenji
    learnerIdx: 2, // Ren
  },
  {
    title: 'Inteligência Artificial (Cyberpunk)',
    topic: 'Como Funcionam Redes Neurais e o Treinamento de Modelos de Inteligência Artificial',
    notes: 'Pesos sinápticos, retropropagação de gradiente, dados de treino e aprendizado de máquina.',
    recommendedStyle: 'cyberpunk_noir' as ArtStyle,
    mentorIdx: 8, // Kira Netrunner
    learnerIdx: 9, // Zero
  },
  {
    title: 'Juros Compostos & Finanças (Chibi Kawaii)',
    topic: 'Matemática Financeira Divertida: O Poder da Bola de Neve dos Juros Compostos',
    notes: 'Tempo vs dinheiro, disciplina financeira e como poupar um pouquinho rende um castelo.',
    recommendedStyle: 'chibi_kawaii' as ArtStyle,
    mentorIdx: 6, // Mestre Mochi
    learnerIdx: 7, // Pompom
  },
];

export const CreationWizard: React.FC<CreationWizardProps> = ({ onGenerated, onCancel }) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [topic, setTopic] = useState('');
  const [rawNotes, setRawNotes] = useState('');
  const [artStyle, setArtStyle] = useState<ArtStyle>('clean_vector_bd');
  const [targetAudience, setTargetAudience] = useState<TargetAudience>('beginner');
  const [pageCount, setPageCount] = useState<number>(3);
  const [tone, setTone] = useState<'socratic' | 'humorous' | 'formal' | 'enthusiastic'>('socratic');

  // Categories Filters
  const [styleFilter, setStyleFilter] = useState<StyleCategory>('all');
  const [charFilter, setCharFilter] = useState<string>('all');

  // Characters
  const [mentor, setMentor] = useState(CHARACTER_ARCHETYPES[0]);
  const [learner, setLearner] = useState(CHARACTER_ARCHETYPES[1]);

  // Loading Pipeline
  const [isLoading, setIsLoading] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSelectQuickTopic = (item: (typeof QUICK_TOPICS)[0]) => {
    setTopic(item.topic);
    setRawNotes(item.notes);
    setArtStyle(item.recommendedStyle);
    if (CHARACTER_ARCHETYPES[item.mentorIdx]) setMentor(CHARACTER_ARCHETYPES[item.mentorIdx]);
    if (CHARACTER_ARCHETYPES[item.learnerIdx]) setLearner(CHARACTER_ARCHETYPES[item.learnerIdx]);
  };

  const handleStartGeneration = async () => {
    if (!topic.trim()) {
      setError('Por favor, informe o tema de estudo.');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      setGenerationStep('Camada 1: Estruturando jornada pedagógica e arcos conceituais...');
      await new Promise((r) => setTimeout(r, 600));

      setGenerationStep('Camada 2: Roteirizando diálogos didáticos, balões e prompts visuais no JSON Engine...');

      const response = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          raw_notes: rawNotes,
          target_audience: targetAudience,
          page_count: pageCount,
          art_style: artStyle,
          mentor_name: mentor.name,
          mentor_desc: mentor.visual_description,
          learner_name: learner.name,
          learner_desc: learner.visual_description,
          tone,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        const rawErrMsg = errData?.details || errData?.error || 'Erro na geração com Gemini.';
        if (
          rawErrMsg.includes('503') ||
          rawErrMsg.includes('high demand') ||
          rawErrMsg.includes('UNAVAILABLE')
        ) {
          throw new Error(
            'Os servidores de IA do Gemini estão sob alta demanda temporária (503). Uma nova tentativa automática pode ser realizada em instantes.'
          );
        }
        throw new Error(rawErrMsg);
      }

      setGenerationStep('Camada 3: Compondo painéis gráficos e ancorando balões vetoriais...');
      const comicBookData = await response.json();

      setGenerationStep('Camada 4: Finalizando apostila e renderizando visualizadores...');
      await new Promise((r) => setTimeout(r, 500));

      onGenerated(comicBookData);
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || 'Falha temporária ao gerar a apostila em quadrinhos.';
      setError(
        msg.includes('503') || msg.includes('high demand')
          ? 'Os servidores de IA estão sob alta demanda momentânea (Spike 503). Por favor, clique novamente para tentar ou use um dos temas rápidos.'
          : msg
      );
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8 px-4">
      {/* Wizard Header */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">
              Wizard de Criação • 4 Camadas de IA
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-2">
              CRIAR NOVA APOSTILA EM QUADRINHOS
            </h1>
            <p className="text-xs text-neutral-400">
              Transforme conceitos densos em uma graphic novel pedagógica rica e memorável.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-xs font-medium text-neutral-400 hover:text-white px-3 py-1.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition"
          >
            Voltar
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="grid grid-cols-4 gap-2 border-t border-neutral-800 pt-5">
          {[
            { num: 1, label: 'Tema & Notas', icon: BookOpen },
            { num: 2, label: 'Estilo Visual', icon: Palette },
            { num: 3, label: 'Personagens', icon: Users },
            { num: 4, label: 'Pedagogia & Tom', icon: Sliders },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => !isLoading && setStep(s.num as any)}
                className={`flex items-center space-x-2 p-2 rounded-xl text-left transition ${
                  isActive
                    ? 'bg-amber-500/15 border border-amber-500/40 text-amber-400 font-bold'
                    : isDone
                    ? 'text-neutral-300 hover:bg-neutral-800/50'
                    : 'text-neutral-500'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                    isActive
                      ? 'bg-amber-500 text-black'
                      : isDone
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {isDone ? '✓' : s.num}
                </div>
                <div className="hidden sm:block truncate">
                  <p className="text-xs truncate">{s.label}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Loading Overlay */}
      {isLoading ? (
        <div className="bg-neutral-900 border-2 border-amber-500/40 rounded-2xl p-10 text-center space-y-6 shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border-2 border-amber-400 flex items-center justify-center text-amber-400 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold font-display text-white tracking-wide">
              ORQUESTRANDO APOSTILA COM GEMINI AI
            </h2>
            <p className="text-sm text-amber-300 font-mono animate-pulse">{generationStep}</p>
          </div>

          <div className="max-w-md mx-auto bg-neutral-950 rounded-full h-2.5 overflow-hidden border border-neutral-800">
            <div className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full w-full animate-[progress_2s_ease-in-out_infinite]" />
          </div>

          <p className="text-xs text-neutral-500">
            Construindo divisão de páginas, metáforas visuais, balões de fala e síntese conceitual...
          </p>
        </div>
      ) : (
        <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 shadow-2xl space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold">
              {error}
            </div>
          )}

          {/* STEP 1: Topic & Scope */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-white mb-2">
                  Qual é o tema de estudo da apostila? *
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Introdução a Redes de Computadores e Protocolo TCP/IP"
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3.5 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Quick suggestions */}
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
                  Sugestões Prontas para Testar (1 Clique):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {QUICK_TOPICS.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectQuickTopic(item)}
                      className={`p-3 rounded-xl border text-left transition ${
                        topic === item.topic
                          ? 'border-amber-400 bg-amber-500/10 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950/60 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-950'
                      }`}
                    >
                      <p className="text-xs font-bold truncate text-amber-300">{item.title}</p>
                      <p className="text-[11px] text-neutral-400 line-clamp-2 mt-1">{item.topic}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Raw Notes or PDF content */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-white">
                    Notas de Estudo ou Conteúdo Bruto (Opcional)
                  </label>
                  <span className="text-[11px] text-neutral-400">
                    Pode colar resumos, artigos ou tópicos de aula
                  </span>
                </div>
                <textarea
                  value={rawNotes}
                  onChange={(e) => setRawNotes(e.target.value)}
                  rows={4}
                  placeholder="Cole aqui anotações, fórmulas, dúvidas específicas ou trechos de slides para a IA incorporar nos quadrinhos..."
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl p-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (!topic.trim()) {
                      setError('Informe o tema da apostila.');
                      return;
                    }
                    setError('');
                    setStep(2);
                  }}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition shadow-lg"
                >
                  <span>Próximo: Estilo Visual</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Art Style */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Escolha a Estética Visual da Graphic Novel
                </h3>
                <p className="text-xs text-neutral-400">
                  A âncora de estilo garante harmonia e consistência visual entre todos os painéis.
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all' as StyleCategory, label: 'Todos os Estilos' },
                  { id: 'manga_anime' as StyleCategory, label: '⛩️ Mangá & Anime' },
                  { id: 'cartoon' as StyleCategory, label: '🎨 Cartoon & Chibi' },
                  { id: 'comics' as StyleCategory, label: '📖 Quadrinhos & HQ' },
                  { id: 'retro_digital' as StyleCategory, label: '👾 Pixel Art & Cyber' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setStyleFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      styleFilter === cat.id
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {(Object.keys(ART_STYLES) as ArtStyle[])
                  .filter((key) => styleFilter === 'all' || ART_STYLES[key].category === styleFilter)
                  .map((key) => {
                    const style = ART_STYLES[key];
                    const isSelected = artStyle === key;
                    return (
                      <div
                        key={key}
                        onClick={() => setArtStyle(key)}
                        className={`cursor-pointer p-4 rounded-2xl border-2 transition relative overflow-hidden flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-400 bg-amber-500/10 shadow-xl'
                            : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-neutral-800 text-neutral-300">
                              {style.tag}
                            </span>
                            {isSelected && (
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs font-bold">
                                ✓
                              </span>
                            )}
                          </div>

                          <h4 className="text-base font-bold text-white font-display mb-1">
                            {style.name}
                          </h4>
                          <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                            {style.description}
                          </p>
                        </div>

                        {/* Palette preview pills */}
                        <div className="flex items-center space-x-1.5 pt-2 border-t border-neutral-800/80">
                          <span className="text-[10px] text-neutral-500 font-mono uppercase mr-1">
                            Paleta:
                          </span>
                          {style.palette.map((color, cIdx) => (
                            <span
                              key={cIdx}
                              className="w-3.5 h-3.5 rounded-full border border-black/40 shadow-xs"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* AI Visual Prompt Diffusion Assistant Card */}
              <div className="pt-2">
                <div className="bg-neutral-950/90 border border-purple-500/30 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <span className="p-1 rounded-lg bg-purple-500/20 text-purple-400">
                        <Sparkles className="w-4 h-4" />
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase font-mono tracking-wider">
                          Serviço de IA • Sugestões de Prompts Visuais de Difusão
                        </h4>
                        <p className="text-[11px] text-neutral-400">
                          Veja como o modelo de IA visualiza o tema "{topic || 'definido no passo 1'}" no estilo {ART_STYLES[artStyle].name}.
                        </p>
                      </div>
                    </div>
                  </div>

                  <VisualPromptAssistant
                    topic={topic}
                    artStyle={artStyle}
                    onApplyPrompt={(prompt, _camera) => {
                      setRawNotes((prev) =>
                        prev
                          ? `${prev}\n- Incorporar metáfora visual: "${prompt}"`
                          : `- Incorporar metáfora visual: "${prompt}"`
                      );
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition shadow-lg"
                >
                  <span>Próximo: Personagens</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Characters */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Dupla de Personagens Guia (Mentor & Aprendiz)
                </h3>
                <p className="text-xs text-neutral-400">
                  Escolha personagens em estilos de mangá, cartoon, anime, chibi ou quadrinhos clássicos para conduzir o diálogo didático.
                </p>
              </div>

              {/* Character Category Filter Pills */}
              <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
                {[
                  { id: 'all', label: 'Todos os Personagens' },
                  { id: 'manga_anime', label: '⛩️ Mangá & Anime' },
                  { id: 'cartoon', label: '🎨 Cartoon' },
                  { id: 'chibi', label: '✨ Chibi Kawaii' },
                  { id: 'tech_noir', label: '⚡ Cyberpunk' },
                  { id: 'classic', label: '📚 Clássico Didático' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCharFilter(cat.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                      charFilter === cat.id
                        ? 'bg-amber-500 text-neutral-950 shadow-md'
                        : 'bg-neutral-950 text-neutral-400 hover:text-white border border-neutral-800'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Mentor selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Escolha o Especialista Mentor:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CHARACTER_ARCHETYPES
                    .filter(
                      (c) =>
                        c.role === 'mentor' &&
                        (charFilter === 'all' || c.category === charFilter)
                    )
                    .map((m) => {
                      const isSelected = mentor.name === m.name;
                      return (
                        <div
                          key={m.id}
                          onClick={() => setMentor(m)}
                          className={`cursor-pointer p-3.5 rounded-xl border-2 transition relative ${
                            isSelected
                              ? 'border-blue-400 bg-blue-500/15 shadow-md'
                              : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full ring-2 ring-black/40"
                                style={{ backgroundColor: m.color }}
                              />
                              <p className="text-xs font-bold text-white">{m.name}</p>
                            </div>
                            {m.style_badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-neutral-800 text-neutral-300">
                                {m.style_badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-blue-300 font-mono mb-1">{m.title}</p>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {m.visual_description}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Learner selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Escolha o Aprendiz Curioso:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {CHARACTER_ARCHETYPES
                    .filter(
                      (c) =>
                        c.role === 'learner' &&
                        (charFilter === 'all' || c.category === charFilter)
                    )
                    .map((l) => {
                      const isSelected = learner.name === l.name;
                      return (
                        <div
                          key={l.id}
                          onClick={() => setLearner(l)}
                          className={`cursor-pointer p-3.5 rounded-xl border-2 transition relative ${
                            isSelected
                              ? 'border-amber-400 bg-amber-500/15 shadow-md'
                              : 'border-neutral-800 bg-neutral-950 hover:border-neutral-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center space-x-2">
                              <span
                                className="w-3.5 h-3.5 rounded-full ring-2 ring-black/40"
                                style={{ backgroundColor: l.color }}
                              />
                              <p className="text-xs font-bold text-white">{l.name}</p>
                            </div>
                            {l.style_badge && (
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-neutral-800 text-neutral-300">
                                {l.style_badge}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-amber-300 font-mono mb-1">{l.title}</p>
                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed">
                            {l.visual_description}
                          </p>
                        </div>
                      );
                    })}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider transition shadow-lg"
                >
                  <span>Próximo: Pedagogia</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Pedagogy & Tone */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  Configurações Didáticas & Volume da Apostila
                </h3>
                <p className="text-xs text-neutral-400">
                  Ajuste a densidade conceitual, o tom e o número de páginas desejado.
                </p>
              </div>

              {/* Number of Pages */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Número de Páginas da Apostila:
                  </label>
                  <span className="text-sm font-bold text-amber-400 font-mono">
                    {pageCount} {pageCount === 1 ? 'Página' : 'Páginas'} (~{pageCount * 3} a {pageCount * 4} Painéis)
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPageCount(num)}
                      className={`p-3 rounded-xl border text-center transition ${
                        pageCount === num
                          ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <span className="text-base font-display block">{num} Pág{num > 1 ? 's' : ''}</span>
                      <span className="text-[10px] text-neutral-500">
                        {num === 1 ? 'Capítulo Único' : num === 3 ? 'Apostila Completa' : 'Apostila Média'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Público-Alvo:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'beginner' as TargetAudience, label: 'Iniciante / Curioso', desc: 'Analogias do cotidiano e zero jargões' },
                    { id: 'intermediate' as TargetAudience, label: 'Intermediário', desc: 'Conceitos técnicos com exemplos claros' },
                    { id: 'advanced' as TargetAudience, label: 'Avançado / Acadêmico', desc: 'Profundidade arquitetural e precisão' },
                  ].map((aud) => (
                    <button
                      key={aud.id}
                      type="button"
                      onClick={() => setTargetAudience(aud.id)}
                      className={`p-3 rounded-xl border text-left transition ${
                        targetAudience === aud.id
                          ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{aud.label}</p>
                      <p className="text-[10px] text-neutral-400 mt-1">{aud.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">
                  Tom Explicativo:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'socratic' as const, label: 'Socrático', desc: 'Perguntas e descobertas' },
                    { id: 'humorous' as const, label: 'Bem-humorado', desc: 'Trocadilhos e leveza' },
                    { id: 'enthusiastic' as const, label: 'Entusiasta', desc: 'Energia contagiante' },
                    { id: 'formal' as const, label: 'Técnico Sério', desc: 'Foco estrito e sóbrio' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`p-2.5 rounded-xl border text-center transition ${
                        tone === t.id
                          ? 'border-amber-400 bg-amber-500/15 text-white font-bold'
                          : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <p className="text-xs font-bold text-white">{t.label}</p>
                      <p className="text-[10px] text-neutral-400">{t.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex items-center space-x-2 px-5 py-2.5 rounded-xl text-neutral-400 hover:text-white text-xs font-medium"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartGeneration}
                  className="flex items-center space-x-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-black text-xs uppercase tracking-wider transition shadow-xl hover:shadow-amber-500/20 active:scale-95"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Gerar Apostila em Quadrinhos</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
