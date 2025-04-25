
import React from 'react';
import { cn } from '@/lib/utils';

interface MockupProps {
  children: React.ReactNode;
  className?: string;
  type?: 'window' | 'phone' | 'browser' | 'responsive';
}

interface MockupFrameProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'medium' | 'large';
}

export const Mockup = ({ 
  children, 
  className,
  type = 'responsive'
}: MockupProps) => {
  return (
    <div className={cn(
      "w-full overflow-hidden border border-border bg-card shadow-sm",
      {
        "rounded-lg": type === 'window' || type === 'responsive',
        "rounded-[30px] max-w-[300px] mx-auto": type === 'phone',
        "rounded-t-lg": type === 'browser',
      },
      className
    )}>
      {children}
    </div>
  );
};

export const MockupFrame = ({ 
  children, 
  className,
  size = 'medium'
}: MockupFrameProps) => {
  return (
    <div className={cn(
      "relative mx-auto overflow-hidden",
      {
        "w-full max-w-3xl": size === 'small',
        "w-full max-w-4xl": size === 'medium',
        "w-full max-w-6xl": size === 'large',
      },
      className
    )}>
      {children}
    </div>
  );
};
