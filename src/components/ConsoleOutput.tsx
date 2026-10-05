import React from 'react';
// Ícones do Lucide para terminal, checks de teste, erros e botão de limpar
import { 
  Terminal, 
  CheckCircle2, 
  XCircle, 
  Trash2, 
  Clock, 
  AlertCircle
} from 'lucide-react';
// Tipos com a estrutura de retorno da execução do runner e dos testes unitários
import { ExecutionResult, TestResult } from '../types';

/**
 * Propriedades recebidas pelo componente ConsoleOutput
 */
interface ConsoleOutputProps {
  result: ExecutionResult | null;
  testResults: TestResult[];
  onClear: () => void;
  activeSubTab: 'output' | 'tests';
  setActiveSubTab: (tab: 'output' | 'tests') => void;
}

/**
 * ConsoleOutput: Terminal com estética Dark Pastel.
 * Cores Pastéis:
 * - Saída stdout com tipografia nítida e realce em Celeste Pastel (#9FD6F2)
 * - Erros em Rosa Pastel suave (#fca5a5) com fundo em tom de rubi discreto
 * - Testes aprovados em Menta Pastel (#86efac)
 */
export const ConsoleOutput: React.FC<ConsoleOutputProps> = ({
  result,
  testResults,
  onClear,
  activeSubTab,
  setActiveSubTab,
}) => {
  const hasTests = testResults.length > 0;
  const passedTestsCount = testResults.filter((t) => t.passed).length;
  const allTestsPassed = hasTests && passedTestsCount === testResults.length;

  return (
    <div className="aero-card flex flex-col h-full overflow-hidden bg-[#070d16]">
      
      {/* Cabeçalho do Console (Abas de Terminal, Testes e Botão de Limpar) */}
      <div className="flex items-center justify-between border-b border-slate-800/80 bg-[#0e1626] px-3 py-1.5">
        
        {/* Abas Alternáveis */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setActiveSubTab('output')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
              activeSubTab === 'output'
                ? 'bg-[#1a2638] text-white shadow-xs border border-[#9FD6F2]/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3 w-3 text-[#9FD6F2]" />
            <span>Terminal</span>
          </button>

          {hasTests && (
            <button
              onClick={() => setActiveSubTab('tests')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                activeSubTab === 'tests'
                  ? 'bg-[#1a2638] text-white shadow-xs border border-[#9FD6F2]/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {allTestsPassed ? (
                <CheckCircle2 className="h-3 w-3 text-[#86efac]" />
              ) : (
                <AlertCircle className="h-3 w-3 text-[#ffbe82]" />
              )}
              <span>Testes ({passedTestsCount}/{testResults.length})</span>
            </button>
          )}
        </div>

        {/* Duração em milissegundos e Botão de Limpar */}
        <div className="flex items-center gap-2">
          {result && (
            <div className="flex items-center gap-1 text-[11px] font-mono text-slate-400">
              <Clock className="h-3 w-3" />
              <span>{result.executionTimeMs}ms</span>
            </div>
          )}

          <button
            onClick={onClear}
            title="Limpar console"
            className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800 transition-colors"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* Superfície do Console */}
      <div className="flex-1 overflow-y-auto p-3.5 font-mono text-xs leading-relaxed bg-[#070d16] text-slate-200">
        
        {/* Visualização da Aba Terminal */}
        {activeSubTab === 'output' && (
          <div>
            {!result ? (
              <div className="flex flex-col items-center justify-center h-44 text-slate-600 text-center">
                <Terminal className="h-6 w-6 mb-2 opacity-40 text-slate-500" />
                <p>Nenhuma saída gerada ainda.</p>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  Clique em "Executar" para compilar e rodar o código.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {result.stdout && (
                  <pre className="text-[#9FD6F2] whitespace-pre-wrap font-medium">
                    {result.stdout}
                  </pre>
                )}

                {/* Bloco de Erro em Rosa Pastel */}
                {result.stderr && (
                  <div className="rounded-md border border-rose-900/50 bg-rose-950/25 p-3 text-[#fca5a5]">
                    <div className="flex items-center gap-1.5 font-semibold mb-1 text-rose-400">
                      <XCircle className="h-3.5 w-3.5" />
                      <span>Erro de Execução</span>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-[#fca5a5]">
                      {result.stderr}
                    </pre>
                  </div>
                )}

                {!result.stdout && !result.stderr && (
                  <p className="text-slate-500 italic">
                    Código finalizou com sucesso (sem mensagens impressas).
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Visualização da Aba de Testes Automatizados */}
        {activeSubTab === 'tests' && (
          <div className="space-y-2">
            {allTestsPassed && (
              <div className="flex items-center gap-2 p-2.5 rounded-md bg-emerald-950/30 border border-emerald-800/60 text-[#86efac]">
                <CheckCircle2 className="h-4 w-4 text-[#86efac] shrink-0" />
                <div className="text-xs font-medium">
                  Parabéns! Todos os testes foram aprovados com sucesso.
                </div>
              </div>
            )}

            {testResults.map((t, idx) => (
              <div
                key={t.testId || idx}
                className="p-2.5 rounded-md border border-slate-800 bg-[#0c1422] space-y-1"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-medium text-xs">
                    {t.passed ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#86efac] shrink-0" />
                    ) : (
                      <XCircle className="h-3.5 w-3.5 text-[#fca5a5] shrink-0" />
                    )}
                    <span className="text-slate-200">{t.description}</span>
                  </div>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                      t.passed
                        ? 'bg-emerald-500/15 text-[#86efac]'
                        : 'bg-rose-500/15 text-[#fca5a5]'
                    }`}
                  >
                    {t.passed ? 'PASSOU' : 'FALHOU'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 pl-5">{t.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
