import React from 'react';
import { ArtStyle, CameraAngle } from '../types/comic';

interface PanelIllustrationProps {
  prompt: string;
  cameraAngle: CameraAngle;
  artStyle: ArtStyle;
  imageUrl?: string;
  panelIndex: number;
}

export const PanelIllustration: React.FC<PanelIllustrationProps> = ({
  prompt,
  cameraAngle,
  artStyle,
  imageUrl,
  panelIndex,
}) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={`Ilustração do painel ${panelIndex}: ${prompt}`}
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    );
  }

  // Generate stylized thematic SVG vector scene according to prompt keywords and art style
  const lowerPrompt = prompt.toLowerCase();

  // Determine thematic visual elements
  const isNetwork =
    lowerPrompt.includes('network') ||
    lowerPrompt.includes('rede') ||
    lowerPrompt.includes('pacote') ||
    lowerPrompt.includes('tcp') ||
    lowerPrompt.includes('ip') ||
    lowerPrompt.includes('cable');
  const isServer =
    lowerPrompt.includes('server') ||
    lowerPrompt.includes('servidor') ||
    lowerPrompt.includes('handshake') ||
    lowerPrompt.includes('building') ||
    lowerPrompt.includes('computador');
  const isOcean =
    lowerPrompt.includes('ocean') ||
    lowerPrompt.includes('mar') ||
    lowerPrompt.includes('submarino') ||
    lowerPrompt.includes('fish');
  const isLibrary =
    lowerPrompt.includes('library') ||
    lowerPrompt.includes('dns') ||
    lowerPrompt.includes('owl') ||
    lowerPrompt.includes('livro');

  // Background and style themes
  const styleConfigs: Record<
    ArtStyle,
    {
      bgGradient: string;
      lineColor: string;
      accentColor: string;
      secondaryColor: string;
      paperTexture: string;
      styleBadge: string;
    }
  > = {
    // Estilos da imagem
    cartoon: {
      bgGradient: 'from-sky-950 via-slate-900 to-neutral-950',
      lineColor: '#38bdf8',
      accentColor: '#f59e0b',
      secondaryColor: '#ef4444',
      paperTexture: 'opacity-15',
      styleBadge: 'Cartoon',
    },
    hand_drawn: {
      bgGradient: 'from-slate-900 via-stone-900 to-neutral-950',
      lineColor: '#e2e8f0',
      accentColor: '#d97706',
      secondaryColor: '#94a3b8',
      paperTexture: 'opacity-25',
      styleBadge: 'Hand-drawn',
    },
    doodle: {
      bgGradient: 'from-slate-950 via-neutral-900 to-zinc-950',
      lineColor: '#f8fafc',
      accentColor: '#3b82f6',
      secondaryColor: '#10b981',
      paperTexture: 'opacity-20',
      styleBadge: 'Doodle',
    },
    cartoon_educacional: {
      bgGradient: 'from-blue-950 via-slate-900 to-neutral-950',
      lineColor: '#60a5fa',
      accentColor: '#f59e0b',
      secondaryColor: '#34d399',
      paperTexture: 'opacity-15',
      styleBadge: 'Cartoon Educacional',
    },
    scientific_illustration: {
      bgGradient: 'from-teal-950 via-slate-900 to-neutral-950',
      lineColor: '#2dd4bf',
      accentColor: '#38bdf8',
      secondaryColor: '#fbbf24',
      paperTexture: 'opacity-20',
      styleBadge: 'Scientific Illustration',
    },
    futuristic_digital: {
      bgGradient: 'from-cyan-950 via-blue-950 to-neutral-950',
      lineColor: '#06b6d4',
      accentColor: '#38bdf8',
      secondaryColor: '#a855f7',
      paperTexture: 'opacity-30',
      styleBadge: 'Futuristic Digital',
    },
    infografico_moderno: {
      bgGradient: 'from-slate-900 via-sky-950 to-neutral-950',
      lineColor: '#38bdf8',
      accentColor: '#10b981',
      secondaryColor: '#f59e0b',
      paperTexture: 'opacity-10',
      styleBadge: 'Infográfico Moderno',
    },
    minimalista: {
      bgGradient: 'from-neutral-950 via-zinc-900 to-neutral-950',
      lineColor: '#f4f4f5',
      accentColor: '#0284c7',
      secondaryColor: '#71717a',
      paperTexture: 'opacity-10',
      styleBadge: 'Minimalista',
    },
    three_d_educacional: {
      bgGradient: 'from-indigo-950 via-purple-950 to-neutral-950',
      lineColor: '#818cf8',
      accentColor: '#ec4899',
      secondaryColor: '#38bdf8',
      paperTexture: 'opacity-20',
      styleBadge: '3D Educacional',
    },
    realista: {
      bgGradient: 'from-slate-900 via-neutral-900 to-zinc-950',
      lineColor: '#cbd5e1',
      accentColor: '#d97706',
      secondaryColor: '#64748b',
      paperTexture: 'opacity-20',
      styleBadge: 'Realista',
    },
    livro_didatico: {
      bgGradient: 'from-blue-950 via-slate-900 to-neutral-950',
      lineColor: '#93c5fd',
      accentColor: '#10b981',
      secondaryColor: '#f59e0b',
      paperTexture: 'opacity-15',
      styleBadge: 'Livro Didático',
    },
    colorido_infantil: {
      bgGradient: 'from-rose-950 via-amber-950 to-neutral-950',
      lineColor: '#fb7185',
      accentColor: '#fbbf24',
      secondaryColor: '#34d399',
      paperTexture: 'opacity-25',
      styleBadge: 'Colorido Infantil',
    },
    // Estilos complementares
    modern_manga: {
      bgGradient: 'from-zinc-900 via-neutral-900 to-black',
      lineColor: '#ffffff',
      accentColor: '#38bdf8',
      secondaryColor: '#818cf8',
      paperTexture: 'opacity-20',
      styleBadge: 'Mangá Shonen',
    },
    anime_cinematic: {
      bgGradient: 'from-sky-900 via-indigo-900 to-slate-950',
      lineColor: '#38bdf8',
      accentColor: '#fbbf24',
      secondaryColor: '#f43f5e',
      paperTexture: 'opacity-30',
      styleBadge: 'Anime Cinematográfico',
    },
    cartoon_retro: {
      bgGradient: 'from-amber-200 via-red-100 to-sky-100',
      lineColor: '#000000',
      accentColor: '#ef4444',
      secondaryColor: '#3b82f6',
      paperTexture: 'comic-dots opacity-20',
      styleBadge: 'Cartoon Anos 90',
    },
    chibi_kawaii: {
      bgGradient: 'from-pink-100 via-purple-50 to-sky-100',
      lineColor: '#4c1d95',
      accentColor: '#ec4899',
      secondaryColor: '#06b6d4',
      paperTexture: 'opacity-20',
      styleBadge: 'Chibi Kawaii',
    },
    pixel_art: {
      bgGradient: 'from-emerald-950 via-slate-900 to-neutral-950',
      lineColor: '#4ade80',
      accentColor: '#facc15',
      secondaryColor: '#38bdf8',
      paperTexture: 'opacity-25',
      styleBadge: 'Pixel Art 16-Bit',
    },
    cyberpunk_noir: {
      bgGradient: 'from-neutral-950 via-purple-950 to-slate-950',
      lineColor: '#06b6d4',
      accentColor: '#ec4899',
      secondaryColor: '#a855f7',
      paperTexture: 'opacity-25',
      styleBadge: 'Cyberpunk Noir',
    },
    clean_vector_bd: {
      bgGradient: 'from-slate-100 via-sky-50 to-blue-100',
      lineColor: '#1e293b',
      accentColor: '#0d9488',
      secondaryColor: '#f97316',
      paperTexture: 'opacity-10',
      styleBadge: 'Ligne Claire',
    },
    vintage_comic: {
      bgGradient: 'from-amber-100 via-yellow-50 to-amber-200',
      lineColor: '#000000',
      accentColor: '#dc2626',
      secondaryColor: '#2563eb',
      paperTexture: 'comic-dots opacity-30',
      styleBadge: 'HQ Clássica',
    },
    watercolor_graphic_novel: {
      bgGradient: 'from-stone-200 via-amber-50 to-stone-300',
      lineColor: '#292524',
      accentColor: '#b45309',
      secondaryColor: '#0284c7',
      paperTexture: 'opacity-25',
      styleBadge: 'Graphic Novel Aquarela',
    },
  };

  const theme = styleConfigs[artStyle] || styleConfigs.clean_vector_bd;

  return (
    <div
      className={`relative w-full h-full min-h-[220px] overflow-hidden bg-gradient-to-br ${theme.bgGradient} flex items-center justify-center select-none`}
    >
      {/* Decorative background grid / halftone */}
      <div className={`absolute inset-0 pointer-events-none ${theme.paperTexture}`} />

      {/* Speed lines or rays for action & angles */}
      {cameraAngle === 'wide-angle' && (
        <svg className="absolute inset-0 w-full h-full opacity-15" preserveAspectRatio="none">
          <line x1="0" y1="0" x2="50%" y2="50%" stroke={theme.lineColor} strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1="100%" y1="0" x2="50%" y2="50%" stroke={theme.lineColor} strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1="0" y1="100%" x2="50%" y2="50%" stroke={theme.lineColor} strokeWidth="1.5" strokeDasharray="6,4" />
          <line x1="100%" y1="100%" x2="50%" y2="50%" stroke={theme.lineColor} strokeWidth="1.5" strokeDasharray="6,4" />
        </svg>
      )}

      {/* Vector Scene Compositions */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-4">
        {isOcean ? (
          // Deep ocean underwater cable scene
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[260px]">
            <defs>
              <linearGradient id="oceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#082f49" />
              </linearGradient>
            </defs>
            <rect width="400" height="240" fill="url(#oceanGrad)" />
            {/* Seabed */}
            <path d="M0,190 Q120,175 220,195 T400,185 L400,240 L0,240 Z" fill="#0f172a" />
            {/* Glowing submarine cable */}
            <path
              d="M0,200 Q150,185 260,205 T400,198"
              fill="none"
              stroke="#38bdf8"
              strokeWidth="6"
              strokeLinecap="round"
            />
            <path
              d="M0,200 Q150,185 260,205 T400,198"
              fill="none"
              stroke="#fef08a"
              strokeWidth="2"
              strokeDasharray="10,12"
            />
            {/* Bioluminescent jellyfish / fish */}
            <circle cx="120" cy="90" r="14" fill="#38bdf8" opacity="0.6" />
            <path d="M112,104 Q116,125 110,135 M120,104 Q124,125 122,140 M128,104 Q126,125 132,135" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.8" />
            {/* Data packets pulsing on cable */}
            <rect x="180" y="190" width="16" height="10" rx="3" fill="#f59e0b" stroke="#000" strokeWidth="1" />
            <text x="188" y="198" textAnchor="middle" fill="#000" fontSize="7" fontWeight="bold">IP</text>
          </svg>
        ) : isLibrary ? (
          // DNS Celestial Library / Owl resolver
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[260px]">
            <rect width="400" height="240" fill="#1e1b4b" />
            {/* Constellation / network lines */}
            <g stroke="#818cf8" strokeWidth="1.2" opacity="0.5">
              <line x1="60" y1="40" x2="160" y2="70" />
              <line x1="160" y1="70" x2="260" y2="50" />
              <line x1="260" y1="50" x2="340" y2="90" />
              <line x1="160" y1="70" x2="200" y2="150" />
              <line x1="200" y1="150" x2="300" y2="160" />
            </g>
            {/* Giant DNS book */}
            <g transform="translate(130, 90)">
              <path d="M10,20 Q70,5 130,20 L130,75 Q70,60 10,75 Z" fill="#fef3c7" stroke="#000" strokeWidth="2.5" />
              <path d="M10,20 Q-50,5 -110,20 L-110,75 Q-50,60 10,75 Z" fill="#fef3c7" stroke="#000" strokeWidth="2.5" />
              <line x1="10" y1="20" x2="10" y2="75" stroke="#000" strokeWidth="3" />
              <text x="-50" y="45" textAnchor="middle" fill="#1e293b" fontSize="11" fontWeight="bold">google.com</text>
              <text x="70" y="45" textAnchor="middle" fill="#0284c7" fontSize="10" fontWeight="bold">142.250.190.46</text>
              <text x="10" y="12" textAnchor="middle" fill="#d97706" fontSize="12" fontWeight="900">DNS DIRECTORY</text>
            </g>
          </svg>
        ) : isServer ? (
          // Server rack & handshake / layers
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[260px]">
            {/* Server Rack on Left */}
            <g transform="translate(40, 40)">
              <rect width="90" height="150" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              <rect x="10" y="20" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="30" r="3" fill="#22c55e" />
              <circle cx="32" cy="30" r="3" fill="#38bdf8" />
              <rect x="10" y="50" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="60" r="3" fill="#22c55e" />
              <circle cx="32" cy="60" r="3" fill="#ef4444" />
              <rect x="10" y="80" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="90" r="3" fill="#eab308" />
              <text x="45" y="130" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">CLIENT</text>
            </g>

            {/* Handshake Sparks in Center */}
            <g transform="translate(160, 85)">
              <line x1="0" y1="0" x2="80" y2="0" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,5" />
              <polygon points="70,-5 82,0 70,5" fill="#f59e0b" />
              <text x="40" y="-10" textAnchor="middle" fill="#f59e0b" fontSize="11" fontWeight="bold">SYN ➔</text>
              
              <line x1="80" y1="30" x2="0" y2="30" stroke="#06b6d4" strokeWidth="3" strokeDasharray="5,5" />
              <polygon points="10,25 -2,30 10,35" fill="#06b6d4" />
              <text x="40" y="24" textAnchor="middle" fill="#06b6d4" fontSize="11" fontWeight="bold">⬅ SYN-ACK</text>
              
              <line x1="0" y1="55" x2="80" y2="55" stroke="#10b981" strokeWidth="3" strokeDasharray="5,5" />
              <polygon points="70,50 82,55 70,60" fill="#10b981" />
              <text x="40" y="50" textAnchor="middle" fill="#10b981" fontSize="11" fontWeight="bold">ACK ➔</text>
            </g>

            {/* Server Rack on Right */}
            <g transform="translate(270, 40)">
              <rect width="90" height="150" rx="8" fill="#1e293b" stroke="#0f172a" strokeWidth="3" />
              <rect x="10" y="20" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="30" r="3" fill="#22c55e" />
              <rect x="10" y="50" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="60" r="3" fill="#22c55e" />
              <circle cx="32" cy="60" r="3" fill="#38bdf8" />
              <rect x="10" y="80" width="70" height="20" rx="3" fill="#334155" />
              <circle cx="22" cy="90" r="3" fill="#22c55e" />
              <text x="45" y="130" textAnchor="middle" fill="#94a3b8" fontSize="10" fontWeight="bold">SERVER</text>
            </g>
          </svg>
        ) : isNetwork ? (
          // Global network holographic map & packets
          <svg viewBox="0 0 400 240" className="w-full h-full max-h-[260px]">
            {/* Globe wireframe */}
            <circle cx="200" cy="120" r="75" fill="none" stroke="#0284c7" strokeWidth="2.5" opacity="0.4" />
            <ellipse cx="200" cy="120" rx="75" ry="30" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.4" />
            <ellipse cx="200" cy="120" rx="75" ry="55" fill="none" stroke="#0284c7" strokeWidth="1.5" opacity="0.4" />
            <line x1="200" y1="45" x2="200" y2="195" stroke="#0284c7" strokeWidth="2" opacity="0.4" />
            
            {/* Nodes and routing packets */}
            <circle cx="150" cy="95" r="7" fill="#ef4444" stroke="#000" strokeWidth="2" />
            <circle cx="250" cy="85" r="7" fill="#10b981" stroke="#000" strokeWidth="2" />
            <circle cx="170" cy="155" r="7" fill="#f59e0b" stroke="#000" strokeWidth="2" />
            <circle cx="240" cy="145" r="7" fill="#6366f1" stroke="#000" strokeWidth="2" />

            <path d="M150,95 Q200,60 250,85 T240,145 T170,155 Z" fill="none" stroke="#0f172a" strokeWidth="2" strokeDasharray="6,4" />

            {/* Glowing Packet Envelope */}
            <g transform="translate(170, 70)">
              <rect width="60" height="38" rx="4" fill="#fef08a" stroke="#000" strokeWidth="2.5" />
              <path d="M0,0 L30,22 L60,0" fill="none" stroke="#000" strokeWidth="2" />
              <text x="30" y="32" textAnchor="middle" fill="#000" fontSize="8" fontWeight="bold">PACKET #42</text>
            </g>
          </svg>
        ) : (
          // General conceptual graphic novel didactic panel
          <div className="flex flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="w-16 h-16 rounded-2xl bg-white/80 dark:bg-zinc-800/80 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_#000]">
              <span className="text-2xl font-bold font-display text-amber-500">#{panelIndex}</span>
            </div>
            <p className="text-xs font-mono font-medium max-w-[280px] line-clamp-3 px-3 py-1.5 rounded-lg bg-black/5 dark:bg-white/10 text-neutral-800 dark:text-neutral-200 border border-black/10">
              {prompt}
            </p>
          </div>
        )}
      </div>

      {/* Camera angle badge overlay */}
      <div className="absolute bottom-2 left-2 z-20">
        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase bg-black/85 text-white shadow-sm border border-white/20">
          📐 {cameraAngle}
        </span>
      </div>
    </div>
  );
};
