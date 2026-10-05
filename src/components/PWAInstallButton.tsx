import React, { useState, useEffect } from 'react';
import { Smartphone, Download, Share2, X, Check } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

/**
 * PWAInstallButton: Botão para instalar o DualDev como aplicativo no Celular (Android e iPhone/iOS).
 * Oculta-se automaticamente se o usuário já estiver rodando o app instalado.
 */
export const PWAInstallButton: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSModal, setShowIOSModal] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Detecta se já está rodando como app instalado no celular (standalone)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // 2. Detecta se é dispositivo iOS (iPhone / iPad)
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Captura evento nativo do Chromium/Android para disparo de instalação
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      setInstalledSuccess(true);
      setTimeout(() => setInstalledSuccess(false), 4000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Disparo de instalação nativa no Android / Chrome
  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstalled(true);
      setDeferredPrompt(null);
    }
  };

  // Se já estiver instalado como app no celular, não precisa exibir
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Botão para Android / Chrome / Computador */}
      {deferredPrompt && (
        <button
          onClick={handleInstallClick}
          title="Instalar DualDev no seu Celular"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-gradient-to-r from-[#ffbe82] to-[#6fb7db] text-slate-950 font-bold shadow-xs hover:opacity-95 transition-opacity"
        >
          <Smartphone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>
      )}

      {/* Botão para iPhone / iPad (Safari) */}
      {!deferredPrompt && isIOS && (
        <button
          onClick={() => setShowIOSModal(true)}
          title="Como instalar no iPhone"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[#141f30] border border-[#6fb7db]/40 text-[#9FD6F2] hover:bg-[#1a2b42] transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Instalar no iOS</span>
        </button>
      )}

      {/* Feedback de sucesso */}
      {installedSuccess && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-[#34d399] px-3.5 py-2 text-xs font-bold text-slate-950 shadow-xl">
          <Check className="h-4 w-4" />
          <span>App instalado com sucesso na sua tela inicial!</span>
        </div>
      )}

      {/* Modal didático com as instruções passo a passo para iPhone/iOS */}
      {showIOSModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="aero-card w-full max-w-sm p-5 space-y-4 shadow-2xl bg-[#0e1626] border border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-[#ffbe82]/20 text-[#ffbe82] flex items-center justify-center">
                  <Smartphone className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">Instalar no iPhone / iPad</h3>
                  <p className="text-[11px] text-slate-400">Adicione o DualDev como aplicativo</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSModal(false)}
                className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5 p-2 rounded-md bg-[#131d2e] border border-slate-800">
                <div className="h-6 w-6 rounded-full bg-[#ffbe82] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div>
                  Toque no botão <strong className="text-white">Compartilhar</strong> <Share2 className="inline h-3.5 w-3.5 text-[#9FD6F2]" /> na barra inferior do Safari.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-md bg-[#131d2e] border border-slate-800">
                <div className="h-6 w-6 rounded-full bg-[#6fb7db] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div>
                  Role as opções para baixo e toque em <strong className="text-white">"Adicionar à Tela de Início"</strong>.
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-2 rounded-md bg-[#131d2e] border border-slate-800">
                <div className="h-6 w-6 rounded-full bg-[#86efac] text-slate-950 font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div>
                  Toque em <strong className="text-white">Adicionar</strong> no canto superior direito. O DualDev abrirá em tela cheia como um app nativo!
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowIOSModal(false)}
              className="w-full aero-btn-primary py-2 text-xs font-bold"
            >
              Entendi, fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
