import React, { useEffect } from 'react';
// Provedor de contexto global com o estado da aplicação (progresso, lições, XP)
import { DualDevProvider, useDualDev } from './context/DualDevContext';
// Componente de cabeçalho global com abas de navegação e estatísticas do usuário
import { Navbar } from './components/Navbar';
// Páginas principais da aplicação
import { HomePage } from './pages/HomePage';
import { AcademiaPage } from './pages/AcademiaPage';
import { PlaygroundPage } from './pages/PlaygroundPage';
import { ConquistasPage } from './pages/ConquistasPage';
import { SobrePage } from './pages/SobrePage';

/**
 * AppContent: Componente interno que renderiza a aba ativa e o fundo visual.
 * Estética Dark com Acentos Pastéis (100% Dark Mode, Modo Claro Removido):
 * - Fundo nobre em ardósia profundo (#0b101b) com iluminação sutil em tons pastéis:
 *   • Pêssego Pastel (#ffbe82)
 *   • Azul Celeste Pastel (#9FD6F2)
 *   • Cerúleo Suave (#6fb7db)
 * - Alto conforto visual e tipografia nítida (slate-100).
 */
function AppContent() {
  const { activeTab } = useDualDev();

  // Garante a classe 'dark' no elemento raiz do documento
  useEffect(() => {
    document.documentElement.classList.add('dark');
    document.documentElement.classList.remove('light');
  }, []);

  /**
   * Renderiza condicionalmente o conteúdo da página conforme a aba selecionada na Navbar
   */
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'inicio':
        return <HomePage />;
      case 'academia':
        return <AcademiaPage />;
      case 'playground':
        return <PlaygroundPage />;
      case 'conquistas':
        return <ConquistasPage />;
      case 'sobre':
        return <SobrePage />;
      default:
        return <AcademiaPage />;
    }
  };

  return (
    <div className="dark min-h-screen flex flex-col bg-[#0b101b] text-slate-100 selection:bg-[#ffbe82]/30 selection:text-white relative overflow-x-hidden">
      
      {/* 
        Iluminação de Fundo em Tons Pastéis Suaves:
        Micro-gradientes difusos que dão um ar estético e moderno sem cansar a visão
      */}
      <div 
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden" 
        aria-hidden="true"
      >
        {/* Luz suave em Pêssego Pastel no topo esquerdo */}
        <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[#ffbe82]/10 blur-3xl" />
        {/* Luz suave em Azul Celeste Pastel na lateral direita */}
        <div className="absolute top-1/3 -right-20 h-96 w-96 rounded-full bg-[#9FD6F2]/10 blur-3xl" />
        {/* Luz suave em Cerúleo no rodapé */}
        <div className="absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-[#6fb7db]/8 blur-3xl" />
      </div>

      {/* Barra de Navegação Superior */}
      <Navbar />

      {/* Conteúdo Principal Dinâmico */}
      <main className="relative z-10 flex-1 flex flex-col">
        {renderActiveTab()}
      </main>
    </div>
  );
}

/**
 * Ponto de entrada raiz encapsulado pelo DualDevProvider
 */
export default function App() {
  return (
    <DualDevProvider>
      <AppContent />
    </DualDevProvider>
  );
}
