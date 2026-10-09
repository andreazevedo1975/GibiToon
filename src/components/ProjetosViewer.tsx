import React from 'react';
import { BookOpen, Calendar, Sparkles, Layers, ArrowRight, Plus, Download } from 'lucide-react';
import { ComicBook } from '../types/comic';
import { TCP_IP_SAMPLE_BOOK } from '../data/samples';
import { ART_STYLES } from '../data/styles';

interface ProjetosViewerProps {
  currentBook: ComicBook;
  onSelectBook: (book: ComicBook) => void;
  onNewBooklet: () => void;
}

export const ProjetosViewer: React.FC<ProjetosViewerProps> = ({
  currentBook,
  onSelectBook,
  onNewBooklet,
}) => {
  const sampleProjects: {
    book: ComicBook;
    date: string;
    description: string;
  }[] = [
    {
      book: currentBook,
      date: 'Hoje (Em edição)',
      description: 'Apostila ativa atualmente no editor e gerador.',
    },
    {
      book: TCP_IP_SAMPLE_BOOK,
      date: 'Projeto Padrão',
      description: 'Introdução a Redes de Computadores e a Pilha de Protocolos TCP/IP (3 Páginas, 10 Painéis).',
    },
    {
      book: {
        book_metadata: {
          title: 'Código da Vida: Genética Mendeliana Ilustrada',
          topic: 'Genética, Hereditariedade e Leis de Mendel',
          target_audience: 'intermediate',
          art_style: 'anime_cinematic',
          tone: 'socratic',
          characters: [
            {
              id: 'char_1',
              name: 'Dra. Helena',
              role: 'mentor',
              visual_description: 'Geneticista com jaleco azul marinho e tablet holográfico',
              avatar_color: '#38BDF8',
            },
            {
              id: 'char_2',
              name: 'Kael',
              role: 'learner',
              visual_description: 'Estudante curioso com caderno de anotações botânicas',
              avatar_color: '#FBBF24',
            },
          ],
        },
        pages: [
          {
            page_number: 1,
            layout_type: 'hero_top_two_bottom',
            page_summary: 'Capítulo 1: O Mistério das Ervilhas e os Alelos',
            panels: [
              {
                panel_index: 1,
                visual_prompt: 'anime_cinematic style, botanical genetic greenhouse with glowing DNA helix and peas. Dra. Helena showing pea plants with distinct traits to Kael, no text',
                camera_angle: 'wide-angle',
                narration_box: 'A HISTÓRIA DOS TRAÇOS HEREDITÁRIOS • Como características viajam através das gerações?',
                bubbles: [
                  {
                    character_id: 'char_1',
                    type: 'speech',
                    text: 'Bem-vindo ao laboratório genético! Veja como as flores púrpuras e brancas seguem uma proporção matemática rigorosa.',
                    position_anchor: 'top-left',
                  },
                ],
              },
            ],
          },
        ],
      },
      date: 'Projeto Modelo',
      description: 'Explicação didática das leis de segregação e dominância com quadros de Punnett.',
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Gibiteca de Projetos
            </span>
            <span className="text-xs text-amber-200/90 font-comic font-bold">
              {sampleProjects.length} gibis salvos
            </span>
          </div>
          <h1 className="text-2xl font-cartoon font-extrabold text-amber-400 tracking-wide">
            Meus Gibis & Apostilas
          </h1>
          <p className="text-xs text-slate-300 font-comic mt-1">
            Gerencie, edite ou crie novos gibis pedagógicos no GibiToon Studio.
          </p>
        </div>

        <button
          onClick={onNewBooklet}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Criar Novo Gibi</span>
        </button>
      </div>

      {/* Projects List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {sampleProjects.map((item, idx) => {
          const style = ART_STYLES[item.book.book_metadata.art_style] || ART_STYLES.clean_vector_bd;
          const isCurrent = currentBook.book_metadata.title === item.book.book_metadata.title;

          return (
            <div
              key={idx}
              className={`rounded-2xl border p-5 transition flex flex-col justify-between ${
                isCurrent
                  ? 'bg-[#0E1A35] border-cyan-400 shadow-xl shadow-cyan-950/40 ring-1 ring-cyan-500/30'
                  : 'bg-[#080D1A] border-[#16233B] hover:border-[#20345B]'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#142140] text-cyan-300 border border-cyan-500/20">
                    {style.tag}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{item.date}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white font-sans line-clamp-2">
                    {item.book.book_metadata.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-2 border-t border-[#16233B]">
                  <span className="flex items-center space-x-1">
                    <Layers className="w-3 h-3 text-cyan-400" />
                    <span>{item.book.pages.length} pág(s)</span>
                  </span>
                  <span>•</span>
                  <span>{item.book.book_metadata.characters.length} personagens</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#16233B] mt-4">
                <button
                  onClick={() => onSelectBook(item.book)}
                  className={`w-full py-2.5 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                    isCurrent
                      ? 'bg-cyan-500 text-neutral-950 font-black'
                      : 'bg-[#121E38] hover:bg-[#1A2C52] text-slate-200'
                  }`}
                >
                  <span>{isCurrent ? 'Abrir no Leitor' : 'Carregar Este Projeto'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
