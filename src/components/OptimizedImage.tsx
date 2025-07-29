import { useState, useEffect } from 'react';
import { usePokemon } from '../hooks/usePokemon';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

export function OptimizedImage({
  src,
  alt,
  className = "",
  fallbackSrc = "https://via.placeholder.com/64x64/374151/9CA3AF?text=?"
}: OptimizedImageProps) {
  const { isImageLoaded, setImageLoaded } = usePokemon();
  const [currentSrc, setCurrentSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isImageLoaded(src)) {
      setCurrentSrc(src);
      setIsLoading(false);
      return;
    }

    setCurrentSrc(src);
    setIsLoading(true);
  }, [src, isImageLoaded]);

  const handleLoad = () => {
    setIsLoading(false);
    setImageLoaded(src);
  };

  const handleError = () => {
    setIsLoading(false);
    setCurrentSrc(fallbackSrc);
  };

  if (isImageLoaded(src)) {
    return (
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-contain drop-shadow-lg ${className}`}
        loading="lazy"
      />
    );
  }

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800/50 rounded-lg z-10">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`w-full h-full object-contain drop-shadow-lg ${isLoading ? 'opacity-0' : 'opacity-100'
          } transition-opacity duration-300`}
        loading="lazy"
      />
    </div>
  );
} 