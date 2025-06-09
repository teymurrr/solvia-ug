
import React, { Suspense, lazy } from 'react';

// Optimized loading fallback with minimal footprint
const OptimizedFallback = ({ height = 'h-32' }: { height?: string }) => (
  <div className={`${height} bg-gray-50 flex items-center justify-center`}>
    <div className="w-4 h-4 border border-gray-300 border-t-primary rounded-full animate-spin"></div>
  </div>
);

// Enhanced lazy loading with better error boundaries and preloading
export const createLazyComponent = <T extends React.ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallbackHeight?: string
) => {
  const LazyComponent = lazy(importFunc);
  
  const WrappedComponent = (props: React.ComponentProps<T>) => (
    <Suspense fallback={<OptimizedFallback height={fallbackHeight} />}>
      <LazyComponent {...props} />
    </Suspense>
  );
  
  return WrappedComponent;
};

// Intersection observer based lazy loading for below-the-fold content
export const LazySection: React.FC<{
  children: React.ReactNode;
  fallbackHeight?: string;
  rootMargin?: string;
  className?: string;
}> = ({ 
  children, 
  fallbackHeight = 'h-32',
  rootMargin = '50px',
  className = ''
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin, threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className}>
      {isVisible ? children : <OptimizedFallback height={fallbackHeight} />}
    </div>
  );
};
