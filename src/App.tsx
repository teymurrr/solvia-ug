import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { LanguageProvider } from '@/hooks/useLanguage';
import { AuthProvider } from '@/contexts/AuthContext'; 
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';
import ScrollToTop from '@/components/ScrollToTop';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <LanguageProvider>
              <TooltipProvider>
                <BrowserRouter>
                  <ScrollToTop />
                  <AppRoutes />
                  <Toaster />
                </BrowserRouter>
              </TooltipProvider>
            </LanguageProvider>
          </AuthProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
