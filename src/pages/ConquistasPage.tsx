import React, { useState } from 'react';
// Hook global do DualDev para acessar conquistas, XP, nível, lições e missões diárias
import { useDualDev } from '../context/DualDevContext';
// Ícones do Lucide para ilustrar insígnias, níveis e missões
import { 
  Trophy, 
  Zap, 
  CheckCircle2, 
  Lock, 
  Terminal, 
  Cpu, 
  Layers, 
  Database, 
  Sparkles,
  CalendarCheck
} from 'lucide-react';

const ICON_MAP: Record<string, React.FC<any>> = {
  Terminal,
  Cpu,
  Layers,
  Database,
  Sparkles,
  Trophy,
};

/**
 * ConquistasPage: Central de Conquistas e Missões Diárias em Dark Pastel.
 * Modificações consolidadas:
 * - Modo claro removido.
 * - Missões diárias integradas diretamente aqui com barras de progresso pastel.
 * - Cores suaves: Pêssego Pastel (#ffbe82), Celeste (#9FD6F2) e Menta (#86efac).
 */
export const ConquistasPage: React.FC = () => {
  const { achievements, userXp, userLevel, completedLessonIds, missions } = useDualDev();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const unlockedCount = achievements.filter((a) => a.unlockedAt).length;
  const currentLevelXpFloor = (userLevel - 1) * 150;
  const nextLevelXpCeil = userLevel * 150;
  const levelProgress = Math.min(100, Math.round(((userXp - currentLevelXpFloor) / 150) * 100));

  const completedMissionsCount = missions.filter((m) => m.completed).length;

  const filteredAchievements = achievements.filter((a) => {
    if (selectedCategory === 'all') return true;
    return a.category === selectedCategory;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#0b101b]">
      
      {/* Cabeçalho da Página */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Central de Conquistas & Missões
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Acompanhe suas missões diárias, suba de nível e desbloqueie insígnias de programação.
        </p>
      </div>

      {/* Cartões de Visão Geral */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Nível do Dev */}
        <div className="aero-card p-5 space-y-3 bg-[#0f172a]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>NÍVEL DO DESENVOLVEDOR</span>
            <span className="text-[#ffbe82] font-bold font-mono">Nv. {userLevel}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">{userXp}</span>
            <span className="text-xs text-slate-400 font-mono">XP Total</span>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] font-mono text-slate-400">
              <span>Próximo nível</span>
              <span>{nextLevelXpCeil - userXp} XP restantes</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-[#ffbe82] to-[#6fb7db] transition-all duration-300"
                style={{ width: `${levelProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Missões Diárias */}
        <div className="aero-card p-5 space-y-3 bg-[#0f172a]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>MISSÕES DIÁRIAS</span>
            <CalendarCheck className="h-4 w-4 text-[#9FD6F2]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {completedMissionsCount} / {missions.length}
            </span>
            <span className="text-xs text-slate-400 font-mono">concluídas</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Reinicia todos os dias à meia-noite com novas oportunidades de ganhar XP.
          </p>
        </div>

        {/* Insígnias Desbloqueadas */}
        <div className="aero-card p-5 space-y-3 bg-[#0f172a]">
          <div className="flex items-center justify-between text-slate-400 text-xs font-semibold">
            <span>INSÍGNIAS DESBLOQUEADAS</span>
            <Trophy className="h-4 w-4 text-[#86efac]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {unlockedCount} / {achievements.length}
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            {completedLessonIds.length} lições completadas com êxito na plataforma.
          </p>
        </div>

      </div>

      {/* Seção: Missões Diárias */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#ffbe82]/15 flex items-center justify-center text-[#ffbe82]">
              <CalendarCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Missões de Hoje
            </h2>
          </div>
          <span className="text-xs text-slate-400">Conclua para acumular XP extra</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {missions.map((m) => {
            const progressPct = Math.round((m.progress / m.target) * 100);

            return (
              <div
                key={m.id}
                className="aero-card p-4 space-y-3 bg-[#0f172a]"
              >
                <div className="flex items-center justify-between">
                  <div className="font-semibold text-xs text-slate-100">
                    {m.title}
                  </div>
                  <span className="text-xs font-mono font-medium text-[#ffbe82] flex items-center gap-0.5">
                    <Zap className="h-3 w-3 fill-[#ffbe82]" />
                    +{m.xpReward} XP
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {m.description}
                </p>

                <div className="space-y-1 pt-1">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Progresso</span>
                    <span>
                      {m.progress}/{m.target}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        m.completed 
                          ? 'bg-[#86efac]' 
                          : 'bg-gradient-to-r from-[#ffbe82] to-[#6fb7db]'
                      }`}
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seção: Galeria de Conquistas */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-[#9FD6F2]/15 flex items-center justify-center text-[#9FD6F2]">
              <Trophy className="h-4 w-4" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Galeria de Insígnias
            </h2>
          </div>

          {/* Filtros de Categoria */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'java', label: 'Java' },
              { id: 'progress', label: 'Progresso' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${
                  selectedCategory === cat.id
                    ? 'bg-[#141f30] text-[#9FD6F2] border border-[#9FD6F2]/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Grade de Conquistas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredAchievements.map((ach) => {
            const Icon = ICON_MAP[ach.icon] || Trophy;
            const isUnlocked = !!ach.unlockedAt;

            return (
              <div
                key={ach.id}
                className={`aero-card p-4 flex items-start gap-3.5 transition-all bg-[#0f172a] ${
                  isUnlocked
                    ? ''
                    : 'opacity-50'
                }`}
              >
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${
                    isUnlocked
                      ? 'bg-emerald-950/40 text-[#86efac] border border-emerald-800/60'
                      : 'bg-slate-800 text-slate-500 border border-slate-700'
                  }`}
                >
                  {isUnlocked ? <Icon className="h-5 w-5" /> : <Lock className="h-4 w-4" />}
                </div>

                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h3 className="text-xs font-bold text-white truncate">{ach.title}</h3>
                    <span className="text-[10px] font-mono font-medium text-[#ffbe82] bg-[#ffbe82]/10 border border-[#ffbe82]/25 px-1.5 py-0.2 rounded shrink-0">
                      +{ach.xpReward} XP
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                    {ach.description}
                  </p>

                  <div className="pt-1 text-[10px] font-mono">
                    {isUnlocked ? (
                      <span className="text-[#86efac] flex items-center gap-1 font-medium">
                        <CheckCircle2 className="h-3 w-3" />
                        Desbloqueada
                      </span>
                    ) : (
                      <span className="text-slate-500">Bloqueada</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
