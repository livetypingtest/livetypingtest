import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  optimizeDeps: {
    esbuildOptions: {
      jsx: 'automatic', // You can also add this if needed
    },
  },
  build: {
    target: 'esnext', // or es2020
  },
  // Disable the namespace error for JSX
  swcOptions: {
    jsc: {
      transform: {
        react: {
          throwIfNamespace: false,
        },
      },
    },
  },
})
