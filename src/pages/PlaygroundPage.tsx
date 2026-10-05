import React, { useState } from 'react';
// Tipos para identificar a linguagem selecionada e o resultado do runner
import { TrackId, ExecutionResult } from '../types';
// Serviço que compila e interpreta códigos localmente no navegador
import { executeCode } from '../services/runners';
// Componentes do editor e saída de console
import { CodeEditor } from '../components/CodeEditor';
import { ConsoleOutput } from '../components/ConsoleOutput';
import { LanguageIcon } from '../components/LanguageIcon';
import { useDualDev } from '../context/DualDevContext';
import { Terminal } from 'lucide-react';

/**
 * Modelos de código pré-configurados para o usuário testar rapidamente no Playground
 */
const PRESETS: Record<TrackId, { name: string; code: string }[]> = {
  java: [
    {
      name: 'Classe & Método main',
      code: `public class Main {
    public static void main(String[] args) {
        System.out.println("Bem-vindo ao Playground Java no DualDev!");
        
        String linguagem = "Java 21";
        int ano = 2026;
        System.out.println("Executando: " + linguagem + " em " + ano);
    }
}`,
    },
    {
      name: 'Métodos com Parâmetros',
      code: `public class Matematica {
    public static double calcularImc(double peso, double altura) {
        return peso / (altura * altura);
    }

    public static void main(String[] args) {
        double peso = 75.0;
        double altura = 1.78;
        double imc = calcularImc(peso, altura);
        
        System.out.println("Peso: " + peso + " kg");
        System.out.println("Altura: " + altura + " m");
        System.out.printf("IMC Calculado: %.2f", imc);
    }
}`,
    },
    {
      name: 'Arrays e Strings',
      code: `public class ArraysDemo {
    public static void main(String[] args) {
        String[] desenvolvedores = {"Alice", "Bruno", "Carlos", "Diana"};
        
        System.out.println("--- Lista de Desenvolvedores ---");
        for (int i = 0; i < desenvolvedores.length; i++) {
            System.out.println((i + 1) + ". " + desenvolvedores[i].toUpperCase());
        }

        int[] pontuacoes = {95, 88, 92, 100};
        int maior = pontuacoes[0];
        for (int p : pontuacoes) {
            if (p > maior) maior = p;
        }
        System.out.println("Maior pontuação: " + maior);
    }
}`,
    },
  ],
  python: [
    {
      name: 'Entrada, Saída e Condicionais',
      code: `# Playground Python no DualDev
nome = "Explorador"
pontos = 250

print(f"Olá, {nome}! Bem-vindo ao DualDev.")

if pontos >= 200:
    print("Classificação: Desenvolvedor Ouro!")
elif pontos >= 100:
    print("Classificação: Desenvolvedor Prata!")
else:
    print("Classificação: Iniciante.")
`,
    },
    {
      name: 'Funções e Listas',
      code: `def analisar_notas(notas):
    media = sum(notas) / len(notas)
    maior = max(notas)
    menor = min(notas)
    return media, maior, menor

notas_aluno = [8.5, 9.0, 7.5, 10.0, 9.5]
media, maior, menor = analisar_notas(notas_aluno)

print("Notas:", notas_aluno)
print(f"Média: {media:.2f}")
print(f"Maior Nota: {maior}")
print(f"Menor Nota: {menor}")
`,
    },
  ],
  javascript: [
    {
      name: 'ES6 Moderno & Arrays',
      code: `// Recursos modernos do JavaScript ES6+
const tecnologias = [
  { nome: 'Java', tipo: 'Backend', ano: 1995 },
  { nome: 'Python', tipo: 'IA & Scripts', ano: 1991 },
  { nome: 'JavaScript', tipo: 'Web Fullstack', ano: 1995 },
];

console.log("Tecnologias disponíveis no DualDev:");
tecnologias.forEach(t => {
  console.log(\`• \${t.nome} (\${t.tipo}) - Criado em \${t.ano}\`);
});
`,
    },
  ],
  html: [
    {
      name: 'Estrutura Básica HTML5',
      code: `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <title>Minha Página</title>
</head>
<body>
  <header>
    <h1>DualDev Academy</h1>
    <p>Aprenda programação na prática.</p>
  </header>
</body>
</html>`,
    },
  ],
  css: [
    {
      name: 'Flexbox e Estilização',
      code: `/* Estilos Modernos com Flexbox */
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #ffbe82, #6fb7db);
}`,
    },
  ],
};

/**
 * PlaygroundPage: Ambiente livre em Dark Mode Pastel.
 */
export const PlaygroundPage: React.FC = () => {
  const { recordCodeExecution } = useDualDev();
  const [selectedLanguage, setSelectedLanguage] = useState<TrackId>('java');
  const [code, setCode] = useState<string>(PRESETS.java[0].code);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);

  const handleLanguageChange = (lang: TrackId) => {
    setSelectedLanguage(lang);
    setCode(PRESETS[lang][0].code);
    setExecutionResult(null);
  };

  const handleRun = async () => {
    setIsRunning(true);
    try {
      const res = await executeCode(selectedLanguage, code);
      setExecutionResult(res);
      recordCodeExecution(selectedLanguage);
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4 bg-[#0b101b]">
      
      {/* Cabeçalho do Playground */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffbe82] to-[#6fb7db] text-slate-950 shadow-xs">
              <Terminal className="h-4 w-4" />
            </div>
            <span>Playground Livre</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Escreva e execute códigos livremente sem restrições de lição.
          </p>
        </div>

        {/* Seletor de Linguagens e Modelos Rápidos */}
        <div className="flex flex-wrap items-center gap-2">
          {(['java', 'python', 'javascript'] as TrackId[]).map((lang) => (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedLanguage === lang
                  ? 'bg-[#6fb7db] text-slate-950 font-bold shadow-xs'
                  : 'bg-[#141f30] text-slate-300 hover:text-white border border-slate-700/80'
              }`}
            >
              <LanguageIcon trackId={lang} className="w-3.5 h-3.5" />
              <span>{lang.toUpperCase()}</span>
            </button>
          ))}

          {/* Menu Dropdown de Modelos Pré-prontos */}
          <select
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              setCode(PRESETS[selectedLanguage][idx].code);
              setExecutionResult(null);
            }}
            className="bg-[#141f30] border border-slate-700 text-slate-200 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#ffbe82]/40 font-medium"
          >
            {PRESETS[selectedLanguage].map((preset, idx) => (
              <option key={idx} value={idx} className="bg-[#0e1626]">
                Modelo: {preset.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid de Divisão: Editor (esquerda) e Terminal de Saída (direita) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[580px]">
        {/* Editor de Código */}
        <div className="h-[580px]">
          <CodeEditor
            code={code}
            onChange={setCode}
            onRun={handleRun}
            onReset={() => setCode(PRESETS[selectedLanguage][0].code)}
            trackId={selectedLanguage}
            isRunning={isRunning}
          />
        </div>

        {/* Saída de Console */}
        <div className="h-[580px]">
          <ConsoleOutput
            result={executionResult}
            testResults={[]}
            onClear={() => setExecutionResult(null)}
            activeSubTab="output"
            setActiveSubTab={() => {}}
          />
        </div>
      </div>

    </div>
  );
};
