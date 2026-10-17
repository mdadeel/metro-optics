import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import process from 'node:process'

const DEFAULT_SITE_ORIGIN = 'https://metro-optics.vercel.app'

function normalizeSiteOrigin(value) {
  try {
    return new URL(value || DEFAULT_SITE_ORIGIN).origin
  } catch {
    return DEFAULT_SITE_ORIGIN
  }
}

function seoHeadPlugin(siteOrigin, indexable) {
  return {
    name: 'metro-optics-seo-head',
    transformIndexHtml(html) {
      const robots = indexable
        ? 'index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1'
        : 'noindex,nofollow'

      return html
        .replaceAll('__METRO_OPTICS_SITE_URL__', siteOrigin)
        .replaceAll('__METRO_OPTICS_ROBOTS__', robots)
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = { ...loadEnv(mode, process.cwd(), 'VITE_'), ...process.env }
  const siteOrigin = normalizeSiteOrigin(env.VITE_APP_URL)
  const productionIndexable = mode === 'production'
    && new URL(siteOrigin).protocol === 'https:'
    && !/localhost|127\.0\.0\.1/i.test(new URL(siteOrigin).hostname)

  return {
    plugins: [react(), seoHeadPlugin(siteOrigin, productionIndexable)],
    server: {
      host: '0.0.0.0',
      allowedHosts: ['.e2b.app'],
    },
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/storage'],
            'ui-vendor': ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})
