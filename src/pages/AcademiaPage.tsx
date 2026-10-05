import React, { useState, useEffect } from 'react';
// Contexto global da aplicação: gerencia trilhas, lições, pontuação de XP e estado salvo
import { useDualDev } from '../context/DualDevContext';
// Dados estáticos: catálogo de trilhas (Java, Python, JS, HTML, CSS) e busca de lições
import { tracks } from '../data/tracks';
import { getLessonsByTrack } from '../data/lessons';
// Runner de código: interpretador embutido no navegador para simular a execução de código
import { executeCode } from '../services/runners';
// Componentes visuais do workspace de aprendizado
import { CodeEditor } from '../components/CodeEditor';
import { ConsoleOutput } from '../components/ConsoleOutput';
import { TheoryPanel } from '../components/TheoryPanel';
// Tipagens TypeScript para segurança e autocompletar de resultados de execução e testes
import { ExecutionResult, TestResult } from '../types';
import { LanguageIcon } from '../components/LanguageIcon';
// Ícones visuais da biblioteca lucide-react
import { 
  CheckCircle2, 
  Circle, 
  Menu, 
  X 
} from 'lucide-react';

/**
 * AcademiaPage: Página principal de aprendizado interativo do DualDev em Dark Mode Pastel.
 * Modificações solicitadas:
 * - Modo claro removido. Estética 100% Dark Mode em tons ardósia (#0b101b, #0e1626).
 * - Acentos em cores pastéis: Azul Cerúleo Pastel (#6fb7db), Pêssego Pastel (#ffbe82) e Celeste (#9FD6F2).
 * - Barra lateral recolhível com o botão de 3 barras (Menu) para foco no código.
 */
export const AcademiaPage: React.FC = () => {
  // Extração de funções e estados do contexto global DualDevContext
  const {
    currentTrackId,      // ID da trilha selecionada (ex: 'java', 'python', 'javascript')
    setCurrentTrackId,   // Função para mudar a trilha ativa
    currentLessonId,     // ID da lição que o usuário está praticando no momento
    setCurrentLessonId,  // Função para carregar outra lição
    currentLesson,       // Objeto completo com título, teoria, código inicial e testes da lição atual
    completedLessonIds,  // Lista de IDs das lições que o usuário já concluiu com êxito
    codeDrafts,          // Rascunhos de código do usuário salvos no LocalStorage
    saveDraft,           // Função para persistir alterações de código automaticamente
    resetDraft,          // Função para resetar o código para o template original da aula
    completeLesson,      // Função que marca a lição como feita, atribui XP e checa conquistas
    recordCodeExecution, // Função que atualiza o contador de execuções para missões diárias
    nextLesson,          // Atalho para ir para a próxima lição da trilha
    prevLesson,          // Atalho para voltar à lição anterior
  } = useDualDev();

  // Lista de lições da trilha atual e os metadados da trilha ativa
  const trackLessons = getLessonsByTrack(currentTrackId);
  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];

  // --- Estados Locais do Editor e Console ---
  const [editorCode, setEditorCode] = useState<string>('');
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'output' | 'tests'>('output');
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1280;
    }
    return false;
  });

  /**
   * Efeito disparado sempre que o usuário muda de lição:
   * Carrega o rascunho salvo anteriormente ou o código inicial da nova lição e limpa o terminal.
   */
  useEffect(() => {
    if (currentLesson) {
      const savedCode = codeDrafts[currentLesson.id];
      setEditorCode(savedCode !== undefined ? savedCode : currentLesson.initialCode);
      setExecutionResult(null);
      setTestResults([]);
      setActiveConsoleTab('output');
    }
  }, [currentLesson?.id]);

  /**
   * handleCodeChange: Atualiza o código ao digitar e salva rascunho
   */
  const handleCodeChange = (newCode: string) => {
    setEditorCode(newCode);
    if (currentLesson) {
      saveDraft(currentLesson.id, newCode);
    }
  };

  /**
   * handleRunCode: Executa o código atual para ver a saída no terminal
   */
  const handleRunCode = async () => {
    if (!currentLesson) return;
    setIsRunning(true);
    setActiveConsoleTab('output');

    try {
      const res = await executeCode(currentTrackId, editorCode);
      setExecutionResult(res);
      recordCodeExecution(currentTrackId);
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Erro inesperado na execução.',
        executionTimeMs: 0,
      });
    } finally {
      setIsRunning(false);
    }
  };

  /**
   * handleTestChallenge: Valida os testes automatizados do desafio
   */
  const handleTestChallenge = async () => {
    if (!currentLesson) return;
    setIsTesting(true);

    try {
      const execRes = await executeCode(currentTrackId, editorCode);
      setExecutionResult(execRes);
      recordCodeExecution(currentTrackId);

      const results: TestResult[] = currentLesson.testCases.map((tc) => {
        if (tc.validator) {
          const outcome = tc.validator(editorCode, execRes.stdout);
          return {
            testId: tc.id,
            description: tc.description,
            passed: outcome.passed,
            message: outcome.message,
          };
        }

        const passed = !execRes.stderr && execRes.stdout.trim().length > 0;
        return {
          testId: tc.id,
          description: tc.description,
          passed,
          message: passed ? 'Código executado com sucesso!' : 'Código falhou na execução.',
        };
      });

      setTestResults(results);
      setActiveConsoleTab('tests');

      const allPassed = results.length > 0 && results.every((r) => r.passed);
      if (allPassed) {
        completeLesson(currentLesson.id);
      }
    } catch (err: any) {
      setExecutionResult({
        stdout: '',
        stderr: err.message || 'Erro na avaliação do código.',
        executionTimeMs: 0,
      });
    } finally {
      setIsTesting(false);
    }
  };

  /**
   * handleResetCode: Restaura o código do editor para o template inicial da aula
   */
  const handleResetCode = () => {
    if (!currentLesson) return;
    setEditorCode(currentLesson.initialCode);
    resetDraft(currentLesson.id);
    setExecutionResult(null);
    setTestResults([]);
  };

  /**
   * handleLoadSolution: Preenche o editor com o código da solução recomendada
   */
  const handleLoadSolution = () => {
    if (!currentLesson) return;
    setEditorCode(currentLesson.solutionCode);
    saveDraft(currentLesson.id, currentLesson.solutionCode);
  };

  // Cálculos de progresso da trilha
  const completedCount = trackLessons.filter((l) => completedLessonIds.includes(l.id)).length;
  const progressPercent = trackLessons.length > 0 ? Math.round((completedCount / trackLessons.length) * 100) : 0;

  // Índices para navegação de lições anterior e próxima
  const currentLessonIndex = trackLessons.findIndex((l) => l.id === currentLesson?.id);
  const hasNext = currentLessonIndex >= 0 && currentLessonIndex < trackLessons.length - 1;
  const hasPrev = currentLessonIndex > 0;
  const isCurrentCompleted = currentLesson ? completedLessonIds.includes(currentLesson.id) : false;

  return (
    <div className="flex flex-col min-h-[calc(100vh-3.5rem)] bg-[#0b101b]">
      
      {/* Sub-barra superior de seleção de trilhas com cores pastéis */}
      <div className="border-b border-slate-800/80 bg-[#0e1626]/95 px-4 py-2 flex items-center justify-between backdrop-blur-md">
        
        {/* Pílulas de seleção de trilha em formato limpo */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {tracks.map((t) => {
            const isSelected = t.id === currentTrackId;
            return (
              <button
                key={t.id}
                onClick={() => setCurrentTrackId(t.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-[#6fb7db] text-slate-950 font-semibold shadow-xs'
                    : 'bg-[#131d2e] border border-slate-700/80 text-slate-300 hover:bg-[#1a2638] hover:text-white'
                }`}
              >
                <LanguageIcon trackId={t.id} className="w-3.5 h-3.5" />
                <span>{t.name}</span>
                {isSelected && (
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-black/20 font-bold text-slate-950">
                    {progressPercent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Botão de 3 Barras (Menu) para fechar/abrir a aba de exercícios e entrar em modo Tela Cheia */}
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          title={isSidebarOpen ? "Recolher exercícios (Tela Cheia)" : "Expandir exercícios"}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all shrink-0 ${
            isSidebarOpen
              ? 'bg-[#141f30] text-[#9FD6F2] hover:bg-[#1a2a40] border border-slate-700/80'
              : 'aero-btn-primary'
          }`}
        >
          <Menu className="h-3.5 w-3.5" />
          <span>{isSidebarOpen ? "Recolher" : "Exercícios"}</span>
        </button>

      </div>

      {/* Área de Trabalho Principal (Workspace de Aprendizado) */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Barra Lateral com a Lista de Exercícios (Dark Pastel) */}
        <aside
          className={`
            fixed lg:static inset-y-0 left-0 z-30 bg-[#0e1626] border-r border-slate-800/80 flex flex-col transition-all duration-200 ease-out shadow-md lg:shadow-none
            top-14 lg:top-0 h-[calc(100vh-3.5rem)]
            ${isSidebarOpen
              ? 'w-64 translate-x-0 opacity-100'
              : 'w-0 -translate-x-full lg:w-0 lg:translate-x-0 opacity-0 pointer-events-none border-r-0 overflow-hidden'
            }
          `}
        >
          {/* Cabeçalho da Barra Lateral com Progresso Pastel */}
          <div className="p-3.5 border-b border-slate-800/80 shrink-0">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 min-w-0">
                <LanguageIcon trackId={currentTrack.id} className="w-3.5 h-3.5 shrink-0" />
                <span className="text-xs font-semibold text-white truncate">
                  Trilha {currentTrack.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-xs text-slate-400 font-mono">
                  {completedCount}/{trackLessons.length}
                </span>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  title="Recolher exercícios"
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
            {/* Barra de progresso visual em Cerúleo Pastel (#6fb7db) */}
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-[#6fb7db] transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Lista com todas as lições da trilha selecionada */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {trackLessons.map((lesson) => {
              const isSelected = lesson.id === currentLesson?.id;
              const isDone = completedLessonIds.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => {
                    setCurrentLessonId(lesson.id);
                    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                      setIsSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-md text-left text-xs transition-colors ${
                    isSelected
                      ? 'bg-[#152236] text-[#9FD6F2] font-semibold border-l-2 border-[#6fb7db]'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-2">
                    {/* Indicador de lição concluída ou pendente em Menta Pastel */}
                    {isDone ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#86efac] shrink-0" />
                    ) : (
                      <Circle className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                    )}
                    <div className="truncate">
                      <div className="truncate">{lesson.title}</div>
                    </div>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    +{lesson.xp}XP
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rodapé da barra lateral */}
          <div className="p-3 border-t border-slate-800/80 text-[11px] text-slate-500">
            {completedCount} de {trackLessons.length} lições concluídas
          </div>
        </aside>

        {/* Divisão dos Painéis de Teoria + Editor de Código + Console */}
        <div className="flex-1 flex flex-col xl:flex-row gap-3 p-3 lg:p-4 overflow-y-auto bg-[#0b101b]">
          
          {/* Painel Esquerdo: Explicação Teórica e Instruções do Desafio */}
          <div className="w-full xl:w-[40%] h-[520px] xl:h-auto min-h-[460px]">
            {currentLesson ? (
              <TheoryPanel
                lesson={currentLesson}
                isCompleted={isCurrentCompleted}
                onNext={nextLesson}
                onPrev={prevLesson}
                hasNext={hasNext}
                hasPrev={hasPrev}
                onLoadSolution={handleLoadSolution}
              />
            ) : (
              <div className="p-8 text-center text-slate-500">
                Selecione uma lição para iniciar.
              </div>
            )}
          </div>

          {/* Painel Direito: Editor de Código (superior) e Console/Testes (inferior) */}
          <div className="w-full xl:w-[60%] flex flex-col gap-3 min-h-[580px] xl:h-auto">
            
            {/* Editor de Código */}
            <div className="flex-1 min-h-[360px]">
              <CodeEditor
                code={editorCode}
                onChange={handleCodeChange}
                onRun={handleRunCode}
                onTest={handleTestChallenge}
                onReset={handleResetCode}
                trackId={currentTrackId}
                isRunning={isRunning}
                isTesting={isTesting}
              />
            </div>

            {/* Console de Saída e Validador de Casos de Teste */}
            <div className="h-60 min-h-[200px]">
              <ConsoleOutput
                result={executionResult}
                testResults={testResults}
                onClear={() => {
                  setExecutionResult(null);
                  setTestResults([]);
                }}
                activeSubTab={activeConsoleTab}
                setActiveSubTab={setActiveConsoleTab}
              />
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
