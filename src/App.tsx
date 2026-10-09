import React, { useState } from 'react';
import { ComicBook, ComicPanel, DialogueBubble, ArtStyle, ColorThemeId, GeneratedSingleImage } from './types/comic';
import { TCP_IP_SAMPLE_BOOK } from './data/samples';
import { ART_STYLES, CHARACTER_ARCHETYPES } from './data/styles';
import { COLOR_THEMES } from './data/colorThemes';
import { ApostilaSidebar, SidebarTab } from './components/ApostilaSidebar';
import { ApostilaConfigForm, ApostilaFormData } from './components/ApostilaConfigForm';
import { SingleImageGenerator } from './components/SingleImageGenerator';
import { PromptViewerCard, GeneratedApostilaPrompt } from './components/PromptViewerCard';
import { WebtoonReader } from './components/WebtoonReader';
import { GraphicNovelReader } from './components/GraphicNovelReader';
import { A4BookletPrintView } from './components/A4BookletPrintView';
import { StoryboardJsonViewer } from './components/StoryboardJsonViewer';
import { BubbleEditorModal } from './components/BubbleEditorModal';
import { VisualPromptAssistant } from './components/VisualPromptAssistant';
import { HelpModal } from './components/HelpModal';
import { ActivitiesViewer } from './components/ActivitiesViewer';
import { CapasViewer } from './components/CapasViewer';
import { ProjetosViewer } from './components/ProjetosViewer';
import {
  BookOpen,
  Smartphone,
  Printer,
  Code2,
  Sparkles,
  ArrowRight,
  Layers,
  Wand2,
  Menu,
  X,
  GraduationCap,
  Bell,
  Package,
} from 'lucide-react';

export type ReaderViewMode = 'webtoon' | 'comic_book' | 'print_a4' | 'json_schema';

export default function App() {
  const [currentBook, setCurrentBook] = useState<ComicBook>(TCP_IP_SAMPLE_BOOK);
  const [activeSidebarTab, setActiveSidebarTab] = useState<SidebarTab>('criar');
  const [readerViewMode, setReaderViewMode] = useState<ReaderViewMode>('webtoon');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Form State
  const defaultMentor = CHARACTER_ARCHETYPES.find((c) => c.role === 'mentor') || CHARACTER_ARCHETYPES[0];
  const defaultLearner = CHARACTER_ARCHETYPES.find((c) => c.role === 'learner') || CHARACTER_ARCHETYPES[1];

  const [formData, setFormData] = useState<ApostilaFormData>({
    disciplina: 'Tecnologia & Computação',
    assunto: 'Redes de Computadores e Protocolo TCP/IP',
    publico: 'Ensino Médio (15 a 17 anos)',
    objetivo: 'Ensinar o funcionamento da internet e pacotes de dados através de analogias de correios e cartas.',
    nivel: 'Intermediário',
    tipoMaterial: 'Apostila em quadrinhos (Graphic Novel)',
    formato: 'Formato A4',
    paginas: 3,
    tom: 'socratic',
    estiloEscrita: 'Didático',
    paletaVisual: 'Automática',
    colorTheme: 'default',
    artStyle: 'livro_didatico',
    mentor: defaultMentor,
    learner: defaultLearner,
    incluirAtividades: true,
  });

  // Prompt Results & Loading States
  const [promptResult, setPromptResult] = useState<GeneratedApostilaPrompt | null>(null);
  const [isLoadingPrompt, setIsLoadingPrompt] = useState(false);
  const [isLoadingFull, setIsLoadingFull] = useState(false);
  const [helpModalType, setHelpModalType] = useState<'nivel' | 'formato' | null>(null);
  const [isGlobalPromptAssistantOpen, setIsGlobalPromptAssistantOpen] = useState(false);

  // Bubble Editor Modal State
  const [bubbleModalState, setBubbleModalState] = useState<{
    isOpen: boolean;
    pageIdx: number;
    panelIdx: number;
    bubbleIdx: number;
    bubble: DialogueBubble | null;
  }>({
    isOpen: false,
    pageIdx: 0,
    panelIdx: 0,
    bubbleIdx: 0,
    bubble: null,
  });

  // Handle Form Change (with automatic colorTheme sync to currentBook)
  const handleFormChange = (updated: Partial<ApostilaFormData>) => {
    setFormData((prev) => {
      const next = { ...prev, ...updated };
      if (updated.colorTheme && updated.colorTheme !== prev.colorTheme) {
        setCurrentBook((b) => ({
          ...b,
          book_metadata: {
            ...b.book_metadata,
            color_theme: updated.colorTheme,
          },
        }));
      }
      return next;
    });
  };

  // Dedicated Color Theme Switcher for Readers & Form
  const handleChangeColorTheme = (theme: ColorThemeId) => {
    setFormData((prev) => ({ ...prev, colorTheme: theme }));
    setCurrentBook((prev) => ({
      ...prev,
      book_metadata: {
        ...prev.book_metadata,
        color_theme: theme,
      },
    }));
  };

  // Handler: Generate Diffusion Prompt Package
  const handleGeneratePrompt = async () => {
    if (!formData.assunto.trim()) return;
    setIsLoadingPrompt(true);

    try {
      const res = await fetch('/api/generate-apostila-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina: formData.disciplina,
          assunto: formData.assunto,
          publico: formData.publico,
          objetivo: formData.objetivo,
          nivel: formData.nivel,
          tipoMaterial: formData.tipoMaterial,
          formato: formData.formato,
          art_style: formData.artStyle,
          estilo_escrita: formData.estiloEscrita || 'Didático',
          paleta_visual: formData.paletaVisual || 'Automática',
          color_theme: formData.colorTheme || 'default',
          mentor: formData.mentor.name,
          learner: formData.learner.name,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao gerar o prompt.');
      }

      const data = await res.json();
      setPromptResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingPrompt(false);
    }
  };

  // Handler: Generate Full Interactive Storyboard
  const handleGenerateFullBooklet = async () => {
    if (!formData.assunto.trim()) return;
    setIsLoadingFull(true);

    try {
      const res = await fetch('/api/generate-storyboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: formData.assunto,
          raw_notes: `Disciplina: ${formData.disciplina}\nObjetivo: ${formData.objetivo}\nNível: ${formData.nivel}`,
          target_audience:
            formData.nivel === 'Introdutório'
              ? 'beginner'
              : formData.nivel === 'Avançado' || formData.nivel === 'Concursos / Especialista'
              ? 'advanced'
              : 'intermediate',
          page_count: formData.paginas,
          art_style: formData.artStyle,
          mentor_name: formData.mentor.name,
          mentor_desc: formData.mentor.visual_description,
          learner_name: formData.learner.name,
          learner_desc: formData.learner.visual_description,
          tone: formData.tom,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha ao gerar a apostila.');
      }

      const generatedBook: ComicBook = await res.json();
      // Automatically apply the selected Color Theme to the generated booklet
      generatedBook.book_metadata.color_theme = formData.colorTheme || 'default';
      setCurrentBook(generatedBook);
      setActiveSidebarTab('paginas');
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoadingFull(false);
    }
  };

  // Handler: Update panel data
  const handleUpdatePanel = (pageIdx: number, panelIdx: number, updatedPanel: ComicPanel) => {
    setCurrentBook((prev) => {
      const newPages = [...prev.pages];
      const newPanels = [...newPages[pageIdx].panels];
      newPanels[panelIdx] = updatedPanel;
      newPages[pageIdx] = {
        ...newPages[pageIdx],
        panels: newPanels,
      };
      return {
        ...prev,
        pages: newPages,
      };
    });
  };

  // Handler: Open bubble editor
  const handleOpenBubbleEditor = (
    pageIdx: number,
    panelIdx: number,
    bubble: DialogueBubble,
    bubbleIdx: number
  ) => {
    setBubbleModalState({
      isOpen: true,
      pageIdx,
      panelIdx,
      bubbleIdx,
      bubble,
    });
  };

  // Handler: Add new bubble to panel
  const handleAddBubble = (pageIdx: number, panelIdx: number) => {
    const characters = currentBook.book_metadata.characters;
    const defaultChar = characters[0] || { id: 'char_1' };

    const newBubble: DialogueBubble = {
      character_id: defaultChar.id,
      type: 'speech',
      text: 'Novo balão de fala didático!',
      position_anchor: 'top-left',
    };

    setCurrentBook((prev) => {
      const newPages = [...prev.pages];
      const newPanels = [...newPages[pageIdx].panels];
      const currentPanel = newPanels[panelIdx];

      newPanels[panelIdx] = {
        ...currentPanel,
        bubbles: [...currentPanel.bubbles, newBubble],
      };
      newPages[pageIdx] = {
        ...newPages[pageIdx],
        panels: newPanels,
      };
      return {
        ...prev,
        pages: newPages,
      };
    });

    const targetPanel = currentBook.pages[pageIdx].panels[panelIdx];
    setBubbleModalState({
      isOpen: true,
      pageIdx,
      panelIdx,
      bubbleIdx: targetPanel.bubbles.length,
      bubble: newBubble,
    });
  };

  // Handler: Save edited bubble
  const handleSaveBubble = (updatedBubble: DialogueBubble) => {
    const { pageIdx, panelIdx, bubbleIdx } = bubbleModalState;
    setCurrentBook((prev) => {
      const newPages = [...prev.pages];
      const newPanels = [...newPages[pageIdx].panels];
      const currentPanel = newPanels[panelIdx];
      const newBubbles = [...currentPanel.bubbles];

      newBubbles[bubbleIdx] = updatedBubble;
      newPanels[panelIdx] = {
        ...currentPanel,
        bubbles: newBubbles,
      };
      newPages[pageIdx] = {
        ...newPages[pageIdx],
        panels: newPanels,
      };
      return {
        ...prev,
        pages: newPages,
      };
    });
    setBubbleModalState((prev) => ({ ...prev, isOpen: false, bubble: null }));
  };

  // New Booklet handler
  const handleNewBooklet = () => {
    setFormData({
      disciplina: '',
      assunto: '',
      publico: '',
      objetivo: '',
      nivel: 'Intermediário',
      tipoMaterial: 'Apostila em quadrinhos (Graphic Novel)',
      formato: 'Formato A4',
      paginas: 3,
      tom: 'socratic',
      estiloEscrita: 'Didático',
      paletaVisual: 'Automática',
      colorTheme: 'default',
      artStyle: 'livro_didatico',
      mentor: defaultMentor,
      learner: defaultLearner,
      incluirAtividades: true,
    });
    setPromptResult(null);
    setActiveSidebarTab('criar');
  };

  // Handler: Insert single image generated into current book
  const handleInsertSingleImage = (image: GeneratedSingleImage) => {
    setCurrentBook((prev) => {
      const newPages = [...prev.pages];
      if (newPages.length === 0) return prev;

      const lastPageIdx = newPages.length - 1;
      const lastPage = { ...newPages[lastPageIdx] };
      const newPanelIndex = lastPage.panels.length + 1;

      const newPanel: ComicPanel = {
        panel_index: newPanelIndex,
        visual_prompt: image.optimizedPrompt,
        camera_angle: image.cameraAngle,
        imageUrl: image.imageUrl,
        narration_box: image.narrationText,
        bubbles: image.speechBubbleText
          ? [
              {
                character_id: 'char_mentor',
                type: 'speech',
                text: image.speechBubbleText,
                position_anchor: 'top-left',
              },
            ]
          : [],
      };

      if (lastPage.panels.length < 4) {
        lastPage.panels = [...lastPage.panels, newPanel];
        newPages[lastPageIdx] = lastPage;
      } else {
        newPages.push({
          page_number: newPages.length + 1,
          layout_type: 'hero_top_two_bottom',
          page_summary: `Página Adicional: ${image.prompt.slice(0, 30)}`,
          panels: [newPanel],
        });
      }

      return {
        ...prev,
        pages: newPages,
      };
    });
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-neutral-100 flex flex-col md:flex-row font-sans selection:bg-amber-400 selection:text-black">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-[#0D121F] border-b-2 border-black p-3.5 flex items-center justify-between sticky top-0 z-40 shadow-[0_2px_0_0_#000]">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400 border-2 border-black flex items-center justify-center text-neutral-950 font-black text-sm shadow-[2px_2px_0px_0px_#000]">
            💥
          </div>
          <span className="font-cartoon font-extrabold text-sm text-white">GibiToon Studio</span>
        </div>

        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-[#141B2D] border border-black text-amber-400 hover:text-white cursor-pointer shadow-[2px_2px_0px_0px_#000]"
        >
          {isMobileMenuOpen ? <X className="w-5 h-5 stroke-[2.5]" /> : <Menu className="w-5 h-5 stroke-[2.5]" />}
        </button>
      </div>

      {/* Sidebar: Left Navigation */}
      <div className={`md:block ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        <ApostilaSidebar
          activeTab={activeSidebarTab}
          onSelectTab={(tab) => {
            setActiveSidebarTab(tab);
            setIsMobileMenuOpen(false);
          }}
          onNewApostila={handleNewBooklet}
          onOpenHelp={() => setHelpModalType('formato')}
        />
      </div>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto comic-dots-dark">
        {/* Top Header Bar */}
        <header className="bg-[#0D121F]/95 backdrop-blur-md border-b-2 border-black px-5 py-3 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 shadow-[0_2px_0_0_rgba(0,0,0,0.5)]">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 border border-black shadow-[1px_1px_0px_0px_#000]"></span>
              <h1 className="text-sm font-cartoon font-extrabold text-white tracking-wide truncate max-w-[260px] sm:max-w-md">
                Gibi: {currentBook.book_metadata.title}
              </h1>
            </div>
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              {ART_STYLES[currentBook.book_metadata.art_style]?.name || 'Quadrinho Didático'}
            </span>
          </div>

          {/* Quick Reader Mode Switcher */}
          <div className="flex items-center space-x-1.5 bg-[#121828] p-1 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_#000]">
            <button
              onClick={() => {
                setActiveSidebarTab('criar');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cartoon font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'criar'
                  ? 'bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A2338]'
              }`}
            >
              <Wand2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Criador</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('imagem_unica');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cartoon font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'imagem_unica'
                  ? 'bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A2338]'
              }`}
            >
              <span className="text-xs">🍌</span>
              <span>Imagem Única</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('paginas');
                setReaderViewMode('webtoon');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cartoon font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'paginas' && readerViewMode === 'webtoon'
                  ? 'bg-cyan-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A2338]'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Webtoon</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('paginas');
                setReaderViewMode('comic_book');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cartoon font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'paginas' && readerViewMode === 'comic_book'
                  ? 'bg-cyan-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A2338]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Modo HQ</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('paginas');
                setReaderViewMode('print_a4');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cartoon font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'paginas' && readerViewMode === 'print_a4'
                  ? 'bg-rose-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]'
                  : 'text-slate-300 hover:text-white hover:bg-[#1A2338]'
              }`}
            >
              <Printer className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>A4 / PDF</span>
            </button>

            <button
              onClick={() => {
                setActiveSidebarTab('paginas');
                setReaderViewMode('json_schema');
              }}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer ${
                activeSidebarTab === 'paginas' && readerViewMode === 'json_schema'
                  ? 'bg-[#1C263E] text-amber-300 border border-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Ver JSON do Storyboard"
            >
              <Code2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-4 sm:p-6 flex-1">
          {/* TAB 1: CRIAR APOSTILA (Exact layout from user screenshot) */}
          {activeSidebarTab === 'criar' && (
            <div className="flex flex-col lg:flex-row items-start justify-center gap-6 max-w-7xl mx-auto">
              {/* Left Column: Form according to screenshot */}
              <ApostilaConfigForm
                formData={formData}
                onChange={handleFormChange}
                onGeneratePrompt={handleGeneratePrompt}
                onGenerateFullBooklet={handleGenerateFullBooklet}
                onOpenHelp={(type) => setHelpModalType(type)}
                onOpenSingleImage={() => setActiveSidebarTab('imagem_unica')}
                isLoadingPrompt={isLoadingPrompt}
                isLoadingFull={isLoadingFull}
              />

              {/* Right Column: Prompt Viewer or Visual Preview */}
              <div className="flex-1 w-full space-y-6">
                {promptResult ? (
                  <PromptViewerCard
                    promptData={promptResult}
                    onRenderBooklet={() => {
                      setActiveSidebarTab('paginas');
                    }}
                  />
                ) : (
                  <div className="bg-[#080D1A] border border-[#16233B] rounded-2xl p-6 sm:p-7 shadow-xl space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-[#16233B] pb-4">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                            Apostila Carregada no Leitor
                          </span>
                          <span className="text-xs text-slate-400 font-mono">
                            Pronta para Leitura & Edição
                          </span>
                        </div>
                        <h2 className="text-xl font-bold font-sans text-white mt-1.5">
                          {currentBook.book_metadata.title}
                        </h2>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {currentBook.book_metadata.topic}
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveSidebarTab('paginas');
                        }}
                        className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-200 text-neutral-950 text-xs font-black transition shadow-lg shrink-0"
                      >
                        <span>Abrir Leitor Completo</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B]">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Páginas</p>
                        <p className="text-lg font-black text-cyan-400 mt-0.5">
                          {currentBook.pages.length} Págs
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B]">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Painéis HQ</p>
                        <p className="text-lg font-black text-white mt-0.5">
                          {currentBook.pages.reduce((acc, p) => acc + p.panels.length, 0)} Quadros
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B]">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Estilo Visual</p>
                        <p className="text-xs font-bold text-white mt-1 truncate">
                          {ART_STYLES[currentBook.book_metadata.art_style]?.name || 'Ligne Claire'}
                        </p>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B]">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Tema de Cores</p>
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor:
                                COLOR_THEMES[currentBook.book_metadata.color_theme || 'default']?.swatchColors[0] ||
                                '#3b82f6',
                            }}
                          />
                          <p className="text-xs font-bold text-cyan-300 truncate">
                            {COLOR_THEMES[currentBook.book_metadata.color_theme || 'default']?.shortLabel || 'Padrão'}
                          </p>
                        </div>
                      </div>

                      <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B]">
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Guia Didático</p>
                        <p className="text-xs font-bold text-white mt-1 truncate">
                          {currentBook.book_metadata.characters.map((c) => c.name).join(' & ')}
                        </p>
                      </div>
                    </div>

                    {/* How it works Banner */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/30 to-[#0A162D] border border-cyan-500/20 space-y-2">
                      <div className="flex items-center space-x-2 text-cyan-300 font-bold text-xs">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span>Como utilizar o Gerador de Apostilas:</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        1. Digite a disciplina, assunto e público nos campos à esquerda.<br />
                        2. Escolha o estilo artístico e o <strong className="text-white">Tema de Cores</strong> com filtros CSS automáticos.<br />
                        3. Clique em <strong className="text-white">"Prompt da apostila"</strong> para obter os prompts de difusão ou <strong className="text-white">"Gerar Apostila Completa"</strong> para quadrinhos interativos!
                      </p>
                    </div>

                    {/* Sample Preview Panels */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                          Amostra de Painéis da Apostila Ativa
                        </h3>
                        {currentBook.book_metadata.color_theme && currentBook.book_metadata.color_theme !== 'default' && (
                          <span className="text-[10px] font-mono font-bold uppercase text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800">
                            Filtro Ativo: {COLOR_THEMES[currentBook.book_metadata.color_theme]?.shortLabel}
                          </span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentBook.pages[0]?.panels.slice(0, 2).map((panel, idx) => (
                          <div
                            key={idx}
                            className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2 transition-[filter] duration-300"
                            style={{
                              filter:
                                COLOR_THEMES[currentBook.book_metadata.color_theme || 'default']?.cssFilter ||
                                'none',
                            }}
                          >
                            <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">
                              Painel {panel.panel_index} • {panel.camera_angle}
                            </span>
                            <p className="text-xs font-semibold text-white line-clamp-2">
                              {panel.narration_box}
                            </p>
                            <p className="text-[11px] text-slate-400 italic line-clamp-2">
                              "{panel.bubbles[0]?.text}"
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: CRIAR IMAGENS ÚNICAS (Prompt Customizado) */}
          {activeSidebarTab === 'imagem_unica' && (
            <SingleImageGenerator
              defaultTopic={formData.assunto || currentBook.book_metadata.topic}
              defaultArtStyle={formData.artStyle || currentBook.book_metadata.art_style}
              onInsertIntoBooklet={handleInsertSingleImage}
              onGoToBooklet={() => setActiveSidebarTab('paginas')}
            />
          )}

          {/* TAB 2: APOSTILA +PÁGINAS (Interactive Reader Modes) */}
          {activeSidebarTab === 'paginas' && (
            <div className="w-full">
              {readerViewMode === 'webtoon' && (
                <WebtoonReader
                  book={currentBook}
                  onUpdatePanel={handleUpdatePanel}
                  onOpenBubbleEditor={handleOpenBubbleEditor}
                  onAddBubble={handleAddBubble}
                  onChangeColorTheme={handleChangeColorTheme}
                />
              )}

              {readerViewMode === 'comic_book' && (
                <GraphicNovelReader
                  book={currentBook}
                  onUpdatePanel={handleUpdatePanel}
                  onOpenBubbleEditor={handleOpenBubbleEditor}
                  onAddBubble={handleAddBubble}
                  onChangeColorTheme={handleChangeColorTheme}
                />
              )}

              {readerViewMode === 'print_a4' && (
                <A4BookletPrintView
                  book={currentBook}
                  onUpdatePanel={handleUpdatePanel}
                  onOpenBubbleEditor={handleOpenBubbleEditor}
                  onAddBubble={handleAddBubble}
                  onChangeColorTheme={handleChangeColorTheme}
                />
              )}

              {readerViewMode === 'json_schema' && (
                <StoryboardJsonViewer
                  book={currentBook}
                  onImportJson={(imported) => setCurrentBook(imported)}
                />
              )}
            </div>
          )}

          {/* TAB 3: GERADOR DE ATIVIDADES */}
          {activeSidebarTab === 'atividades' && (
            <ActivitiesViewer
              topic={formData.assunto || currentBook.book_metadata.topic}
              disciplina={formData.disciplina}
              publico={formData.publico}
              nivel={formData.nivel}
              onGoToBooklet={() => setActiveSidebarTab('paginas')}
            />
          )}

          {/* TAB 4: CAPAS */}
          {activeSidebarTab === 'capas' && (
            <CapasViewer
              title={currentBook.book_metadata.title}
              topic={formData.assunto || currentBook.book_metadata.topic}
              mentor={formData.mentor.name}
              learner={formData.learner.name}
              currentStyle={formData.artStyle}
              onApplyStyle={(newStyle: ArtStyle) => {
                setFormData((prev) => ({ ...prev, artStyle: newStyle }));
                setCurrentBook((prev) => ({
                  ...prev,
                  book_metadata: { ...prev.book_metadata, art_style: newStyle },
                }));
              }}
              onGoToBooklet={() => setActiveSidebarTab('paginas')}
            />
          )}

          {/* TAB 5: MEUS PROJETOS */}
          {activeSidebarTab === 'projetos' && (
            <ProjetosViewer
              currentBook={currentBook}
              onSelectBook={(selected) => {
                setCurrentBook(selected);
                setFormData((prev) => ({
                  ...prev,
                  assunto: selected.book_metadata.topic,
                  disciplina: 'Geral',
                  artStyle: selected.book_metadata.art_style,
                }));
                setActiveSidebarTab('paginas');
              }}
              onNewBooklet={handleNewBooklet}
            />
          )}

          {/* TAB 6: TREINAMENTOS */}
          {activeSidebarTab === 'treinamentos' && (
            <div className="max-w-4xl mx-auto p-6 bg-[#080D1A] border border-[#16233B] rounded-2xl shadow-xl space-y-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Treinamentos & Boas Práticas Pedagógicas</h2>
                  <p className="text-xs text-slate-400">Como criar apostilas de quadrinhos que maximizam a retenção dos alunos.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <h3 className="font-bold text-cyan-300 text-sm">1. O Método Mentor & Aprendiz</h3>
                  <p className="leading-relaxed">
                    Sempre use o personagem aprendiz para fazer a pergunta que o aluno real faria na sala de aula. Isso valida a dúvida e remove o medo de conceitos complexos.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <h3 className="font-bold text-cyan-300 text-sm">2. Metáforas Visuais Tangíveis</h3>
                  <p className="leading-relaxed">
                    Ao invés de definir termos abstratos apenas com texto, relacione-os a objetos do dia a dia (ex: protocolo de rede como carteiros e envelopes postais).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <h3 className="font-bold text-cyan-300 text-sm">3. Zero Texto nas Imagens de Difusão</h3>
                  <p className="leading-relaxed">
                    Modelos de difusão como Midjourney ou Flux costumam distorcer textos. O ComicDocs AI sobrepõe balões vetoriais nítidos em SVG diretamente sobre a arte.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <h3 className="font-bold text-cyan-300 text-sm">4. Ritmo Sequencial por Página</h3>
                  <p className="leading-relaxed">
                    Mantenha entre 3 e 4 painéis por página: Apresentação do Problema &rarr; Metáfora Visual &rarr; Diagrama Técnico &rarr; Resolução e Síntese.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: NOVIDADES */}
          {activeSidebarTab === 'novidades' && (
            <div className="max-w-4xl mx-auto p-6 bg-[#080D1A] border border-[#16233B] rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Novidades da Plataforma</h2>
                  <p className="text-xs text-slate-400">Atualizações recentes do Gerador de Apostilas AI.</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B]">
                  <span className="text-cyan-400 font-mono font-bold">Versão 2.4</span>
                  <h3 className="text-white font-bold mt-1">Geração de Prompt da Apostila para Midjourney v6 e Flux.1 Dev</h3>
                  <p className="text-slate-400 mt-1">Extração automática de prompts otimizados de capa e painéis sequenciais com espaço negativo para balões.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B]">
                  <span className="text-cyan-400 font-mono font-bold">Versão 2.3</span>
                  <h3 className="text-white font-bold mt-1">Suporte aos estilos Mangá, Anime, Cartoon e Chibi</h3>
                  <p className="text-slate-400 mt-1">Adicionados 8 estilos estéticos para atender tanto crianças quanto vestibulandos e concurseiros.</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: MAIS PRODUTOS */}
          {activeSidebarTab === 'produtos' && (
            <div className="max-w-4xl mx-auto p-6 bg-[#080D1A] border border-[#16233B] rounded-2xl shadow-xl space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white font-sans">Ecossistema Educacional AI</h2>
                  <p className="text-xs text-slate-400">Ferramentas complementares para professores, criadores e estudantes.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <span className="text-cyan-400 font-mono font-bold">Módulo Pro</span>
                  <h3 className="text-white font-bold">Gerador de Slides Interativos</h3>
                  <p className="text-slate-400">Transforme qualquer apostila em apresentação 16:9 para projetores.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <span className="text-cyan-400 font-mono font-bold">Módulo Avaliação</span>
                  <h3 className="text-white font-bold">Banco de Provas & Simulados</h3>
                  <p className="text-slate-400">Geração de questões com gabarito alinhadas à BNCC e vestibulares.</p>
                </div>

                <div className="p-4 rounded-xl bg-[#050A14] border border-[#16233B] space-y-2">
                  <span className="text-cyan-400 font-mono font-bold">Módulo Áudio</span>
                  <h3 className="text-white font-bold">Podcast Didático dos Personagens</h3>
                  <p className="text-slate-400">Roteiros de áudio encenados entre o Mentor e o Aprendiz.</p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Global Visual Prompt Assistant Modal */}
      {isGlobalPromptAssistantOpen && (
        <VisualPromptAssistant
          topic={currentBook.book_metadata.topic}
          artStyle={currentBook.book_metadata.art_style}
          isModal={true}
          onClose={() => setIsGlobalPromptAssistantOpen(false)}
        />
      )}

      {/* Bubble Editor Modal */}
      {bubbleModalState.isOpen && bubbleModalState.bubble && (
        <BubbleEditorModal
          bubble={bubbleModalState.bubble}
          characters={currentBook.book_metadata.characters}
          onSave={handleSaveBubble}
          onClose={() => setBubbleModalState((prev) => ({ ...prev, isOpen: false, bubble: null }))}
        />
      )}

      {/* Help Modal for Form Topics */}
      <HelpModal
        type={helpModalType}
        onClose={() => setHelpModalType(null)}
      />
    </div>
  );
}
