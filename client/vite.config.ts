import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),

    VitePWA({
      registerType: "autoUpdate",

      //PWA habilitado en desarrollo y SW legible
      devOptions: {
        enabled: true,
        type: "module",
      },

      // Archivos que deben quedar fuera del build
      includeAssets: [
        "icon/icon-192x192.png",
        "icon/icon-512x512.png",
      ],

      //MANIFEST DEL PWA
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

      // SERVICE WORKER / CACHE OFFLINE
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],

        runtimeCaching: [
          // Cache de PÁGINAS → permite usar la app sin internet
          {
            urlPattern: ({ request }) => request.destination === "document",
            handler: "NetworkFirst",
            options: {
              cacheName: "groovix-pages-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
            },
          },

          // Cache de API
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

          // Cache de imágenes
          {
            urlPattern: ({ request }) => request.destination === "image",
            handler: "CacheFirst",
            options: {
              cacheName: "groovix-images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 7 días
              },
            },
          },
        ],
      },
    }),
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
