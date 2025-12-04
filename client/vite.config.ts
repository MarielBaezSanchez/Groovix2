import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
  registerType: "autoUpdate",

  // Queremos SOLO el manifest, NO el SW automático
  strategies: "injectManifest",

  srcDir: "public",
  filename: "sw.js",   // tu service worker manual

  devOptions: {
    enabled: true,
    type: "module",
  },

  includeAssets: [
    "public/icon/icon-192x192.png",
    "public/icon/icon-512x512.png",
  ],

  manifest: {
    name: "Groovix",
    short_name: "Groovix",
    description: "Groovix como PWA",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",

    icons: [
      {
        src: "public/icon/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "public/icon/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
})

  ],

  // CONFIG SERVER
  server: {
    host: true,
    port: 5173,

    // Cambiar esta URL cuando uses backend en Vercel
    proxy: {
      "/api": "http://localhost:5000",
    },
  },

  
});
