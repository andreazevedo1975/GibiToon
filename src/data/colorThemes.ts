import { ColorThemeId } from '../types/comic';

export interface ColorThemeDefinition {
  id: ColorThemeId;
  name: string;
  shortLabel: string;
  description: string;
  cssFilter: string;
  tailwindBorder: string;
  previewGradient: string;
  swatchColors: [string, string, string];
  tag: string;
}

export const COLOR_THEMES: Record<ColorThemeId, ColorThemeDefinition> = {
  default: {
    id: 'default',
    name: 'Padrão (Cores Originais)',
    shortLabel: 'Original',
    description: 'Sem filtros. Mantém a paleta cromática natural e traço nativo do estilo visual.',
    cssFilter: 'none',
    tailwindBorder: 'border-slate-500',
    previewGradient: 'from-blue-500 via-emerald-400 to-amber-400',
    swatchColors: ['#3b82f6', '#10b981', '#f59e0b'],
    tag: 'Fidelidade Original',
  },
  sepia: {
    id: 'sepia',
    name: 'Sépia Vintage',
    shortLabel: 'Sépia',
    description: 'Filtro fotográfico retrô com tonalidade quente em âmbar e marrom nostálgico.',
    cssFilter: 'sepia(0.85) contrast(1.1) brightness(0.96)',
    tailwindBorder: 'border-amber-600',
    previewGradient: 'from-amber-700 via-amber-600 to-yellow-800',
    swatchColors: ['#78350f', '#b45309', '#fde68a'],
    tag: 'Nostalgia & História',
  },
  grayscale: {
    id: 'grayscale',
    name: 'Escala de Cinza (P&B Noir)',
    shortLabel: 'P&B / Cinza',
    description: 'Preto e branco puro de alto impacto, ideal para mangá clássico, HQ noir e economia na impressão.',
    cssFilter: 'grayscale(100%) contrast(1.22) brightness(0.98)',
    tailwindBorder: 'border-neutral-400',
    previewGradient: 'from-black via-neutral-600 to-neutral-200',
    swatchColors: ['#171717', '#737373', '#e5e5e5'],
    tag: 'Mangá P&B & Impressão Econômica',
  },
  vibrant: {
    id: 'vibrant',
    name: 'Vibrante (Pop Art & Alta Saturação)',
    shortLabel: 'Vibrante',
    description: 'Cores hiper-saturadas, dinâmicas e cheias de vida. Perfeito para cartoons infantis e física visual.',
    cssFilter: 'saturate(1.8) contrast(1.12) brightness(1.04)',
    tailwindBorder: 'border-pink-500',
    previewGradient: 'from-fuchsia-500 via-rose-500 to-amber-400',
    swatchColors: ['#ec4899', '#f43f5e', '#fbbf24'],
    tag: 'Super Saturo & Infantil',
  },
  warm_sun: {
    id: 'warm_sun',
    name: 'Cálido (Pôr do Sol Dourado)',
    shortLabel: 'Cálido',
    description: 'Banho de luz dourada vespertina e calor visual envolvente para biografias e narrativas históricas.',
    cssFilter: 'sepia(0.32) saturate(1.45) hue-rotate(-12deg) brightness(1.05)',
    tailwindBorder: 'border-orange-500',
    previewGradient: 'from-orange-600 via-amber-500 to-yellow-300',
    swatchColors: ['#ea580c', '#f59e0b', '#fef08a'],
    tag: 'Tarde Dourada & Aconchego',
  },
  cyber_cool: {
    id: 'cyber_cool',
    name: 'Frio Cibernético (Ciano & Azul Sci-Fi)',
    shortLabel: 'Cyber Frio',
    description: 'Filtro espectral azulado e futurista para aulas de robótica, programação e redes TCP/IP.',
    cssFilter: 'hue-rotate(170deg) saturate(1.3) contrast(1.15) brightness(0.98)',
    tailwindBorder: 'border-cyan-500',
    previewGradient: 'from-cyan-500 via-blue-600 to-indigo-900',
    swatchColors: ['#06b6d4', '#2563eb', '#1e1b4b'],
    tag: 'Tecnologia & Informática',
  },
  vintage_paper: {
    id: 'vintage_paper',
    name: 'Papel Jornal Envelhecido',
    shortLabel: 'Papel Velho',
    description: 'Simula a textura amarelada de papel jornal de gibis dos anos 60 e 70 com leve desbotamento.',
    cssFilter: 'sepia(0.6) brightness(0.92) contrast(1.18)',
    tailwindBorder: 'border-yellow-700',
    previewGradient: 'from-yellow-800 via-amber-700 to-stone-400',
    swatchColors: ['#854d0e', '#d97706', '#e7e5e4'],
    tag: 'Gibi Antigo & Retrô',
  },
  high_contrast: {
    id: 'high_contrast',
    name: 'Alto Contraste HQ',
    shortLabel: 'Alto Contraste',
    description: 'Eleva a separação entre luzes e sombras profundas, tornando as linhas de arte extremamente nítidas.',
    cssFilter: 'contrast(1.45) brightness(0.94) saturate(1.15)',
    tailwindBorder: 'border-indigo-500',
    previewGradient: 'from-indigo-950 via-purple-600 to-yellow-300',
    swatchColors: ['#1e1b4b', '#9333ea', '#fde047'],
    tag: 'Nitidez Extrema & Quadrinhos',
  },
  emerald_matrix: {
    id: 'emerald_matrix',
    name: 'Esmeralda Bio / Natureza',
    shortLabel: 'Esmeralda Bio',
    description: 'Realce esmeralda botânico, excelente para biologia celular, ecologia e botânica.',
    cssFilter: 'hue-rotate(75deg) saturate(1.25) contrast(1.1)',
    tailwindBorder: 'border-emerald-500',
    previewGradient: 'from-emerald-700 via-green-500 to-lime-300',
    swatchColors: ['#047857', '#22c55e', '#bef264'],
    tag: 'Biologia & Botânica',
  },
  rose_pastel: {
    id: 'rose_pastel',
    name: 'Doce Pastel (Lúdico Infantil)',
    shortLabel: 'Pastel Doce',
    description: 'Tons suaves açucarados em lilás e rosa pastel para alfabetização e educação infantil.',
    cssFilter: 'hue-rotate(305deg) saturate(0.92) brightness(1.08) contrast(0.96)',
    tailwindBorder: 'border-pink-400',
    previewGradient: 'from-pink-400 via-purple-300 to-rose-200',
    swatchColors: ['#f472b6', '#d8b4fe', '#fecdd3'],
    tag: 'Educação Infantil & Suavidade',
  },
};

export const COLOR_THEME_LIST = Object.values(COLOR_THEMES);
