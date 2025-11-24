import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",

      // 🟢 HABILITAR PWA EN DESARROLLO
      devOptions: {
        enabled: true,
        type: "module",
      },

      includeAssets: ["icon/icon-192x192.png", "icon/icon-512x512.png"],

      manifest: {
        name: "Groovix",
        short_name: "Groovix",
        description: "Groovix como PWA",
        theme_color: "#ffffff",
        icons: [
          {
            src: "/icon/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },

      // 🟣 CACHE DE APIS Y DE IMÁGENES
      workbox: {
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api"),
            handler: "NetworkFirst",
            options: {
              cacheName: "groovix-api-cache",
              networkTimeoutSeconds: 3,
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24,
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "groovix-images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7,
              },
            },
          },
        ],
      },
    }),
  ],

  server: {
    proxy: {
      "/api": "https://groovixev.vercel.app/",
    },
  },
});
