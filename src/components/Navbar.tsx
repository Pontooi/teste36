import React from 'react';
// Hook customizado com os estados globais de navegação e gamificação
import { useDualDev } from '../context/DualDevContext';
// Catálogo das 5 linguagens de programação suportadas
import { tracks } from '../data/tracks';
import { LanguageIcon } from './LanguageIcon';
import { PWAInstallButton } from './PWAInstallButton';
// Ícones do Lucide para identificação visual rápida de cada seção
import { 
  Code2, 
  BookOpen, 
  Zap, 
  Trophy, 
  Info, 
  Terminal, 
  Compass 
} from 'lucide-react';

/**
 * Navbar: Barra de navegação superior permanente no modo escuro com acentos pastéis.
 * Inclui o botão de instalação PWA para celulares Android e iOS.
 */
export const Navbar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    userXp, 
    userLevel, 
    currentTrackId, 
    setCurrentTrackId,
  } = useDualDev();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#0e1626]/90 backdrop-blur-md shadow-sm transition-colors">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
        
        {/* Logotipo e Identidade DualDev */}
        <div className="flex items-center gap-7">
          <button 
            onClick={() => setActiveTab('inicio')}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
          >
            {/* Ícone com gradiente pastel suave entre Pêssego (#ffbe82) e Cerúleo (#6fb7db) */}
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#ffbe82] to-[#6fb7db] text-slate-950 shadow-xs group-hover:opacity-95 transition-opacity">
              <Code2 className="h-4 w-4 stroke-[2.3]" />
            </div>

            <div className="flex items-center gap-2">
              <span className="font-bold tracking-tight text-white text-base">
                Dual<span className="text-[#ffbe82]">Dev</span>
              </span>
              <span className="text-[10px] font-semibold tracking-wider text-[#9FD6F2] px-2 py-0.5 rounded-md bg-[#9FD6F2]/10 border border-[#9FD6F2]/25">
                Academy
              </span>
            </div>
          </button>

          {/* Links de Navegação Principal */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { id: 'inicio', label: 'Início', icon: Compass },
              { id: 'academia', label: 'Academia', icon: BookOpen },
              { id: 'playground', label: 'Playground', icon: Terminal },
              { id: 'conquistas', label: 'Conquistas', icon: Trophy },
              { id: 'sobre', label: 'Sobre', icon: Info },
            ].map(({ id, label, icon: Icon }) => {
              const isActive = activeTab === id;
              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id as any)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-[#1a2638] text-white border border-[#9FD6F2]/30 shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Controles de Linguagem, Botão PWA e Indicador de XP */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Botão de Instalar no Celular (PWA) */}
          <PWAInstallButton />

          {/* Seletor Rápido de Linguagem */}
          <div className="relative flex items-center">
            <div className="absolute left-2.5 pointer-events-none">
              <LanguageIcon trackId={currentTrackId} className="w-3.5 h-3.5" />
            </div>
            <select
              value={currentTrackId}
              onChange={(e) => setCurrentTrackId(e.target.value as any)}
              className="appearance-none bg-[#131d2e] border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-medium py-1.5 pl-8 pr-6 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#ffbe82]/40 transition-all"
            >
              {tracks.map((t) => (
                <option key={t.id} value={t.id} className="bg-[#0e1626]">
                  {t.name}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[9px]">
              ▼
            </div>
          </div>

          {/* Indicador de XP e Nível */}
          <div 
            title={`Nível ${userLevel} • ${userXp} Pontos de Experiência`}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#131d2e] border border-[#ffbe82]/30 text-slate-200 text-xs font-medium"
          >
            <Zap className="h-3.5 w-3.5 fill-[#ffbe82] text-[#ffbe82]" />
            <span className="font-mono font-semibold text-white">{userXp} XP</span>
            <span className="text-slate-600">|</span>
            <span className="font-mono font-semibold text-slate-400">Nv. {userLevel}</span>
          </div>

        </div>

      </div>

      {/* Sub-barra móvel para telas menores */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-800 bg-[#0e1626] px-2 py-1.5 transition-colors">
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'inicio' ? 'text-[#ffbe82] font-semibold' : 'text-slate-400'
          }`}
        >
          <Compass className="h-4 w-4 mb-0.5" />
          Início
        </button>
        <button
          onClick={() => setActiveTab('academia')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'academia' ? 'text-[#ffbe82] font-semibold' : 'text-slate-400'
          }`}
        >
          <BookOpen className="h-4 w-4 mb-0.5" />
          Academia
        </button>
        <button
          onClick={() => setActiveTab('playground')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'playground' ? 'text-[#ffbe82] font-semibold' : 'text-slate-400'
          }`}
        >
          <Terminal className="h-4 w-4 mb-0.5" />
          Playground
        </button>
        <button
          onClick={() => setActiveTab('conquistas')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'conquistas' ? 'text-[#ffbe82] font-semibold' : 'text-slate-400'
          }`}
        >
          <Trophy className="h-4 w-4 mb-0.5" />
          Conquistas
        </button>
        <button
          onClick={() => setActiveTab('sobre')}
          className={`flex flex-col items-center py-1 text-[11px] ${
            activeTab === 'sobre' ? 'text-[#ffbe82] font-semibold' : 'text-slate-400'
          }`}
        >
          <Info className="h-4 w-4 mb-0.5" />
          Sobre
        </button>
      </div>
    </header>
  );
};
