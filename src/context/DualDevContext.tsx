import React, { createContext, useContext, useState, useEffect } from 'react';
// Tipos TypeScript principais para lições, trilhas, missões diárias e conquistas
import { TrackId, Lesson, Mission, Achievement } from '../types';
// Base de dados com as aulas de todas as trilhas
import { allLessons, getLessonsByTrack } from '../data/lessons';
import { tracks } from '../data/tracks';
// Metadados iniciais de missões diárias e conquistas desbloqueáveis
import { initialMissions } from '../data/missions';
import { initialAchievements } from '../data/achievements';

// Aplicação 100% Dark Mode com tons pastéis (modo claro completamente removido)
export type ThemeMode = 'dark';

/**
 * Interface que documenta todas as variáveis e métodos disponíveis globalmente no DualDevContext
 */
interface DualDevContextType {
  // Controle de tema (bloqueado em dark pastel)
  theme: ThemeMode;
  toggleTheme: () => void;
  // Controle da página/aba ativa na barra de navegação superior
  activeTab: 'inicio' | 'academia' | 'playground' | 'conquistas' | 'sobre';
  setActiveTab: (tab: 'inicio' | 'academia' | 'playground' | 'conquistas' | 'sobre') => void;
  // Trilha ativa selecionada (ex: 'java', 'python', 'javascript')
  currentTrackId: TrackId;
  setCurrentTrackId: (id: TrackId) => void;
  // ID da lição aberta no momento
  currentLessonId: string;
  setCurrentLessonId: (id: string) => void;
  // Objeto completo com dados da lição em foco
  currentLesson: Lesson;
  // Gamificação: pontos de experiência e nível calculado
  userXp: number;
  userLevel: number;
  streak: number;
  // Lista de lições que já foram concluídas
  completedLessonIds: string[];
  // Rascunhos de código do usuário salvos por lição
  codeDrafts: Record<string, string>;
  saveDraft: (lessonId: string, code: string) => void;
  resetDraft: (lessonId: string) => void;
  // Conclui uma lição, atribui XP e checa desbloqueio de insígnias
  completeLesson: (lessonId: string) => void;
  // Missões diárias com progresso do usuário
  missions: Mission[];
  // Conquistas/insígnias do usuário
  achievements: Achievement[];
  // Registra que um código foi executado (avança missões diárias)
  recordCodeExecution: (trackId: TrackId) => void;
  // Funções de navegação rápida entre aulas
  nextLesson: () => void;
  prevLesson: () => void;
}

// Criação do Contexto React
const DualDevContext = createContext<DualDevContextType | undefined>(undefined);

/**
 * Função utilitária para recuperar dados JSON do LocalStorage com segurança
 */
function getSafeItem<T>(key: string, fallback: T): T {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
}

/**
 * Função utilitária para recuperar números do LocalStorage com segurança
 */
function getSafeNumber(key: string, fallback: number): number {
  try {
    const saved = localStorage.getItem(key);
    if (!saved) return fallback;
    const n = parseInt(saved, 10);
    return isNaN(n) ? fallback : n;
  } catch {
    return fallback;
  }
}

/**
 * DualDevProvider: Componente Provedor que encapsula a aplicação e fornece
 * todo o estado global persistente (XP, progresso, rascunhos, lições).
 * O tema é permanentemente dark pastel.
 */
export const DualDevProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Tema permanente: 'dark' (modo claro completamente desativado)
  const [theme] = useState<ThemeMode>('dark');
  const toggleTheme = () => {
    // Mantém no dark permanente conforme solicitação
  };

  // 2. Navegação entre abas principais
  const [activeTab, setActiveTab] = useState<'inicio' | 'academia' | 'playground' | 'conquistas' | 'sobre'>('academia');
  
  // 3. Trilha e Lição selecionadas
  const [currentTrackId, setCurrentTrackId] = useState<TrackId>('java');
  const [currentLessonId, setCurrentLessonId] = useState<string>('java-class-main');

  // 4. Estados de Gamificação e Persistência do Usuário
  const [userXp, setUserXp] = useState<number>(() => getSafeNumber('dualdev_xp', 120));
  const [streak, setStreak] = useState<number>(() => getSafeNumber('dualdev_streak', 3));
  
  // Nível calculado: 150 XP por nível
  const userLevel = Math.floor(userXp / 150) + 1;

  // 5. Lista de IDs das lições concluídas pelo usuário
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() =>
    getSafeItem<string[]>('dualdev_completed_lessons', ['java-intro-variables'])
  );

  // 6. Rascunhos de código do usuário salvos no navegador
  const [codeDrafts, setCodeDrafts] = useState<Record<string, string>>(() =>
    getSafeItem<Record<string, string>>('dualdev_code_drafts', {})
  );

  // 7. Missões diárias
  const [missions, setMissions] = useState<Mission[]>(() =>
    getSafeItem<Mission[]>('dualdev_missions', initialMissions)
  );

  // 8. Conquistas do usuário
  const [achievements, setAchievements] = useState<Achievement[]>(() =>
    getSafeItem<Achievement[]>('dualdev_achievements', initialAchievements)
  );

  // Garante que o documento HTML tenha sempre a classe 'dark'
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
    try {
      localStorage.setItem('dualdev_theme', 'dark');
    } catch {
      // Ignora erro de storage
    }
  }, []);

  // Salva XP no localStorage quando atualizado
  useEffect(() => {
    try {
      localStorage.setItem('dualdev_xp', userXp.toString());
    } catch {
      // Ignora erro
    }
  }, [userXp]);

  // Salva lições concluídas no localStorage
  useEffect(() => {
    try {
      localStorage.setItem('dualdev_completed_lessons', JSON.stringify(completedLessonIds));
    } catch {
      // Ignora erro
    }
  }, [completedLessonIds]);

  // Salva rascunhos de código
  useEffect(() => {
    try {
      localStorage.setItem('dualdev_code_drafts', JSON.stringify(codeDrafts));
    } catch {
      // Ignora erro
    }
  }, [codeDrafts]);

  // Salva missões diárias
  useEffect(() => {
    try {
      localStorage.setItem('dualdev_missions', JSON.stringify(missions));
    } catch {
      // Ignora erro
    }
  }, [missions]);

  // Salva conquistas
  useEffect(() => {
    try {
      localStorage.setItem('dualdev_achievements', JSON.stringify(achievements));
    } catch {
      // Ignora erro
    }
  }, [achievements]);

  // Busca a lição atual ativa
  const currentLesson =
    allLessons.find((l) => l.id === currentLessonId) ||
    getLessonsByTrack(currentTrackId)[0] ||
    allLessons[0];

  // Persiste um rascunho de código
  const saveDraft = (lessonId: string, code: string) => {
    setCodeDrafts((prev) => ({ ...prev, [lessonId]: code }));
  };

  // Restaura o código inicial da lição
  const resetDraft = (lessonId: string) => {
    setCodeDrafts((prev) => {
      const copy = { ...prev };
      delete copy[lessonId];
      return copy;
    });
  };

  // Conclui uma lição, atribui XP e checa conquistas
  const completeLesson = (lessonId: string) => {
    const targetLesson = allLessons.find((l) => l.id === lessonId);
    if (!targetLesson) return;

    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      setUserXp((prev) => prev + targetLesson.xp);

      // Avança a missão de concluir lições
      setMissions((prev) =>
        prev.map((m) => {
          if (m.id === 'm1' && !m.completed) {
            const nextProgress = m.progress + 1;
            const completed = nextProgress >= m.target;
            if (completed) {
              setUserXp((xp) => xp + m.xpReward);
            }
            return { ...m, progress: nextProgress, completed };
          }
          return m;
        })
      );

      // Checa desbloqueio de conquista
      checkAchievementsOnLessonComplete(lessonId);
    }
  };

  // Valida conquistas desbloqueadas
  const checkAchievementsOnLessonComplete = (lessonId: string) => {
    const updatedCount = completedLessonIds.includes(lessonId)
      ? completedLessonIds.length
      : completedLessonIds.length + 1;

    setAchievements((prev) =>
      prev.map((a) => {
        if (a.id === 'first-code' && !a.unlockedAt) {
          return { ...a, unlockedAt: new Date().toISOString() };
        }
        if (a.id === 'five-lessons' && updatedCount >= 5 && !a.unlockedAt) {
          return { ...a, unlockedAt: new Date().toISOString() };
        }
        return a;
      })
    );
  };

  // Registra execução de código
  const recordCodeExecution = (trackId: TrackId) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id === 'm2' && !m.completed) {
          const nextProgress = m.progress + 1;
          const completed = nextProgress >= m.target;
          if (completed) {
            setUserXp((xp) => xp + m.xpReward);
          }
          return { ...m, progress: nextProgress, completed };
        }
        return m;
      })
    );
  };

  // Navega para a próxima lição
  const nextLesson = () => {
    const trackLessons = getLessonsByTrack(currentTrackId);
    const currentIndex = trackLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex >= 0 && currentIndex < trackLessons.length - 1) {
      setCurrentLessonId(trackLessons[currentIndex + 1].id);
    }
  };

  // Volta para a lição anterior
  const prevLesson = () => {
    const trackLessons = getLessonsByTrack(currentTrackId);
    const currentIndex = trackLessons.findIndex((l) => l.id === currentLessonId);
    if (currentIndex > 0) {
      setCurrentLessonId(trackLessons[currentIndex - 1].id);
    }
  };

  return (
    <DualDevContext.Provider
      value={{
        theme,
        toggleTheme,
        activeTab,
        setActiveTab,
        currentTrackId,
        setCurrentTrackId,
        currentLessonId,
        setCurrentLessonId,
        currentLesson,
        userXp,
        userLevel,
        streak,
        completedLessonIds,
        codeDrafts,
        saveDraft,
        resetDraft,
        completeLesson,
        missions,
        achievements,
        recordCodeExecution,
        nextLesson,
        prevLesson,
      }}
    >
      {children}
    </DualDevContext.Provider>
  );
};

/**
 * Hook customizado para consumir o contexto DualDev com validação de inicialização
 */
export const useDualDev = () => {
  const context = useContext(DualDevContext);
  if (!context) {
    throw new Error('useDualDev deve ser utilizado dentro de um DualDevProvider');
  }
  return context;
};
