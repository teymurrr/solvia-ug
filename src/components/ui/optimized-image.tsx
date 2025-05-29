
import React from "react";
import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: number;
  className?: string;
  priority?: boolean;
  containerClassName?: string;
  maxWidth?: string;
}

export function OptimizedImage({
  src,
  alt,
  aspectRatio = 16 / 9,
  className,
  priority = false,
  containerClassName,
  maxWidth = "100%",
  ...props
}: OptimizedImageProps) {
  return (
    <div 
      className={cn("overflow-hidden rounded-lg", containerClassName)}
      style={{ maxWidth }}
    >
      <AspectRatio ratio={aspectRatio}>
        <img
          src={src}
          alt={alt}
          className={cn(
            "object-cover w-full h-full transition-transform duration-300 hover:scale-105",
            className
          )}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          style={{
            maxWidth: "100%",
            height: "auto",
            objectFit: "cover",
          }}
          {...props}
        />
      </AspectRatio>
    </div>
  );
}
