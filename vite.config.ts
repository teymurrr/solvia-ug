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
          
          // UI components split by usage
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'ui-form': ['@radix-ui/react-checkbox', '@radix-ui/react-select', '@radix-ui/react-radio-group'],
          'ui-data': ['@radix-ui/react-accordion', '@radix-ui/react-tabs', '@radix-ui/react-collapsible'],
          
          // Heavy components
          'supabase': ['@supabase/supabase-js'],
          'charts': ['recharts'],
          'query': ['@tanstack/react-query'],
          
          // Utils and helpers
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          'icons': ['lucide-react']
        },
        
        // Optimize chunk sizes
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? path.basename(chunkInfo.facadeModuleId, '.tsx') : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        
        // Add cache headers via file naming
        assetFileNames: (assetInfo) => {
          // Handle undefined assetInfo.name
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
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
      },
      
      // External dependencies that shouldn't be bundled
      external: (id) => {
        // Keep tracking scripts external
        if (id.includes('googletagmanager') || id.includes('facebook') || id.includes('hotjar')) {
          return true;
        }
        return false;
      }
    },
    
    // Modern build optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 500, // Lower threshold to catch large chunks
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Sourcemap only for debugging in dev
    sourcemap: mode === 'development',
    
    // Aggressive compression
    assetsInlineLimit: 4096, // Inline small assets
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    exclude: [
      // Exclude heavy libraries from pre-bundling to enable better code splitting
      '@supabase/supabase-js',
      'recharts',
      '@tanstack/react-query'
    ]
  },
  
  // Modern CSS features
  css: {
    devSourcemap: mode === 'development',
    postcss: {
      plugins: [
        // Add autoprefixer for better browser support
      ]
    }
  },
  
  // Experimental features for better performance
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true
  }
}));
