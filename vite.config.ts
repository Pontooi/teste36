// Plugin oficial do Tailwind CSS v4 para Vite (compilação rápida de utilitários)
import tailwindcss from '@tailwindcss/vite';
// Plugin oficial do React para Vite (suporte a JSX/TSX e Fast Refresh)
import react from '@vitejs/plugin-react';
// Módulo de manipulação de caminhos do Node.js
import path from 'path';
// Utilitário para definição tipada de configuração do Vite
import { defineConfig } from 'vite';

/**
 * Configuração principal do bundler Vite para o DualDev:
 * - base: './' para suporte a caminhos relativos em qualquer ambiente
 * - server: define a porta obrigatória 3000 e escuta em 0.0.0.0 para acesso externo
 * - resolve.alias: mapeia '@' para a raiz do projeto
 */
export default defineConfig(() => {
  return {
    // Caminho base relativo para carregamento de assets
    base: './',
    // Plugins de compilação: React + Tailwind CSS v4
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        // Alias '@' que aponta para a raiz do repositório
        '@': path.resolve('.'),
      },
    },
    server: {
      // Porta 3000 exigida pelo ambiente de execução do AI Studio
      port: 3000,
      // Host 0.0.0.0 permite conexões através de proxy e do container
      host: '0.0.0.0',
      // Desativa HMR quando a variável de ambiente DISABLE_HMR for 'true'
      hmr: process.env.DISABLE_HMR !== 'true',
      // Desativa o monitoramento excessivo de arquivos quando DISABLE_HMR for 'true'
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
