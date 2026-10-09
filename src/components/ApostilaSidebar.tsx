import React from 'react';
import {
  LayoutGrid,
  Layers,
  FileQuestion,
  Image as ImageIcon,
  FolderKanban,
  GraduationCap,
  Bell,
  Package,
  Plus,
  HelpCircle,
  Sun,
  Moon,
  User,
  Sparkles,
} from 'lucide-react';

export type SidebarTab =
  | 'criar'
  | 'imagem_unica'
  | 'paginas'
  | 'atividades'
  | 'capas'
  | 'projetos'
  | 'treinamentos'
  | 'novidades'
  | 'produtos';

interface ApostilaSidebarProps {
  activeTab: SidebarTab;
  onSelectTab: (tab: SidebarTab) => void;
  onNewApostila: () => void;
  onOpenHelp: () => void;
}

export const ApostilaSidebar: React.FC<ApostilaSidebarProps> = ({
  activeTab,
  onSelectTab,
  onNewApostila,
  onOpenHelp,
}) => {
  const menuItems: { id: SidebarTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'criar', label: 'Criar Apostila', icon: LayoutGrid },
    { id: 'imagem_unica', label: 'Criar Imagens Únicas 🍌', icon: Sparkles },
    { id: 'paginas', label: 'Apostila +Páginas', icon: Layers },
    { id: 'atividades', label: 'Gerador de Atividades', icon: FileQuestion },
    { id: 'capas', label: 'Capas', icon: ImageIcon },
    { id: 'projetos', label: 'Meus Projetos', icon: FolderKanban },
    { id: 'treinamentos', label: 'Treinamentos', icon: GraduationCap },
    { id: 'novidades', label: 'Novidades', icon: Bell },
    { id: 'produtos', label: 'Mais Produtos', icon: Package },
  ];

  return (
    <aside className="w-64 bg-[#0D121F] border-r-2 border-black flex flex-col justify-between shrink-0 h-screen select-none sticky top-0 z-30 shadow-[4px_0px_0px_0px_rgba(0,0,0,0.4)]">
      {/* Top Header & Cartoon Logo */}
      <div className="p-4 pt-5">
        <div className="flex items-center space-x-3 px-1 mb-6">
          {/* Cartoon Speech Burst Logo Icon */}
          <div className="relative">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 border-2 border-black flex flex-col items-center justify-center shadow-[3px_3px_0px_0px_#000000] rotate-[-2deg] transition-transform hover:rotate-0">
              <span className="text-xl leading-none">💥</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyan-400 rounded-full border border-black flex items-center justify-center text-[9px] font-black font-cartoon">
              ★
            </div>
          </div>

          <div>
            <div className="flex items-baseline space-x-1">
              <span className="text-amber-400 font-cartoon font-extrabold text-lg tracking-tight drop-shadow-[1px_1px_0px_#000]">
                GibiToon
              </span>
              <span className="text-white font-bangers tracking-wider text-xs uppercase px-1 py-0.2 bg-rose-500 rounded border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
                STUDIO
              </span>
            </div>
            <span className="text-[10px] text-amber-200/80 font-comic font-bold block leading-tight">
              Apostilas em Quadrinhos
            </span>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-cartoon transition text-left cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-neutral-950 font-extrabold border-2 border-black shadow-[3px_3px_0px_0px_#000000] translate-x-0.5'
                    : 'text-slate-300 hover:text-white hover:bg-[#162035] hover:border-black/50 border border-transparent'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-neutral-950 stroke-[2.5]' : 'text-amber-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t-2 border-black space-y-3 bg-[#090D17]">
        {/* + Nova Apostila Button */}
        <button
          onClick={onNewApostila}
          className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span className="tracking-wide">+ Nova Apostila</span>
        </button>

        {/* Suporte Link */}
        <button
          onClick={onOpenHelp}
          className="w-full flex items-center space-x-2.5 px-2 py-1.5 text-xs text-slate-300 hover:text-amber-300 transition font-comic cursor-pointer"
        >
          <HelpCircle className="w-4 h-4 text-amber-400" />
          <span>Guia & Formatos</span>
        </button>

        {/* Tema Switcher */}
        <div className="flex items-center justify-between px-2 py-1.5 text-xs text-slate-300 font-comic">
          <span className="font-bold">Tema Visual</span>
          <div className="flex items-center space-x-1 bg-[#121A2B] p-1 rounded-lg border border-black shadow-[2px_2px_0px_0px_#000]">
            <button className="p-1 rounded text-slate-400 hover:text-white cursor-pointer" title="Modo Claro">
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 rounded bg-amber-400 text-neutral-950 shadow-xs cursor-pointer" title="Modo Gibi Dark">
              <Moon className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* User Card */}
        <div className="flex items-center space-x-3 px-2 pt-2 border-t border-slate-800">
          <div className="w-8 h-8 rounded-full bg-amber-400 border-2 border-black flex items-center justify-center text-neutral-950 font-bold font-cartoon text-xs shadow-[2px_2px_0px_0px_#000] shrink-0">
            HQ
          </div>
          <div className="truncate">
            <p className="text-xs font-bold font-cartoon text-white truncate">andreazevedo1975</p>
            <p className="text-[10px] text-amber-400/90 font-comic font-bold">Criador de Gibis</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
