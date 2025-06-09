
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
          // Core vendor libraries - keep minimal
          'vendor-core': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          
          // UI components - split by usage pattern
          'ui-essential': [
            '@radix-ui/react-slot', 
            '@radix-ui/react-dialog', 
            '@radix-ui/react-dropdown-menu'
          ],
          'ui-forms': [
            '@radix-ui/react-checkbox', 
            '@radix-ui/react-select', 
            '@radix-ui/react-radio-group',
            'react-hook-form',
            '@hookform/resolvers'
          ],
          'ui-complex': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-navigation-menu'
          ],
          
          // Auth and data
          'auth-data': ['@supabase/supabase-js', '@tanstack/react-query'],
          
          // Heavy libraries - defer loading
          'charts': ['recharts'],
          
          // Route-specific chunks
          'landing-core': [
            '/src/components/landing/HeroSection',
            '/src/components/landing/WhySolviaSectionOptimized'
          ],
          'landing-secondary': [
            '/src/components/landing/TimelineSection',
            '/src/components/landing/ProfessionalsSection',
            '/src/components/landing/VacanciesSection'
          ],
          'landing-tertiary': [
            '/src/components/landing/InsightsSection',
            '/src/components/landing/BlogSection',
            '/src/components/landing/LearningSection',
            '/src/components/landing/CTASection'
          ],
          
          // Admin features - separate bundle
          'admin': [
            '/src/components/admin/blog/StatisticCard',
            '/src/components/admin/blog/BlogViewsChart',
            '/src/components/admin/blog/TopPostsChart',
            '/src/components/admin/blog/CategoryDistributionChart'
          ],
          
          // Dashboard features
          'dashboard-professional': [
            '/src/components/professional-dashboard/FilterBar',
            '/src/components/professional-dashboard/VacancySearch',
            '/src/components/professional-dashboard/ProfileCard'
          ],
          'dashboard-institution': [
            '/src/components/institution-dashboard/DashboardHeader',
            '/src/components/institution-dashboard/TalentsTab',
            '/src/components/institution-dashboard/VacanciesTab'
          ],
          
          // Utilities and helpers
          'utils': ['clsx', 'tailwind-merge', 'class-variance-authority', 'date-fns'],
          'icons': ['lucide-react']
        },
        
        // Optimize chunk sizes for mobile
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk';
          return `assets/js/${name}-[hash].js`;
        },
        
        // Optimize asset naming
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
    
    // Aggressive optimizations for mobile
    target: 'es2020',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 200, // Smaller chunks for better caching
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Sourcemap only for debugging in dev
    sourcemap: mode === 'development',
    
    // More aggressive compression
    assetsInlineLimit: 1024 // Smaller inline limit
  },
  
  // Optimize dependencies and fix Supabase ESM/CJS conflict
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'lucide-react',
      '@supabase/supabase-js'
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: [
      'recharts'
    ],
    // Force ESM for Supabase to resolve module conflicts
    esbuildOptions: {
      target: 'es2020'
    }
  },
  
  // Modern CSS features
  css: {
    devSourcemap: mode === 'development'
  },
  
  // Enhanced build optimizations
  esbuild: {
    target: 'es2020',
    legalComments: 'none',
    treeShaking: true,
    // Remove console logs in production
    drop: mode === 'production' ? ['console', 'debugger'] : []
  },

  // Define globals to resolve module conflicts
  define: {
    global: 'globalThis',
  }
}));
