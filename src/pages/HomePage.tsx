import React from 'react';
// Contexto global da aplicação com trilha ativa e lições
import { useDualDev } from '../context/DualDevContext';
// Base estática das trilhas e lições
import { tracks } from '../data/tracks';
import { getLessonsByTrack } from '../data/lessons';
import { LanguageIcon } from '../components/LanguageIcon';
import { TrackId } from '../types';
// Ícones do Lucide
import { 
  Play, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Cpu, 
  Layers, 
  Database, 
  Check, 
  Trophy 
} from 'lucide-react';

/**
 * Textos descritivos em destaque para o banner Hero de cada linguagem
 */
const TRACK_HERO_CONTENT: Record<TrackId, {
  highlight: string;
  headline: string;
  description: string;
}> = {
  java: {
    highlight: 'Java',
    headline: 'e programação orientada a objetos na prática.',
    description: 'Execute seu código diretamente no navegador. Domine classes, método main, métodos estáticos tipados e manipulação de arrays e strings com feedback instantâneo.',
  },
  python: {
    highlight: 'Python',
    headline: 'e a sintaxe limpa de inteligência artificial e scripts.',
    description: 'Escreva código limpo, conciso e elegante. Domine a função print, controle de fluxo com if/elif/else, listas dinâmicas, laços for in e funções reutilizáveis.',
  },
  javascript: {
    highlight: 'JavaScript',
    headline: 'e o ecossistema moderno da Web interativa.',
    description: 'Aprenda a linguagem que move a web moderna: variáveis com escopo seguro (let/const), template literals, arrow functions, programação funcional e objetos.',
  },
  html: {
    highlight: 'HTML5',
    headline: 'e a estruturação semântica e acessível da Web.',
    description: 'A base de qualquer aplicação online: crie páginas estruturadas com cabeçalhos semânticos, menus de navegação, formulários interativos e mídias acessíveis.',
  },
  css: {
    highlight: 'CSS3',
    headline: 'e o design responsivo de interfaces modernas.',
    description: 'Transforme código em designs marcantes: domine o Box Model, alinhamentos com Flexbox, layouts com CSS Grid, tipografia e microinterações fluidas.',
  },
};

const ICONS_BY_CATEGORY: Record<string, React.FC<any>> = {
  Fundamentos: Cpu,
  'Estrutura Básica': Cpu,
  'Estruturação Web': Layers,
  'Estruturas de Dados': Database,
  'Controle de Fluxo': Layers,
  Funções: Layers,
  Modularização: Layers,
  Layout: Layers,
  'Estilos e Design': Database,
};

/**
 * HomePage: Página inicial em Dark Mode com cores pastéis.
 * Destaques Visuais:
 * - Acentos em Pêssego Pastel (#ffbe82) e Celeste (#9FD6F2)
 * - Fundo nobre (#0b101b) com cartões em ardósia (#0f172a)
 */
export const HomePage: React.FC = () => {
  const { 
    setActiveTab, 
    currentTrackId, 
    setCurrentTrackId, 
    setCurrentLessonId, 
    completedLessonIds 
  } = useDualDev();

  const currentTrack = tracks.find((t) => t.id === currentTrackId) || tracks[0];
  const activeTrackLessons = getLessonsByTrack(currentTrackId);
  const heroInfo = TRACK_HERO_CONTENT[currentTrackId] || TRACK_HERO_CONTENT.java;

  const handleSelectTrack = (trackId: TrackId) => {
    setCurrentTrackId(trackId);
    const trackLessons = getLessonsByTrack(trackId);
    if (trackLessons.length > 0) {
      setCurrentLessonId(trackLessons[0].id);
    }
  };

  const handleEnterAcademia = (lessonId?: string) => {
    if (lessonId) {
      setCurrentLessonId(lessonId);
    } else if (activeTrackLessons.length > 0) {
      setCurrentLessonId(activeTrackLessons[0].id);
    }
    setActiveTab('academia');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Banner de Boas-Vindas Hero */}
      <div className="rounded-2xl border border-slate-800 bg-[#0f172a] p-8 sm:p-12 shadow-sm">
        <div className="max-w-2xl space-y-4">
          
          {/* Badge de Trilha Ativa */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#9FD6F2]/10 text-[#9FD6F2] border border-[#9FD6F2]/25 text-xs font-medium">
            <Sparkles className="h-3.5 w-3.5 text-[#ffbe82]" />
            <span>Trilha {currentTrack.name} Ativa</span>
          </div>

          {/* Título Principal */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Domine{' '}
            <span className="text-[#ffbe82]">
              {heroInfo.highlight}
            </span>{' '}
            {heroInfo.headline}
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            {heroInfo.description}
          </p>

          {/* Botões de Ação Rápida */}
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              onClick={() => handleEnterAcademia()}
              className="aero-btn-primary px-5 py-2.5 text-sm shadow-xs"
            >
              <Play className="h-4 w-4 mr-2 fill-slate-950" />
              <span>Acessar Academia {currentTrack.name}</span>
            </button>

            <button
              onClick={() => setActiveTab('playground')}
              className="aero-btn-glass px-5 py-2.5 text-sm"
            >
              <Code2 className="h-4 w-4 mr-2 text-[#9FD6F2]" />
              <span>Playground Livre</span>
            </button>

            <button
              onClick={() => setActiveTab('conquistas')}
              className="aero-btn-glass px-4 py-2.5 text-sm"
            >
              <Trophy className="h-4 w-4 mr-1.5 text-[#ffbe82]" />
              <span>Missões & Conquistas</span>
            </button>
          </div>
        </div>
      </div>

      {/* Destaques das Primeiras Lições da Trilha Ativa */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Destaques de {currentTrack.name}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {activeTrackLessons.length} exercícios práticos com execução e testes em tempo real:
            </p>
          </div>

          <button
            onClick={() => handleEnterAcademia()}
            className="flex items-center gap-1 text-xs font-medium text-[#9FD6F2] hover:underline transition-colors"
          >
            <span>Ver todas as lições</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeTrackLessons.slice(0, 3).map((item) => {
            const Icon = ICONS_BY_CATEGORY[item.category] || Cpu;
            const isCompleted = completedLessonIds.includes(item.id);

            return (
              <div
                key={item.id}
                onClick={() => handleEnterAcademia(item.id)}
                className="aero-card group cursor-pointer p-5 transition-all hover:border-[#6fb7db]"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#141f30] text-[#9FD6F2]">
                    <Icon className="h-4 w-4" />
                  </div>

                  {isCompleted ? (
                    <span className="flex items-center gap-1 text-[11px] font-medium text-[#86efac] bg-emerald-950/40 border border-emerald-800/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="h-3 w-3" />
                      Concluído
                    </span>
                  ) : (
                    <span className="text-[11px] font-mono font-medium text-[#ffbe82] bg-[#ffbe82]/10 border border-[#ffbe82]/30 px-2 py-0.5 rounded-md">
                      +{item.xp} XP
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-semibold text-[#6fb7db] mb-1">
                  {item.category}
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-[#9FD6F2] transition-colors mb-1.5">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center gap-1 text-xs font-medium text-slate-300 group-hover:text-[#9FD6F2] transition-colors">
                  <span>Praticar exercício</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Catálogo Completo de Trilhas Disponíveis */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Todas as Trilhas de Aprendizagem
          </h2>
          <span className="text-xs text-slate-400">
            Clique em uma trilha para ativá-la
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tracks.map((t) => {
            const isSelected = t.id === currentTrackId;

            return (
              <div
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`aero-card cursor-pointer p-4 transition-all relative ${
                  isSelected
                    ? 'border-[#6fb7db] ring-1 ring-[#6fb7db] bg-[#141f30]'
                    : 'hover:border-slate-700'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#ffbe82] text-slate-950">
                    <Check className="h-3 w-3 stroke-[2.5]" />
                    <span>Ativa</span>
                  </div>
                )}

                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <LanguageIcon trackId={t.id} className="w-4 h-4" />
                    <span className="text-sm font-bold text-white">{t.name}</span>
                  </div>
                  {!isSelected && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      {t.totalLessons} lições
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed mb-3">
                  {t.tagline}
                </p>
                <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <span className="font-mono text-slate-300">{t.totalXp} XP • {t.totalLessons} aulas</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectTrack(t.id);
                      setActiveTab('academia');
                    }}
                    className="text-[#9FD6F2] hover:underline flex items-center gap-1 font-medium"
                  >
                    <span>Entrar</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
