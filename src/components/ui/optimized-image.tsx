
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
  sizes,
  ...props
}: OptimizedImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate WebP and fallback sources
  const getOptimizedSrc = (originalSrc: string) => {
    if (originalSrc.startsWith('/lovable-uploads/')) {
      return originalSrc;
    }
    return originalSrc;
  };

  const imageContent = (
    <div className="relative w-full h-full">
      {!imageLoaded && !imageError && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
      )}
      <picture>
        <img
          src={getOptimizedSrc(src)}
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
