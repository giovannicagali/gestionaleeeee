import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Non forzare refresh durante modifiche non sincronizzate.
      registerType: 'prompt',
      injectRegister: false,
      includeAssets: ['icons/favicon.svg', 'icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'App Schede D&D', short_name: 'Schede D&D',
        description: 'Gestione privata di personaggi D&D 5e 2014',
        lang: 'it', start_url: '/', scope: '/',
        display: 'standalone', theme_color: '#1f2932', background_color: '#f4eddb',
        icons: [
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: {
        // Solo app shell e asset statici. Vietato cache HTTP dei dati utente.
        globPatterns: ['**/*.{html,js,css,png,svg,ico,webp}'],
        navigateFallback: '/index.html',
        runtimeCaching: []
      }
    })
  ]
});
