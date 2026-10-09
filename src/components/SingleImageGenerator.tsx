import React, { useState } from 'react';
import {
  Sparkles,
  Wand2,
  Download,
  Copy,
  Check,
  Plus,
  RefreshCw,
  Sliders,
  Image as ImageIcon,
  Palette,
  Camera,
  Layers,
  ArrowRight,
  Maximize2,
  MessageSquare,
  BookOpen,
  Info,
  Clock,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ArtStyle, CameraAngle, ColorThemeId, AspectRatioOption, GeneratedSingleImage } from '../types/comic';
import { ART_STYLES } from '../data/styles';
import { COLOR_THEMES, COLOR_THEME_LIST } from '../data/colorThemes';

interface SingleImageGeneratorProps {
  onInsertIntoBooklet?: (image: GeneratedSingleImage) => void;
  onGoToBooklet?: () => void;
  defaultTopic?: string;
  defaultArtStyle?: ArtStyle;
}

const PRESET_IDEAS = [
  {
    label: 'Ciclo da Água',
    prompt: 'Evaporação, condensação e precipitação da água na atmosfera da Terra, com montanhas e oceano em corte transversal esquemático',
    style: 'cartoon_educacional' as ArtStyle,
    ar: '3:4' as AspectRatioOption,
  },
  {
    label: 'Célula Eucarionte 3D',
    prompt: 'Corte tridimensional detalhado de uma célula animal com núcleo celular, mitocôndrias luminosas e retículo endoplasmático em cores vibrantes',
    style: 'scientific_illustration' as ArtStyle,
    ar: '1:1' as AspectRatioOption,
  },
  {
    label: 'Robô Mentor de IA',
    prompt: 'Robô androide amigável com tela holográfica azul demonstrando algoritmos e árvores de decisão para estudantes em laboratório de informática',
    style: 'futuristic_digital' as ArtStyle,
    ar: '16:9' as AspectRatioOption,
  },
  {
    label: 'Revolução Industrial',
    prompt: 'Locomotiva a vapor pioneira e fábrica com engrenagens de ferro, iluminação a carvão e chaminés históricas em estilo gravura didática',
    style: 'hand_drawn' as ArtStyle,
    ar: '4:3' as AspectRatioOption,
  },
  {
    label: 'Teoria da Relatividade',
    prompt: 'Malha do espaço-tempo curvada pela massa de uma estrela brilhante, com raios de luz se curvando ao redor do campo gravitacional',
    style: 'infografico_moderno' as ArtStyle,
    ar: '3:4' as AspectRatioOption,
  },
];

export const SingleImageGenerator: React.FC<SingleImageGeneratorProps> = ({
  onInsertIntoBooklet,
  onGoToBooklet,
  defaultTopic = '',
  defaultArtStyle = 'cartoon_educacional',
}) => {
  // Form State
  const [userPrompt, setUserPrompt] = useState(
    defaultTopic
      ? `Ilustração didática e explicativa sobre ${defaultTopic}, com detalhes conceituais nítidos e iluminação cinematográfica`
      : 'Robô mentor Dr. Byte demonstrando o funcionamento de pacotes de dados TCP/IP com esferas luminosas em um laboratório futurista'
  );
  const [selectedStyle, setSelectedStyle] = useState<ArtStyle>(defaultArtStyle);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioOption>('3:4');
  const [cameraAngle, setCameraAngle] = useState<CameraAngle>('wide-angle');
  const [colorTheme, setColorTheme] = useState<ColorThemeId>('default');
  const [engine, setEngine] = useState<'gemini-nano-banana-2.1' | 'gemini-3.1-flash-lite-image'>('gemini-nano-banana-2.1');
  const [imageSize, setImageSize] = useState<'1K' | '2K'>('1K');

  // Comic Overlay Options
  const [showSpeechBubble, setShowSpeechBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState('Olhe como este conceito se conecta!');
  const [showNarration, setShowNarration] = useState(false);
  const [narrationText, setNarrationText] = useState('ETAPA 1 • Fundamento visual do processo');

  // Generation & Status State
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [currentImage, setCurrentImage] = useState<GeneratedSingleImage | null>(null);
  const [history, setHistory] = useState<GeneratedSingleImage[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [insertedNotification, setInsertedNotification] = useState<string | null>(null);

  // Active theme definition
  const activeThemeDef = COLOR_THEMES[colorTheme] || COLOR_THEMES.default;

  // Handle Quick Copy
  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  // 1. Optimize Prompt with Gemini
  const handleOptimizePrompt = async () => {
    if (!userPrompt.trim()) return;
    setIsOptimizing(true);
    setStatusMessage('Otimizando prompt com engenharia de difusão Nano Banana...');

    try {
      const res = await fetch('/api/optimize-visual-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_prompt: userPrompt,
          art_style: selectedStyle,
          camera_angle: cameraAngle,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.optimized_prompt) {
          setUserPrompt(data.optimized_prompt);
          setStatusMessage('Prompt refinado com sucesso para máxima fidelidade visual!');
          setTimeout(() => setStatusMessage(null), 3500);
        }
      }
    } catch (err) {
      console.error(err);
      setStatusMessage('Não foi possível otimizar o prompt agora.');
    } finally {
      setIsOptimizing(false);
    }
  };

  // 2. Generate Single Image
  const handleGenerateImage = async () => {
    if (!userPrompt.trim()) return;
    setIsGenerating(true);
    const engineLabel = engine === 'gemini-nano-banana-2.1' ? 'Nano Banana 🍌' : 'Flash Lite';
    setStatusMessage(`Renderizando imagem com ${engineLabel} diretamente na ferramenta...`);

    try {
      const res = await fetch('/api/generate-single-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userPrompt.trim(),
          art_style: selectedStyle,
          aspect_ratio: aspectRatio,
          camera_angle: cameraAngle,
          color_theme: colorTheme,
          speech_bubble: showSpeechBubble ? bubbleText : undefined,
          narration: showNarration ? narrationText : undefined,
          engine,
          image_size: imageSize,
        }),
      });

      if (!res.ok) {
        throw new Error('Falha na resposta do servidor.');
      }

      const data = await res.json();
      const generated: GeneratedSingleImage = {
        id: `img_${Date.now()}`,
        prompt: userPrompt,
        optimizedPrompt: data.optimizedPrompt || userPrompt,
        artStyle: selectedStyle,
        aspectRatio,
        cameraAngle,
        colorTheme,
        imageUrl: data.imageUrl,
        midjourneyCommand: data.midjourneyCommand || '',
        fluxPrompt: data.fluxPrompt || '',
        source: data.source || 'ai_generated',
        engine,
        modelUsed: data.modelUsed || engine,
        imageSize,
        quotaNotice: data.quotaNotice,
        speechBubbleText: showSpeechBubble ? bubbleText : undefined,
        narrationText: showNarration ? narrationText : undefined,
        createdAt: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      };

      setCurrentImage(generated);
      setHistory((prev) => [generated, ...prev.slice(0, 11)]);
      if (data.quotaNotice) {
        setStatusMessage(data.quotaNotice);
      } else if (data.modelUsed?.includes('nano-banana')) {
        setStatusMessage('Imagem criada com sucesso com Nano Banana 🍌!');
      } else if (data.modelUsed?.includes('flash-lite')) {
        setStatusMessage('Imagem criada com sucesso com Gemini Flash Lite ⚡!');
      } else {
        setStatusMessage('Cena vetorial de alta definição gerada com sucesso na proporção escolhida!');
      }
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.warn('Erro ao processar imagem única:', err?.message || err);
      setStatusMessage('Não foi possível conectar ao gerador de imagens. Verifique sua conexão.');
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Download Image
  const handleDownload = () => {
    if (!currentImage?.imageUrl) return;
    const a = document.createElement('a');
    a.href = currentImage.imageUrl;
    const safeName = currentImage.prompt
      .slice(0, 30)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-');
    a.download = `imagem-unica-${safeName || 'gerada'}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // 4. Insert into Booklet
  const handleInsert = () => {
    if (!currentImage || !onInsertIntoBooklet) return;
    onInsertIntoBooklet(currentImage);
    setInsertedNotification('Imagem inserida na apostila como novo painel com sucesso!');
    setTimeout(() => setInsertedNotification(null), 4000);
  };

  // Aspect ratio helper CSS class
  const getAspectRatioClass = (ar: AspectRatioOption) => {
    switch (ar) {
      case '1:1':
        return 'aspect-square';
      case '3:4':
        return 'aspect-[3/4]';
      case '4:3':
        return 'aspect-[4/3]';
      case '16:9':
        return 'aspect-[16/9]';
      case '9:16':
        return 'aspect-[9/16]';
      default:
        return 'aspect-[3/4]';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 sm:p-6 space-y-7">
      {/* Top Banner & Header */}
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_#000000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000] flex items-center space-x-1">
              <span>🍌</span>
              <span>Motor Nano Banana 2.1</span>
            </span>
            <span className="text-xs text-amber-200/90 font-comic">
              GibiToon Studio • Criação de Artes Sob Demanda
            </span>
          </div>
          <h1 className="text-2xl font-cartoon font-extrabold text-amber-400 tracking-wide flex items-center space-x-2 drop-shadow-[1px_1px_0px_#000]">
            <span>Criador de Imagens & Painéis Soltos</span>
            <span>🍌</span>
          </h1>
          <p className="text-xs text-slate-300 font-comic mt-1 max-w-2xl leading-relaxed">
            Desenhe ilustrações individuais no estilo do gibi diretamente nesta ferramenta com o poder do <strong>Nano Banana</strong>, resoluções 1K/2K, balões vetoriais e filtros de cores instantâneos.
          </p>
        </div>

        {onGoToBooklet && (
          <button
            onClick={onGoToBooklet}
            className="flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-cartoon-cyan text-xs font-cartoon font-bold transition shrink-0 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Voltar para o Gibi</span>
          </button>
        )}
      </div>

      {/* Preset Ideas Pills */}
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-slate-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ideias Rápidas para Testar:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_IDEAS.map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUserPrompt(preset.prompt);
                setSelectedStyle(preset.style);
                setAspectRatio(preset.ar);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#0B1324] hover:bg-[#142342] border border-[#182642] text-xs font-medium text-slate-300 hover:text-white transition flex items-center space-x-1.5 cursor-pointer"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
              <span>{preset.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">
        {/* LEFT COLUMN: Controls & Prompt Form (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          <div className="bg-[#080D1A] border border-[#16233B] rounded-2xl p-5 shadow-xl space-y-5">
            {/* 1. Prompt Input Area */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 font-sans flex items-center space-x-1.5">
                  <span>1. Prompt da Imagem (Descrição da Cena)</span>
                  <span className="text-cyan-400">*</span>
                </label>
                <button
                  type="button"
                  onClick={handleOptimizePrompt}
                  disabled={isOptimizing || !userPrompt.trim()}
                  className="flex items-center space-x-1 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 disabled:opacity-40 transition cursor-pointer"
                  title="Refinar prompt com Gemini para maior qualidade em modelos de difusão"
                >
                  <Wand2 className={`w-3 h-3 ${isOptimizing ? 'animate-spin' : ''}`} />
                  <span>{isOptimizing ? 'Refinando...' : 'Refinar com IA'}</span>
                </button>
              </div>

              <textarea
                value={userPrompt}
                onChange={(e) => setUserPrompt(e.target.value)}
                rows={4}
                placeholder="Descreva detalhadamente o que você quer ver na ilustração..."
                className="w-full bg-[#050A14] border border-[#16233B] focus:border-cyan-500 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none transition leading-relaxed resize-y"
              />
              <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                <span>Dica: Descreva iluminação, ação pedagógica e atmosfera</span>
                <span>{userPrompt.length} caracteres</span>
              </div>
            </div>

            {/* 2. Art Style Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 font-sans block">
                2. Estilo Artístico
              </label>
              <select
                value={selectedStyle}
                onChange={(e) => setSelectedStyle(e.target.value as ArtStyle)}
                className="w-full bg-[#050A14] border border-[#16233B] focus:border-cyan-500 rounded-xl px-3 py-2.5 text-xs text-white font-bold cursor-pointer focus:outline-none"
              >
                {Object.entries(ART_STYLES).map(([key, def]) => (
                  <option key={key} value={key} className="bg-neutral-950 text-white">
                    {def.name} • {def.tag} ({def.origin})
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-400 italic">
                {ART_STYLES[selectedStyle]?.description}
              </p>
            </div>

            {/* 3. Proporção da Imagem (Aspect Ratio) */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 font-sans block">
                3. Proporção de Tela (Aspect Ratio)
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { id: '1:1', label: '1:1', sub: 'Quadrado' },
                  { id: '3:4', label: '3:4', sub: 'A4 / HQ' },
                  { id: '4:3', label: '4:3', sub: 'Horizontal' },
                  { id: '16:9', label: '16:9', sub: 'Widescreen' },
                  { id: '9:16', label: '9:16', sub: 'Webtoon' },
                ].map((item) => {
                  const isSelected = aspectRatio === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setAspectRatio(item.id as AspectRatioOption)}
                      className={`p-2 rounded-xl text-center transition flex flex-col items-center justify-center cursor-pointer border ${
                        isSelected
                          ? 'bg-cyan-500/15 border-cyan-400 text-white shadow-sm'
                          : 'bg-[#050A14] border-[#16233B] text-slate-400 hover:text-white hover:border-[#22365C]'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold leading-none">{item.label}</span>
                      <span className="text-[9px] text-slate-400 mt-0.5 truncate">{item.sub}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 4. Enquadramento e Ângulo de Câmera */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-200 font-sans block">
                4. Ângulo & Enquadramento de Câmera
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {[
                  { id: 'wide-angle', label: 'Panorâmico' },
                  { id: 'medium-shot', label: 'Médio' },
                  { id: 'close-up', label: 'Detalhe' },
                  { id: 'isometric', label: 'Isométrico' },
                  { id: 'bird-eye', label: 'Aéreo' },
                ].map((item) => {
                  const isSelected = cameraAngle === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setCameraAngle(item.id as CameraAngle)}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-medium transition cursor-pointer border text-center ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-bold'
                          : 'bg-[#050A14] border-[#16233B] text-slate-400 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Tema de Cores (Filtro CSS Automático) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 font-sans flex items-center space-x-1.5">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>5. Tema de Cores (Filtro CSS dos Painéis)</span>
                </label>
                <span className="text-[10px] font-mono text-cyan-400">
                  {activeThemeDef.name}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {COLOR_THEME_LIST.slice(0, 6).map((theme) => {
                  const isSelected = colorTheme === theme.id;
                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setColorTheme(theme.id)}
                      className={`p-2 rounded-xl text-left transition flex items-center space-x-2 border cursor-pointer ${
                        isSelected
                          ? 'bg-[#101C38] border-cyan-400 text-white'
                          : 'bg-[#050A14] border-[#16233B] text-slate-300 hover:text-white'
                      }`}
                    >
                      <div className={`w-3.5 h-3.5 rounded-full shrink-0 ${theme.previewGradient} border border-white/20`} />
                      <div className="min-w-0">
                        <p className="text-[11px] font-bold truncate">{theme.shortLabel}</p>
                        <p className="text-[9px] text-slate-500 font-mono truncate">{theme.cssFilter}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Dropdown for remaining themes */}
              <select
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value as ColorThemeId)}
                className="w-full bg-[#050A14] border border-[#16233B] rounded-lg px-2.5 py-1.5 text-xs text-slate-300 cursor-pointer focus:outline-none"
              >
                {COLOR_THEME_LIST.map((theme) => (
                  <option key={theme.id} value={theme.id} className="bg-neutral-950 text-white">
                    {theme.name} — {theme.description}
                  </option>
                ))}
              </select>
            </div>

            {/* 6. Motor de IA na Ferramenta (Nano Banana) */}
            <div className="p-3.5 rounded-xl bg-[#0B1528] border border-amber-500/30 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-amber-300 font-sans flex items-center space-x-1.5">
                  <span className="text-sm">🍌</span>
                  <span>6. Motor de Criação na Ferramenta</span>
                </label>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Google IA
                </span>
              </div>

              {/* Engine Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setEngine('gemini-nano-banana-2.1')}
                  className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                    engine === 'gemini-nano-banana-2.1'
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-sm'
                      : 'bg-[#050A14] border-[#16233B] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="text-sm">🍌</span>
                    <span className="text-xs font-bold text-amber-300">Nano Banana 2.1</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    Alta fidelidade, resolução 1K/2K e difusão de última geração na ferramenta
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setEngine('gemini-3.1-flash-lite-image')}
                  className={`p-2.5 rounded-xl text-left border transition cursor-pointer ${
                    engine === 'gemini-3.1-flash-lite-image'
                      ? 'bg-cyan-500/20 border-cyan-400 text-white shadow-sm'
                      : 'bg-[#050A14] border-[#16233B] text-slate-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-1.5 mb-1">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-bold text-cyan-300">Flash Lite Image</span>
                  </div>
                  <p className="text-[10px] text-slate-300 leading-snug">
                    Geração rápida otimizada para esboços e rascunhos velozes
                  </p>
                </button>
              </div>

              {/* Resolution options when Nano Banana is active */}
              {engine === 'gemini-nano-banana-2.1' && (
                <div className="flex items-center justify-between pt-1 border-t border-[#16233B]">
                  <span className="text-[11px] text-slate-300 font-medium flex items-center space-x-1">
                    <Maximize2 className="w-3 h-3 text-amber-400" />
                    <span>Resolução do Nano Banana:</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {(['1K', '2K'] as const).map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => setImageSize(sz)}
                        className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border ${
                          imageSize === sz
                            ? 'bg-amber-500/25 border-amber-400 text-amber-200'
                            : 'bg-[#050A14] border-[#16233B] text-slate-400 hover:text-white'
                        }`}
                      >
                        {sz} {sz === '1K' ? '(Padrão HD)' : '(Ultra HD)'}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 7. Comic Overlays (Balão de Fala / Narração) */}
            <div className="p-3.5 rounded-xl bg-[#050A14] border border-[#16233B] space-y-3">
              <span className="text-xs font-bold text-slate-300 block">
                7. Elementos Gráficos de Quadrinhos (Opcional)
              </span>

              {/* Toggle Speech Bubble */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={showSpeechBubble}
                    onChange={(e) => setShowSpeechBubble(e.target.checked)}
                    className="rounded bg-[#080D1A] border-[#1E2C48] text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Adicionar Balão de Fala Vetorial</span>
                </label>
                {showSpeechBubble && (
                  <input
                    type="text"
                    value={bubbleText}
                    onChange={(e) => setBubbleText(e.target.value)}
                    placeholder="Texto do balão..."
                    className="w-full bg-[#080D1A] border border-[#182642] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                )}
              </div>

              {/* Toggle Narration Box */}
              <div className="space-y-1.5">
                <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-300">
                  <input
                    type="checkbox"
                    checked={showNarration}
                    onChange={(e) => setShowNarration(e.target.checked)}
                    className="rounded bg-[#080D1A] border-[#1E2C48] text-cyan-500 focus:ring-0 cursor-pointer"
                  />
                  <span>Adicionar Caixa de Narração Didática</span>
                </label>
                {showNarration && (
                  <input
                    type="text"
                    value={narrationText}
                    onChange={(e) => setNarrationText(e.target.value)}
                    placeholder="Legenda ou resumo pedagógico..."
                    className="w-full bg-[#080D1A] border border-[#182642] rounded-lg px-2.5 py-1.5 text-xs text-white"
                  />
                )}
              </div>
            </div>

            {/* Generate Action Button */}
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={isGenerating || !userPrompt.trim()}
              className="w-full py-3.5 px-4 rounded-xl btn-cartoon-yellow text-sm tracking-wider flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-neutral-950 stroke-[3]" />
                  <span>Desenhando com {engine === 'gemini-nano-banana-2.1' ? 'Nano Banana 🍌' : 'IA'}...</span>
                </>
              ) : (
                <>
                  <span className="text-base">🍌</span>
                  <span>{engine === 'gemini-nano-banana-2.1' ? 'Desenhar com Nano Banana' : 'Desenhar com Flash Lite'}</span>
                </>
              )}
            </button>

            {statusMessage && (
              <p className="text-center text-xs font-mono text-cyan-400 animate-pulse">
                {statusMessage}
              </p>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Interactive Canvas & Output Panel (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-[#080D1A] border border-[#16233B] rounded-2xl p-5 sm:p-6 shadow-2xl space-y-5">
            {/* Canvas Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#16233B]">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                  Visualizador da Imagem Única
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#101C38] text-cyan-300 border border-cyan-500/20">
                  {aspectRatio}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#142340] text-amber-300 border border-amber-500/20">
                  {activeThemeDef.shortLabel}
                </span>
                {currentImage && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center space-x-1">
                    <span>🍌</span>
                    <span>
                      {currentImage.modelUsed?.includes('nano-banana')
                        ? `Nano Banana 2.1 (${currentImage.imageSize || '1K'})`
                        : currentImage.modelUsed?.includes('flash')
                        ? 'Flash Lite'
                        : 'Vetor Estilizado'}
                    </span>
                  </span>
                )}
              </div>

              {currentImage && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleDownload}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111C38] hover:bg-[#182B50] text-cyan-300 text-xs font-bold transition border border-cyan-500/30 cursor-pointer"
                    title="Baixar arquivo de imagem"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Baixar PNG</span>
                  </button>

                  {onInsertIntoBooklet && (
                    <button
                      onClick={handleInsert}
                      className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-200 text-neutral-950 text-xs font-black transition shadow-lg cursor-pointer"
                      title="Inserir esta imagem como painel na apostila atual"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Inserir na Apostila</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {insertedNotification && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <Check className="w-4 h-4" />
                <span>{insertedNotification}</span>
              </div>
            )}

            {currentImage?.quotaNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center space-x-2">
                <span className="text-sm">💡</span>
                <span className="leading-relaxed">{currentImage.quotaNotice}</span>
              </div>
            )}

            {/* IMAGE CANVAS CONTAINER */}
            <div className="w-full flex items-center justify-center p-2 sm:p-4 bg-[#050A14] rounded-2xl border border-[#16233B]">
              {currentImage ? (
                <div
                  className={`w-full max-w-lg rounded-xl overflow-hidden relative shadow-2xl border border-[#22365C] ${getAspectRatioClass(
                    currentImage.aspectRatio
                  )}`}
                >
                  {/* Image with dynamic CSS Filter applied */}
                  <div
                    className="w-full h-full"
                    style={{
                      filter: activeThemeDef.cssFilter !== 'none' ? activeThemeDef.cssFilter : undefined,
                      transition: 'filter 0.3s ease-in-out',
                    }}
                  >
                    <img
                      src={currentImage.imageUrl}
                      alt={currentImage.prompt}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Overlaid Speech Bubble */}
                  {currentImage.speechBubbleText && (
                    <div className="absolute top-4 left-4 max-w-[70%] z-10 animate-fade-in pointer-events-none">
                      <div className="bg-white text-neutral-950 px-3.5 py-2 rounded-2xl shadow-xl border-2 border-black font-comic font-bold text-xs relative">
                        <p className="leading-snug">{currentImage.speechBubbleText}</p>
                        <div className="w-3 h-3 bg-white border-b-2 border-r-2 border-black rotate-45 absolute -bottom-1.5 left-4" />
                      </div>
                    </div>
                  )}

                  {/* Overlaid Narration Box */}
                  {currentImage.narrationText && (
                    <div className="absolute bottom-3 inset-x-3 z-10 animate-fade-in pointer-events-none">
                      <div className="bg-amber-300/95 text-neutral-950 px-3 py-1.5 rounded-lg shadow-lg border-2 border-black font-sans font-bold text-[11px] uppercase tracking-wide">
                        {currentImage.narrationText}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty placeholder before first generation */
                <div className="w-full max-w-md aspect-[3/4] rounded-xl border-2 border-dashed border-[#182642] flex flex-col items-center justify-center p-6 text-center space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm">Nenhuma imagem gerada ainda</h3>
                    <p className="text-slate-500 text-xs mt-1 max-w-xs">
                      Digite sua ideia no formulário ao lado e clique em "Gerar Imagem Única" para visualizar o resultado em alta resolução.
                    </p>
                  </div>
                  <button
                    onClick={handleGenerateImage}
                    disabled={isGenerating}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-neutral-950 text-xs font-black transition cursor-pointer"
                  >
                    Gerar Exemplo Inicial
                  </button>
                </div>
              )}
            </div>

            {/* Diffusion Commands & Prompts Box */}
            {currentImage && (
              <div className="bg-[#050A14] border border-[#16233B] rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 font-sans flex items-center space-x-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Prompts Prontos para Geradores Externos</span>
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Midjourney v6 • Flux.1 • SDXL
                  </span>
                </div>

                {/* Midjourney Command */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-cyan-400">Comando Midjourney v6:</span>
                    <button
                      onClick={() => handleCopy(currentImage.midjourneyCommand, 'mj')}
                      className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 cursor-pointer"
                    >
                      {copiedKey === 'mj' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'mj' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="bg-[#02050D] p-2.5 rounded-lg border border-[#111C33] text-[11px] font-mono text-slate-300 select-all overflow-x-auto">
                    {currentImage.midjourneyCommand}
                  </div>
                </div>

                {/* Flux Prompt */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="font-mono text-amber-400">Prompt Flux.1 Dev:</span>
                    <button
                      onClick={() => handleCopy(currentImage.fluxPrompt, 'flux')}
                      className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 cursor-pointer"
                    >
                      {copiedKey === 'flux' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'flux' ? 'Copiado!' : 'Copiar'}</span>
                    </button>
                  </div>
                  <div className="bg-[#02050D] p-2.5 rounded-lg border border-[#111C33] text-[11px] font-mono text-slate-300 select-all overflow-x-auto">
                    {currentImage.fluxPrompt}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Session History Gallery */}
          {history.length > 0 && (
            <div className="bg-[#080D1A] border border-[#16233B] rounded-2xl p-5 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-sans flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Galeria de Imagens Criadas Nesta Sessão ({history.length})</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Clique em uma imagem para restaurar no visualizador
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {history.map((item) => {
                  const isSelected = currentImage?.id === item.id;
                  const itemThemeDef = COLOR_THEMES[item.colorTheme] || COLOR_THEMES.default;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setCurrentImage(item);
                        setColorTheme(item.colorTheme);
                        setAspectRatio(item.aspectRatio);
                        setSelectedStyle(item.artStyle);
                      }}
                      className={`group rounded-xl overflow-hidden border p-1.5 transition text-left cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#101E3C] border-cyan-400 shadow-md shadow-cyan-950/40'
                          : 'bg-[#050A14] border-[#16233B] hover:border-[#22365C]'
                      }`}
                    >
                      <div
                        className="w-full h-24 rounded-lg overflow-hidden bg-black mb-2"
                        style={{
                          filter: itemThemeDef.cssFilter !== 'none' ? itemThemeDef.cssFilter : undefined,
                        }}
                      >
                        <img
                          src={item.imageUrl}
                          alt={item.prompt}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="text-[10px] font-bold text-white truncate px-1">
                        {item.prompt}
                      </p>
                      <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono px-1 mt-1">
                        <span>{item.aspectRatio}</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
