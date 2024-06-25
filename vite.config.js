// FILE: vite.config.js

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    // @quasar/plugin-vite options list:
    // https://github.com/quasarframework/quasar/blob/dev/vite-plugin/index.d.ts
    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  server: {
    // Configura el puerto del servidor de desarrollo (opcional)
    // port: 3000,
    // Proxy para manejar solicitudes a tu backend en desarrollo y producción
    proxy: {
      '/api': {
        target: import.meta.env.VITE_BACKEND_URL, // URL del backend en Render
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
