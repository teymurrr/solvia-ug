
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
          
          // UI components (removed charts entry)
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'ui-form': ['@radix-ui/react-checkbox', '@radix-ui/react-select', '@radix-ui/react-radio-group'],
          
          // Heavy libraries
          'supabase': ['@supabase/supabase-js'],
          'query': ['@tanstack/react-query'],
          
          // Utils and helpers
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          'icons': ['lucide-react']
        },
        
        // Optimize chunk sizes
        chunkFileNames: 'assets/[name]-[hash].js',
        
        // Add cache headers via file naming
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
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
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Sourcemap only for debugging in dev
    sourcemap: mode === 'development',
    
    // Aggressive compression
    assetsInlineLimit: 4096
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ]
  },
  
  // Modern CSS features
  css: {
    devSourcemap: mode === 'development'
  },
  
  // Experimental features for better performance
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true
  }
}));
