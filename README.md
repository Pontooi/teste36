# 🐦 DualDev — Academia Interativa de Programação & Playground

> **Documentação Completa do Projeto para Desenvolvedores e Modelos de Inteligência Artificial**  
> *Versão do Projeto: 1.0.0 • Stack: React 19 + TypeScript + Vite + Tailwind CSS v4*

---

## 📌 1. Visão Geral do Projeto

O **DualDev** (DualDev Academy) é uma plataforma web educacional e interativa focada no aprendizado prático de programação. O objetivo central é eliminar a barreira de instalação de compiladores e dependências pesadas, permitindo que estudantes escrevam, executem e testem código **diretamente no navegador com feedback instantâneo**.

O projeto adota a nostálgica e refinada estética **Frutiger Aero / Aqua Glass** combinada com uma paleta de cores acolhedora inspirada no pássaro **Chapim-de-Garganta-Preta (*Red-headed Tit* / *Aegithalos concinnus*)**.

---

## 🎨 2. Identidade Visual & Paleta de Cores Ativa

O design do projeto combina elementos clássicos de vidro translúcido (*Aero Glass*), botões esmaltados com reflexo de luz (*Aero Gloss*) e a paleta de cores harmoniosa selecionada (excluindo `#FFD3A6`):

| Cor | Nome / Tonalidade | Aplicação no DualDev |
| :--- | :--- | :--- |
| **`#FFB066`** | **Laranja Damasco Vibrante** | Botões primários (`aero-btn-primary`), barra de progresso, logotipo DualDev, badges de XP e acentos interativos |
| **`#5AA8CF`** | **Azul Oceânico Cerúleo** | Bordas elegantes dos cartões, botões secundários (`aero-btn-glass`), ícones temáticos e cabeçalhos |
| **`#9FD6F2`** | **Azul Celeste Pastel** | Reflexos de luz superiores (*Specular Gloss*), abas ativas, numeração de linhas e barra de rolagem |
| **`#FFF3E6`** | **Creme Baunilha Suave** | Fundo acolhedor no Modo Claro, superfícies de cartões de vidro (*Aero Card*) e painéis |
| **`#10b981`** | **Verde Esmeralda** | Botões de verificação com sucesso (`aero-btn-success`) e testes unitários aprovados |
| *Modo Escuro* | **Azul Marinho Noite** (`#08111c`, `#0a1626`) | Fundo do Modo Escuro e editor de código com luminescência em `#5AA8CF` e `#FFB066` |

> *Nota: O tom `#FFD3A6` foi explicitamente excluído da composição visual.*

---

## 🚀 3. Funcionalidades Implementadas (O que já foi feito)

### 3.1. Cinco Trilhas de Aprendizagem Completas
1. **☕ Java (Foco Principal):**
   - Anatomia da classe Java e método `public static void main(String[] args)`.
   - Métodos estáticos com parâmetros tipados e cálculo matemático (`double`, `int`).
   - Manipulação de arrays, iterações e strings (`.toUpperCase()`, `for` loop).
2. **🐍 Python:**
   - Sintaxe limpa, função `print()`, condicionais `if`/`elif`/`else`.
   - Listas dinâmicas, laço `for in` e funções reutilizáveis (`def`).
3. **⚡ JavaScript (ES6+):**
   - Escopo seguro (`let`/`const`), template literals e arrow functions.
   - Métodos funcionais de arrays (`.map()`, `.filter()`).
4. **🌐 HTML5:**
   - Estruturação semântica, cabeçalhos, formulários interativos e acessibilidade.
5. **🎨 CSS3:**
   - Box Model, alinhamentos com Flexbox, estilização de tipografia e botões.

---

### 3.2. Botão de 3 Barras (`Menu`) para Modo Tela Cheia na Academia
- Na sub-barra da Academia, existe um botão com o ícone de 3 barras: **"Fechar Exercícios" / "Abrir Exercícios"**.
- Ao clicar, a barra lateral de lições se recolhe suavemente com animação CSS (`w-0 -translate-x-full overflow-hidden`), permitindo que o editor de código e o painel de teoria ganhem **100% da largura da tela**.
- Há também um botão de fechar (`X`) dentro do próprio cabeçalho da barra de exercícios.

---

### 3.3. Editor de Código Estilo VS Code com IntelliSense
- **Snippets Rápidos com Tab:**
  - `sout` + <kbd>Tab</kbd> ➔ `System.out.println("");`
  - `main` + <kbd>Tab</kbd> ➔ `public static void main(String[] args) { ... }`
  - `def` + <kbd>Tab</kbd> ➔ `def nome_funcao():`
  - `clg` + <kbd>Tab</kbd> ➔ `console.log();`
- **Atalhos de Teclado:**
  - <kbd>Ctrl</kbd> + <kbd>Enter</kbd>: Executa o código imediatamente.
  - <kbd>Ctrl</kbd> + <kbd>Espaço</kbd>: Abre a janela flutuante de sugestões de autocompletar.
  - <kbd>Tab</kbd> / <kbd>Enter</kbd>: Confirma a sugestão selecionada.
  - <kbd>↑</kbd> / <kbd>↓</kbd>: Navega pelas opções.
  - <kbd>Tab</kbd> (sem sugestão ativa): Insere 4 espaços de indentação padrão.
- **Orbes Aqua:** Três esferas coloridas no topo da janela (rubi, âmbar e esmeralda) no estilo clássico de janelas.
- **Numeração de Linhas:** Coluna dinâmica calculada à esquerda.
- **Catálogo de Snippets:** Modal visual para consultar todos os atalhos disponíveis para a linguagem ativa.

---

### 3.4. Validador Automatizado de Desafios & Terminal
- **Saída do Terminal:** Cores nítidas para saída padrão (*stdout*) e caixas destacadas em rubi para erros (*stderr*).
- **Aba de Testes:** Mostra individualmente cada caso de teste como **PASSOU** (verde) ou **FALHOU** (vermelho), com banner comemorativo ao atingir 100% de acertos.
- **Duração em Tempo Real:** Medição em milissegundos (`ms`) da execução.

---

### 3.5. Sistema de Gamificação & Persistência Local
- **XP e Níveis:** Cada lição concluída concede XP. O nível do desenvolvedor é calculado automaticamente com `Math.floor(userXp / 150) + 1`.
- **Ofensiva Diária (Streak):** Indicador com ícone de chama 🔥 para manter o hábito diário de codificar.
- **Missões Diárias:** Tarefas dinâmicas com progresso (ex: executar códigos, concluir lições).
- **Galeria de Conquistas:** Insígnias desbloqueáveis por marcos alcançados.
- **Persistência Anti-Falha:** Rascunhos de código (`codeDrafts`), lições concluídas, tema ativo e XP são salvos de forma resiliente no `localStorage`.

---

### 3.6. Playground Livre & Páginas Complementares
- **Playground:** Ambiente sandbox sem requisitos de testes, com seletor de templates prontos para Java, Python, JavaScript, HTML e CSS.
- **Página Inicial (Home):** Banner hero dinâmico que se adapta à trilha ativa, destaques e lista de missões.
- **Página de Conquistas:** Visualização de todas as insígnias desbloqueadas e bloqueadas.
- **Página Sobre:** Explicação detalhada da proposta educacional e da filosofia do DualDev.

---

## ⚠️ 4. Regra de Ouro Obrigatória para Modelos de IA e Desenvolvedores

> 🚨 **INSTRUÇÃO PERMANENTE DO PROJETO:**  
> **1. No código:** Sempre coloque comentários didáticos e detalhados em português explicando o que cada função, estado, hook, componente e classe faz. Nunca crie código sem comentários explicativos.  
> **2. Na resposta ao usuário:** Sempre apresente uma explicação clara e passo a passo de tudo o que foi alterado, criado ou corrigido.

---

## 📂 5. Estrutura de Pastas e Arquivos

```text
├── .github/workflows/
│   └── deploy.yml              # Pipeline de deploy automático no GitHub Pages
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx      # Editor com IntelliSense, snippets, numeração e atalhos
│   │   ├── ConsoleOutput.tsx   # Painel com abas de Terminal e Validador de Testes
│   │   ├── LanguageIcon.tsx    # Ícones SVG oficiais das linguagens
│   │   ├── Navbar.tsx          # Barra superior com logo, abas, tema, Streak e XP
│   │   └── TheoryPanel.tsx     # Explicação teórica, instruções, objetivos e dicas
│   ├── context/
│   │   └── DualDevContext.tsx  # Cérebro global: tema, XP, streak, rascunhos e lições
│   ├── data/
│   │   ├── achievements.ts     # Catálogo de conquistas desbloqueáveis
│   │   ├── lessons.ts          # Banco completo de aulas e casos de teste
│   │   ├── missions.ts         # Missões diárias
│   │   ├── snippets.ts         # Lista de atalhos e snippets por linguagem
│   │   └── tracks.ts           # Definição das 5 trilhas de ensino
│   ├── pages/
│   │   ├── AcademiaPage.tsx    # Workspace principal (Sidebar retrátil + Teoria + Editor + Console)
│   │   ├── ConquistasPage.tsx  # Galeria de insígnias e troféus
│   │   ├── HomePage.tsx        # Página inicial com cards das trilhas e missões
│   │   ├── PlaygroundPage.tsx  # Editor livre com presets prontos
│   │   └── SobrePage.tsx       # Informações sobre o projeto
│   ├── services/
│   │   └── runners.ts          # Interpretadores de código seguros rodando no browser
│   ├── types/
│   │   └── index.ts            # Definições de interfaces e tipos TypeScript
│   ├── App.tsx                 # Raiz da aplicação e orbes visuais atmosféricos
│   ├── index.css               # Estilos globais Tailwind v4 e utilitários Frutiger Aero
│   └── main.tsx                # Ponto de entrada React 19
├── index.html                  # HTML base com meta tags
├── package.json                # Dependências do projeto e scripts npm
├── tsconfig.json               # Configurações do compilador TypeScript
└── vite.config.ts              # Configuração do Vite (porta 3000, host 0.0.0.0, Tailwind v4)
```

---

## 🛠️ 6. Como Rodar Localmente

### Pré-requisitos
- **Node.js** v18 ou superior instalado.
- Gerenciador **npm** ou **yarn**.

### Comandos:
```bash
# 1. Instalar as dependências do projeto
npm install

# 2. Iniciar o servidor de desenvolvimento na porta 3000
npm run dev

# 3. Compilar para produção e verificar se não há erros
npm run build

# 4. Validar tipos TypeScript
npm run lint
```

O servidor estará disponível em: `http://localhost:3000` (ou `http://0.0.0.0:3000`).

---

## 🌐 7. Deploy no GitHub Pages

O projeto já está configurado com `base: './'` no `vite.config.ts` para funcionar em subpastas de repositórios do GitHub Pages.

Para publicar manualmente pelo terminal:
```bash
npm run deploy
```
Esse comando compilará a pasta `dist/` e publicará na branch `gh-pages` do seu repositório.
