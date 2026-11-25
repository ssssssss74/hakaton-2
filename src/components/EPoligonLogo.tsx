import React, { useState } from 'react';
import { VISUAL_ASSETS } from '../assets/visuals';

interface EPoligonLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE_CLASSES: Record<NonNullable<EPoligonLogoProps['size']>, string> = {
  xs: 'w-7 h-7 rounded-lg',
  sm: 'w-10 h-10 rounded-xl',
  md: 'w-12 h-12 rounded-xl',
  lg: 'w-16 h-16 rounded-2xl',
  xl: 'w-24 h-24 sm:w-28 sm:h-28 rounded-3xl',
};

export const EPoligonLogo: React.FC<EPoligonLogoProps> = ({
  size = 'sm',
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <span
      className={`inline-flex items-center justify-center overflow-hidden border border-[#A6BFB5] bg-[#DCE6E2] shadow-xs shrink-0 ${SIZE_CLASSES[size]} ${className}`}
    >
      {!imgError ? (
        <img
          src={VISUAL_ASSETS.epoligonLogo}
          alt="E-Poligon — HMQA rasmiy emblemasi"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover scale-110"
        />
      ) : (
        <svg
          viewBox="0 0 64 64"
          className="w-full h-full p-1"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M32 4L54 12V30C54 44.5 44.6 54.4 32 60C19.4 54.4 10 44.5 10 30V12L32 4Z"
            fill="#0F5A52"
            stroke="#D6B96E"
            strokeWidth="2.5"
          />
          <path
            d="M32 16V46M20 26H44M20 26L16 36H24L20 26ZM44 26L40 36H48L44 26Z"
            stroke="#E5CB84"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="32" cy="18" r="2.5" fill="#E5CB84" />
        </svg>
      )}
    </span>
  );
};
