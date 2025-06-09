
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
          
          // UI components - optimized grouping
          'ui-core': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-toast'],
          'ui-form': ['@radix-ui/react-checkbox', '@radix-ui/react-select', '@radix-ui/react-radio-group'],
          
          // Heavy libraries
          'supabase': ['@supabase/supabase-js'],
          'charts': ['recharts'],
          'query': ['@tanstack/react-query'],
          
          // Landing page components - bundle together
          'landing': [
            '/src/components/landing/TimelineSection',
            '/src/components/landing/ProfessionalsSection',
            '/src/components/landing/VacanciesSection',
            '/src/components/landing/InsightsSection',
            '/src/components/landing/BlogSection',
            '/src/components/landing/LearningSection',
            '/src/components/landing/CTASection'
          ],
          
          // Admin components
          'admin': [
            '/src/components/admin/blog/StatisticCard',
            '/src/components/admin/blog/BlogViewsChart',
            '/src/components/admin/blog/TopPostsChart',
            '/src/components/admin/blog/CategoryDistributionChart'
          ],
          
          // Utils and helpers
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          'icons': ['lucide-react']
        },
        
        // Optimize chunk sizes for mobile
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        
        // Add cache headers via file naming
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) {
            return `assets/[name]-[hash][extname]`;
          }
          
          if (/\.(css)$/.test(assetInfo.name)) {
            return `assets/css/[name]-[hash][extname]`;
          }
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico|webp)$/i.test(assetInfo.name)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        }
      }
    },
    
    // Modern build optimizations for mobile
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 300, // Smaller chunks for mobile
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Sourcemap only for debugging in dev
    sourcemap: mode === 'development',
    
    // Aggressive compression for mobile
    assetsInlineLimit: 2048 // Smaller inline limit for mobile
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react'
    ],
    // Exclude heavy deps from pre-bundling to allow for better splitting
    exclude: ['@supabase/supabase-js', 'recharts']
  },
  
  // Modern CSS features
  css: {
    devSourcemap: mode === 'development'
  },
  
  // Experimental features for better performance
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true,
    // Remove console logs in production for mobile performance
    drop: mode === 'production' ? ['console', 'debugger'] : []
  }
}));
