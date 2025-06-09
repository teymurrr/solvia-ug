
import React, { useState } from "react";
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
  fitMode?: "cover" | "contain";
  useAspectRatio?: boolean;
  sizes?: string;
}

export function OptimizedImage({
  src,
  alt,
  aspectRatio = 16 / 9,
  className,
  priority = false,
  containerClassName,
  maxWidth = "100%",
  fitMode = "cover",
  useAspectRatio = true,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  ...props
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate WebP and AVIF sources for modern browsers
  const getOptimizedSources = (originalSrc: string) => {
    if (originalSrc.startsWith('/lovable-uploads/')) {
      const baseName = originalSrc.split('.')[0];
      return {
        avif: `${baseName}.avif`,
        webp: `${baseName}.webp`,
        original: originalSrc
      };
    }
    return { original: originalSrc };
  };

  const sources = getOptimizedSources(src);

  const imageContent = (
    <div className="relative w-full h-full">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <picture>
        {/* AVIF format for maximum compression (newest browsers) */}
        {sources.avif && (
          <source srcSet={sources.avif} type="image/avif" sizes={sizes} />
        )}
        {/* WebP format for better compression (modern browsers) */}
        {sources.webp && (
          <source srcSet={sources.webp} type="image/webp" sizes={sizes} />
        )}
        {/* Fallback to original format */}
        <img
          src={sources.original}
          alt={alt}
          className={cn(
            "w-full h-full transition-all duration-300",
            fitMode === "cover" ? "object-cover" : "object-contain",
            !useAspectRatio && "h-auto",
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-95",
            className
          )}
          loading={priority ? "eager" : "lazy"}
          decoding={priority ? "sync" : "async"}
          sizes={sizes}
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageError(true)}
          style={{
            maxWidth: "100%",
            height: useAspectRatio ? "auto" : "auto",
            objectFit: fitMode,
          }}
          {...props}
        />
      </picture>
      {imageError && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center rounded-lg">
          <span className="text-gray-400 text-sm">Image not available</span>
        </div>
      )}
    </div>
  );

  if (!useAspectRatio) {
    return (
      <div 
        className={cn("overflow-hidden rounded-lg", containerClassName)}
        style={{ maxWidth }}
      >
        {imageContent}
      </div>
    );
  }

  return (
    <div 
      className={cn("overflow-hidden rounded-lg", containerClassName)}
      style={{ maxWidth }}
    >
      <AspectRatio ratio={aspectRatio}>
        {imageContent}
      </AspectRatio>
    </div>
  );
}
