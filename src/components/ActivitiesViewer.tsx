import React, { useState } from 'react';
import { FileQuestion, CheckCircle2, XCircle, Sparkles, Printer, ArrowRight, RefreshCw, HelpCircle } from 'lucide-react';

export interface ActivityQuestion {
  id: number;
  type: 'multiple_choice' | 'practical_challenge';
  title: string;
  statement: string;
  options?: string[];
  correct_answer_index?: number;
  pedagogical_explanation: string;
}

export interface ActivitiesData {
  topic: string;
  questions: ActivityQuestion[];
}

interface ActivitiesViewerProps {
  topic: string;
  disciplina: string;
  publico: string;
  nivel: string;
  onGoToBooklet: () => void;
}

export const ActivitiesViewer: React.FC<ActivitiesViewerProps> = ({
  topic,
  disciplina,
  publico,
  nivel,
  onGoToBooklet,
}) => {
  const [activities, setActivities] = useState<ActivitiesData>({
    topic: topic || 'Redes e Protocolo TCP/IP',
    questions: [
      {
        id: 1,
        type: 'multiple_choice',
        title: 'Fixação Conceitual: Analogia dos Correios',
        statement: 'Na apostila ilustrada, como o protocolo IP (Internet Protocol) foi metaforicamente representado pelos personagens?',
        options: [
          'Como um caminhão único que transporta todos os arquivos de uma só vez sem divisão.',
          'Como o envelope e o endereço postal que garantem que cada pacote chegue ao destinatário correto.',
          'Como um sistema de rádio analógico que transmite ondas sonoras contínuas.',
          'Como um cabo de energia que apenas fornece eletricidade para os computadores.',
        ],
        correct_answer_index: 1,
        pedagogical_explanation: 'O IP atua exatamente como o endereçamento dos correios: ele define de onde veio e para onde vai cada pacote individual de dados.',
      },
      {
        id: 2,
        type: 'multiple_choice',
        title: 'Confiabilidade: O Papel do TCP',
        statement: 'O que acontece quando um pacote de dados é perdido ou corrompido durante a transmissão segundo a mecânica do TCP?',
        options: [
          'A conexão inteira da internet mundial é reiniciada automaticamente.',
          'O destinatário ignora a perda e o arquivo final fica incompleto.',
          'O TCP detecta a ausência da confirmação (ACK) e solicita o reenvio automático do pacote específico.',
          'Os pacotes restantes mudam de formato e se transformam em texto puro.',
        ],
        correct_answer_index: 2,
        pedagogical_explanation: 'O TCP é o protocolo orientado a conexão responsável por garantir que 100% dos pacotes cheguem na ordem correta, retransmitindo perdas.',
      },
      {
        id: 3,
        type: 'multiple_choice',
        title: 'Roteamento Inteligente',
        statement: 'Qual é a função primordial dos Roteadores (Routers) na grande teia da internet mostrada na HQ?',
        options: [
          'Armazenar cópias permanentes de todos os vídeos e fotos da rede.',
          'Atuar como agentes de trânsito inteligentes, escolhendo a melhor rota disponível para desviar de congestionamentos.',
          'Traduzir o código binário para a linguagem falada dos usuários.',
          'Desligar computadores que enviam mensagens muito longas.',
        ],
        correct_answer_index: 1,
        pedagogical_explanation: 'Roteadores analisam as tabelas de roteamento em milissegundos para guiar cada pacote pelo caminho mais rápido e seguro.',
      },
      {
        id: 4,
        type: 'practical_challenge',
        title: 'Desafio Prático: Desenho & Mapa Mental',
        statement: 'Desenhe um diagrama em quadrinhos de 3 quadros demonstrando o aperto de mão de 3 vias (Three-Way Handshake: SYN -> SYN/ACK -> ACK) entre dois servidores fictícios.',
        options: [],
        correct_answer_index: -1,
        pedagogical_explanation: 'A visualização do handshake em formato de quadrinhos solidifica o entendimento da fase de sincronização e confirmação mútua.',
      },
    ],
  });

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showFeedback, setShowFeedback] = useState<Record<number, boolean>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    setShowFeedback((prev) => ({ ...prev, [questionId]: true }));
  };

  const handleGenerateNew = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/generate-activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          disciplina,
          assunto: topic,
          publico,
          nivel,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.questions && data.questions.length > 0) {
          setActivities(data);
          setSelectedAnswers({});
          setShowFeedback({});
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-[#0D121F] border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-md text-[10px] font-cartoon font-bold uppercase bg-amber-400 text-neutral-950 border border-black shadow-[1.5px_1.5px_0px_0px_#000]">
              Caderno de Atividades do Gibi
            </span>
            <span className="text-xs text-amber-200/90 font-comic font-bold">
              Nível: {nivel} • {publico}
            </span>
          </div>
          <h1 className="text-2xl font-cartoon font-extrabold text-amber-400 tracking-wide">
            Atividades de Fixação: {topic}
          </h1>
          <p className="text-xs text-slate-300 font-comic mt-1">
            Exercícios formulados com base nos quadrinhos didáticos, com gabarito comentado e justificativas conceituais.
          </p>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={handleGenerateNew}
            disabled={isLoading}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#162035] hover:bg-[#1E2B47] text-amber-300 border-2 border-black font-cartoon text-xs font-bold transition shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>{isLoading ? 'Gerando...' : 'Novas Questões'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-[#162035] hover:bg-[#1E2B47] text-slate-200 border-2 border-black font-cartoon text-xs font-bold transition shadow-[2px_2px_0px_0px_#000] cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir</span>
          </button>

          <button
            onClick={onGoToBooklet}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl btn-cartoon-yellow text-xs cursor-pointer"
          >
            <span>Ver Gibi</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-4">
        {activities.questions.map((q, idx) => {
          const isSelected = selectedAnswers[q.id] !== undefined;
          const isCorrect = isSelected && selectedAnswers[q.id] === q.correct_answer_index;
          const isPractical = q.type === 'practical_challenge';

          return (
            <div
              key={q.id || idx}
              className="bg-[#080D1A] border border-[#16233B] rounded-2xl p-5 shadow-lg space-y-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <span className="w-6 h-6 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                    {q.title}
                  </span>
                </div>
                {isPractical && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                    Desafio Visual
                  </span>
                )}
              </div>

              <p className="text-sm text-white font-medium leading-relaxed">
                {q.statement}
              </p>

              {/* Options */}
              {!isPractical && q.options && (
                <div className="space-y-2 pt-1">
                  {q.options.map((opt, optIdx) => {
                    const letters = ['A', 'B', 'C', 'D'];
                    const chosen = selectedAnswers[q.id] === optIdx;
                    const isTheRightOne = q.correct_answer_index === optIdx;
                    const feedbackActive = showFeedback[q.id];

                    let btnClass = 'bg-[#0B1324] border-[#16233B] text-slate-300 hover:bg-[#101C38] hover:border-cyan-500/40';

                    if (feedbackActive) {
                      if (isTheRightOne) {
                        btnClass = 'bg-emerald-950/40 border-emerald-500 text-emerald-200 font-bold';
                      } else if (chosen && !isTheRightOne) {
                        btnClass = 'bg-rose-950/40 border-rose-500 text-rose-300';
                      }
                    }

                    return (
                      <button
                        key={optIdx}
                        onClick={() => handleSelectOption(q.id, optIdx)}
                        className={`w-full flex items-start space-x-3 p-3 rounded-xl border text-left text-xs transition ${btnClass}`}
                      >
                        <span className="w-5 h-5 rounded-md bg-[#16233B] flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5">
                          {letters[optIdx]}
                        </span>
                        <span className="flex-1">{opt}</span>
                        {feedbackActive && isTheRightOne && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        )}
                        {feedbackActive && chosen && !isTheRightOne && (
                          <XCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Practical Challenge Box */}
              {isPractical && (
                <div className="p-4 rounded-xl bg-[#050A14] border border-dashed border-[#233555] text-xs text-slate-300 space-y-2">
                  <p className="text-slate-400">
                    ✏️ Espaço do Estudante: Utilize o espaço abaixo ou seu caderno para rascunhar o quadrinho com os 3 quadros sequenciais.
                  </p>
                  <div className="h-28 rounded-lg bg-[#080D1A] border border-[#16233B] flex items-center justify-center text-slate-600 text-xs font-mono">
                    [ Área reservada para desenho esquemático e rascunho de quadrinhos ]
                  </div>
                </div>
              )}

              {/* Pedagogical Explanation */}
              {showFeedback[q.id] && (
                <div className="mt-3 p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 text-xs text-cyan-200 space-y-1">
                  <div className="flex items-center space-x-1.5 font-bold text-cyan-300">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Gabarito Comentado & Justificativa Didática:</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {q.pedagogical_explanation}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
