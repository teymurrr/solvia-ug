

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core vendor libraries
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          
          // UI components
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'ui-form': ['@radix-ui/react-checkbox', '@radix-ui/react-select', '@radix-ui/react-radio-group'],
          
          // Heavy libraries
          'supabase': ['@supabase/supabase-js'],
          'charts': ['recharts'],
          'query': ['@tanstack/react-query'],
          
          // Utils and helpers
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          'icons': ['lucide-react']
        },
        
        // Optimize chunk sizes with cache-friendly naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        
        // Enhanced asset file names for better cache control
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp|avif)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Modern build optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500,
    
    // CSS code splitting for better caching
    cssCodeSplit: true,
    
    // Sourcemap only for debugging in dev
    sourcemap: mode === 'development',
    
    // Aggressive compression with better cache headers
    assetsInlineLimit: 4096,
    
    // Enable long-term caching with content hashing
    manifest: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  
  // Modern CSS features with better caching
  css: {
    devSourcemap: mode === 'development',
    postcss: {
      plugins: []
    }
  },
  
  // Experimental features for better performance and caching
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true,
    // Add cache-friendly settings
    keepNames: false,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true
  }
}));

