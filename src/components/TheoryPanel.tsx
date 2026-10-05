import React, { useState } from 'react';
// Ícones do Lucide para cabeçalho, dicas, objetivo e setas de navegação
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Target, 
  CheckCircle, 
  Zap, 
  Clock, 
  ArrowRight, 
  ArrowLeft 
} from 'lucide-react';
// Tipo que descreve a estrutura de uma lição (teoria, instruções, testes, dicas)
import { Lesson } from '../types';

/**
 * Propriedades recebidas pelo TheoryPanel
 */
interface TheoryPanelProps {
  lesson: Lesson;           // Dados completos da lição atualmente ativa
  isCompleted: boolean;     // Indica se o usuário já concluiu esta lição
  onNext: () => void;       // Função para avançar para a próxima aula
  onPrev: () => void;       // Função para voltar para a aula anterior
  hasNext: boolean;         // Existe lição posterior na trilha
  hasPrev: boolean;         // Existe lição anterior na trilha
  onLoadSolution: () => void; // Função para preencher o editor com a solução sugerida
}

/**
 * TheoryPanel: Painel didático em Dark Mode com detalhes pastéis.
 * Cores Pastéis:
 * - Destaques de XP em Pêssego Pastel (#ffbe82)
 * - Títulos e caixas de objetivo com detalhes em Celeste Pastel (#9FD6F2)
 * - Fundo confortável para leitura contínua (#0f172a / #0e1626)
 */
export const TheoryPanel: React.FC<TheoryPanelProps> = ({
  lesson,
  isCompleted,
  onNext,
  onPrev,
  hasNext,
  hasPrev,
  onLoadSolution,
}) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="aero-card flex flex-col h-full overflow-hidden bg-[#0f172a]">
      
      {/* Cabeçalho Teórico Clean */}
      <div className="border-b border-slate-800/80 bg-[#0e1626] px-4 py-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          {/* Categoria e Dificuldade */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-[#9FD6F2] px-2 py-0.5 rounded-md bg-[#9FD6F2]/10 border border-[#9FD6F2]/25">
              {lesson.category}
            </span>
            <span className="text-xs text-slate-400">
              {lesson.difficulty}
            </span>
          </div>

          {/* XP e Duração Estimada */}
          <div className="flex items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1 text-[#ffbe82] font-semibold">
              <Zap className="h-3.5 w-3.5 fill-[#ffbe82]" />
              <span>+{lesson.xp} XP</span>
            </div>
            <div className="flex items-center gap-1 text-slate-400">
              <Clock className="h-3 w-3" />
              <span>~{lesson.estimatedMinutes}m</span>
            </div>
          </div>
        </div>

        {/* Título da Lição e Selo de Concluído */}
        <div className="flex items-center justify-between">
          <h1 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            {lesson.title}
            {isCompleted && (
              <span className="flex items-center gap-1 text-[11px] text-[#86efac] font-medium px-2 py-0.2 rounded-md bg-emerald-950/40 border border-emerald-800/60">
                <CheckCircle className="h-3 w-3" />
                Concluído
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Corpo da Teoria com Rolagem Independente */}
      <div className="flex-1 overflow-y-auto p-4 text-slate-300 text-sm leading-relaxed space-y-4 bg-[#0f172a]">
        
        {/* Renderizador de Conteúdo Teórico */}
        <div className="max-w-none text-sm space-y-3">
          {lesson.theory.split('\n\n').map((paragraph, idx) => {
            // Títulos H3 com barra em Cerúleo Pastel
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-sm font-bold text-white tracking-tight pt-2 border-b border-slate-800 pb-1 flex items-center gap-2">
                  <span className="w-1 h-3.5 rounded-full bg-[#6fb7db] inline-block" />
                  <span>{paragraph.replace('### ', '')}</span>
                </h3>
              );
            }
            // Subtítulos H4
            if (paragraph.startsWith('#### ')) {
              return (
                <h4 key={idx} className="text-xs font-semibold uppercase tracking-wider text-[#9FD6F2] pt-1.5">
                  {paragraph.replace('#### ', '')}
                </h4>
              );
            }
            // Blocos de código de exemplo
            if (paragraph.startsWith('```')) {
              const cleaned = paragraph.replace(/```[a-z]*\n?/g, '');
              return (
                <div key={idx} className="rounded-md bg-[#070e17] border border-slate-800 p-3 font-mono text-xs overflow-x-auto text-slate-200">
                  <pre>{cleaned}</pre>
                </div>
              );
            }
            // Parágrafos comuns
            return (
              <p key={idx} className="text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            );
          })}
        </div>

        {/* Caixa de Destaque: Objetivo do Exercício Prático */}
        <div className="rounded-md border border-sky-900/50 bg-sky-950/25 p-3.5 space-y-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#9FD6F2]">
            <Target className="h-3.5 w-3.5 text-[#6fb7db]" />
            <span>Objetivo do Exercício</span>
          </div>
          <p className="text-slate-200 text-xs leading-relaxed">
            {lesson.instructions}
          </p>
        </div>

        {/* Seção Retrátil de Dicas */}
        {lesson.hints && lesson.hints.length > 0 && (
          <div className="rounded-md border border-slate-800 bg-[#0c1522] overflow-hidden">
            <button
              onClick={() => setShowHints(!showHints)}
              className="w-full flex items-center justify-between p-3 text-xs font-medium text-slate-300 hover:bg-slate-800/60 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <HelpCircle className="h-3.5 w-3.5 text-[#ffbe82]" />
                <span>Precisa de ajuda? ({lesson.hints.length} dicas)</span>
              </div>
              {showHints ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {/* Conteúdo das Dicas e Link para Solução */}
            {showHints && (
              <div className="p-3 pt-0 border-t border-slate-800 space-y-2 text-xs text-slate-400">
                <ul className="list-disc list-inside space-y-1 pl-1">
                  {lesson.hints.map((hint, i) => (
                    <li key={i} className="leading-relaxed">
                      {hint}
                    </li>
                  ))}
                </ul>

                <div className="pt-1.5">
                  <button
                    onClick={onLoadSolution}
                    className="text-[11px] font-mono text-[#9FD6F2] hover:underline transition-colors font-medium"
                  >
                    Ver código da solução sugerida
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>

      {/* Rodapé de Navegação */}
      <div className="flex items-center justify-between border-t border-slate-800/80 bg-[#0e1626] px-4 py-2.5">
        <button
          onClick={onPrev}
          disabled={!hasPrev}
          className="aero-btn-glass px-3 py-1.5 text-xs disabled:opacity-30 disabled:pointer-events-none"
        >
          <ArrowLeft className="h-3 w-3 mr-1" />
          Anterior
        </button>

        <button
          onClick={onNext}
          disabled={!hasNext}
          className="aero-btn-primary px-3.5 py-1.5 text-xs disabled:opacity-30 disabled:pointer-events-none"
        >
          <span>Próxima Lição</span>
          <ArrowRight className="h-3 w-3 ml-1" />
        </button>
      </div>

    </div>
  );
};
