import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/hooks/useLanguage';
import { AuthProvider } from '@/contexts/AuthContext'; 
import AppRoutes from '@/routes';
import ErrorBoundary from '@/components/ErrorBoundary';

const queryClient = new QueryClient();

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <LanguageProvider>
            <BrowserRouter>
              <AppRoutes />
              <Toaster />
            </BrowserRouter>
          </LanguageProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
