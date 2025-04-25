
import React from 'react';
import { cn } from '@/lib/utils';

interface GlowProps {
  className?: string;
  variant?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

export const Glow = ({ 
  className,
  variant = 'center'
}: GlowProps) => {
  return (
    <div 
      className={cn(
        "absolute pointer-events-none",
        {
          "top-0 left-[50%] translate-x-[-50%] h-[250px] w-[50%]": variant === 'top',
          "bottom-0 left-[50%] translate-x-[-50%] h-[250px] w-[50%]": variant === 'bottom',
          "left-0 top-[50%] translate-y-[-50%] h-[50%] w-[250px]": variant === 'left',
          "right-0 top-[50%] translate-y-[-50%] h-[50%] w-[250px]": variant === 'right',
          "top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] h-[50%] w-[50%]": variant === 'center',
        },
        "bg-primary/20 blur-[100px] rounded-full",
        className
      )}
    />
  );
};
