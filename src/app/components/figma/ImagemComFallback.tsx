import React, { useState } from 'react';

type ImageWithFallbackProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  fallbackSrc?: string;
};

export function ImageWithFallback({
  src,
  alt = '',
  fallbackSrc = 'https://via.placeholder.com/1200x800?text=Imagem+indisponivel',
  onError,
  ...props
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState<string | undefined>(src);

  return (
    <img
      src={imageSrc}
      alt={alt}
      onError={(event) => {
        if (imageSrc !== fallbackSrc) {
          setImageSrc(fallbackSrc);
        }
        onError?.(event);
      }}
      {...props}
    />
  );
}
