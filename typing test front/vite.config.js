import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { sitemap } from 'vite-plugin-sitemap';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://livetypingtest.com', // Replace with your site's URL
      routes: [
        '/',          // Home page
        '/about',     // Example: About page
        '/stats',  // Example: Services page
        '/contact',   // Example: Contact page
        '/leaderboard',   // Example: Contact page
        '/blog',   // Example: Contact page
        '/blog/:id',   // Example: Contact page
        '/privacy',   // Example: Contact page
        '/term-condition',   // Example: Contact page
        '/dashboard',   // Example: Contact page
      ],
    }),
  ],
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
