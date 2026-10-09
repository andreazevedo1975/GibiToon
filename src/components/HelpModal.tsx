import React from 'react';
import { X, HelpCircle, CheckCircle2 } from 'lucide-react';

interface HelpModalProps {
  type: 'nivel' | 'formato' | null;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ type, onClose }) => {
  if (!type) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl w-full max-w-lg p-6 text-neutral-100 shadow-[6px_6px_0px_0px_#000] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-amber-400 text-neutral-950 p-1 rounded-lg border border-black shadow-[1.5px_1.5px_0px_0px_#000] hover:bg-amber-300 cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        <div className="flex items-center space-x-2.5 mb-4">
          <div className="w-9 h-9 rounded-xl bg-amber-400 border border-black flex items-center justify-center text-neutral-950 shadow-[1.5px_1.5px_0px_0px_#000]">
            <HelpCircle className="w-5 h-5 stroke-[2.5]" />
          </div>
          <h3 className="text-lg font-cartoon font-extrabold text-amber-400">
            {type === 'nivel' ? 'Níveis Pedagógicos Explicados' : 'Formatos de Apostila e Gibi'}
          </h3>
        </div>

        {type === 'nivel' ? (
          <div className="space-y-3.5 text-xs text-neutral-300">
            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Básico / Introdutório</span>
              </div>
              <p className="text-neutral-400">
                Foco em analogias simples do cotidiano, vocabulário acessível e zero jargões desnecessários. Ideal para crianças e primeiros contatos com a matéria.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-sky-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Intermediário (Recomendado)</span>
              </div>
              <p className="text-neutral-400">
                Equilíbrio perfeito entre teoria técnica correta e metáforas visuais. Conecta fórmulas e conceitos a diagramas explicativos sequenciais.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-purple-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Avançado / Concursos</span>
              </div>
              <p className="text-neutral-400">
                Rigor acadêmico, terminologia técnica precisa, análise de casos de borda e preparação para bancas e vestibulares.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3.5 text-xs text-neutral-300">
            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-cyan-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Formato A4 (Impressão & PDF)</span>
              </div>
              <p className="text-neutral-400">
                Proporção tradicional de 210 x 297 mm com margens para encadernação e sangria gráfica. Perfeito para gerar PDFs de alta resolução prontos para impressão física.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-amber-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Formato Webtoon (Vertical Scroll)</span>
              </div>
              <p className="text-neutral-400">
                Otimizado para leitura contínua no celular e computadores modernos, com ritmo sequencial de quadrinhos digitais.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#070D18] border border-[#1E293B]/70 space-y-1">
              <div className="flex items-center space-x-1.5 text-indigo-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Formato E-book / Slide (16:9)</span>
              </div>
              <p className="text-neutral-400">
                Apresentação horizontal em tela cheia para projetores, aulas virtuais e tablets.
              </p>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white text-neutral-950 font-bold text-xs hover:bg-neutral-200 transition"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
};
