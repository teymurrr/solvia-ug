
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
  fitMode?: "cover" | "contain";
  useAspectRatio?: boolean;
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
  ...props
}: OptimizedImageProps) {
  const imageContent = (
    <img
      src={src}
      alt={alt}
      className={cn(
        "w-full h-full transition-transform duration-300 hover:scale-105",
        fitMode === "cover" ? "object-cover" : "object-contain",
        !useAspectRatio && "h-auto",
        className
      )}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      style={{
        maxWidth: "100%",
        height: useAspectRatio ? "auto" : "auto",
        objectFit: fitMode,
      }}
      {...props}
    />
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
