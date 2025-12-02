import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['babel-plugin-react-compiler', {
            // Disable React Compiler for components that use TanStack Table
            // to avoid "use no memo" warnings
            compilationMode: 'annotation',
          }]
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: [
      '@tiptap/react',
      '@tiptap/starter-kit',
      '@tiptap/extension-image',
      '@tiptap/extension-link',
      '@tiptap/extension-placeholder',
      'use-sync-external-store',
      'use-sync-external-store/shim'
    ],
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})
