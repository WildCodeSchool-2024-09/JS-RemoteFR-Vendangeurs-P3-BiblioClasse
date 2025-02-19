import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate", // Enregistrer le service worker automatiquement
      manifest: {
        name: "BiblioClasse",
        short_name: "BiblioClasse",
        description: "La gestion de ma bibliothèque de classe dans ma poche",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone", // Mode hors ligne
        start_url: "/",
        icons: [
          {
            src: "/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
    }),
  ],
  server: {
    host: "0.0.0.0", // Permet à Vite d'écouter sur toutes les interfaces réseau
    port: 4173, // Assure-toi que ce port est bien celui utilisé
    proxy: {
      "/api": {
        target: "http://192.168.1.154:3310", // Si ton API fonctionne sur ce port
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
