import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from "vite-plugin-pwa";


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    VitePWA({
  registerType: "autoUpdate",
  includeAssets: [
    "icons/icon-192.png",
    "icons/icon-512.png"
  ],
  manifest: {
    name: "Gabito Dashboard",
    short_name: "Dashboard",
    description: "Gabito Energy Admin Dashboard",
    start_url: "/#admin",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#15803D",
    icons: [
      {
        src: "icons/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "icons/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      }
    ]
  }
})
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
