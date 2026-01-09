import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleClearCacheAndReload = async () => {
    try {
      // Use the global function if available
      if (typeof window !== 'undefined' && (window as any).clearCachesAndReload) {
        await (window as any).clearCachesAndReload();
        return;
      }

      // Fallback: manual cache clearing
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.unregister();
        }
      }

      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      localStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error('Error clearing cache:', e);
      window.location.reload();
    }
  };

  private handleSimpleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="flex justify-center">
              <div className="p-4 bg-destructive/10 rounded-full">
                <AlertTriangle className="h-12 w-12 text-destructive" />
              </div>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We're sorry, but something unexpected happened. This might be due to cached data.
              </p>
            </div>

            <div className="space-y-3">
              <Button 
                onClick={this.handleSimpleReload}
                variant="outline"
                className="w-full"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              
              <Button 
                onClick={this.handleClearCacheAndReload}
                variant="default"
                className="w-full"
              >
                Clear Cache & Reload
              </Button>
            </div>

            {this.state.error && (
              <details className="text-left text-xs text-muted-foreground bg-muted p-3 rounded-md">
                <summary className="cursor-pointer">Error details</summary>
                <pre className="mt-2 overflow-auto whitespace-pre-wrap">
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
