import React from 'react';

interface MapDLogoProps {
  className?: string;
  size?: number;
  variant?: 'full' | 'icon';
}

const MapDLogo: React.FC<MapDLogoProps> = ({ 
  className = '', 
  size = 48,
  variant = 'full' 
}) => {
  if (variant === 'icon') {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <defs>
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>
        </defs>
        
        <circle cx="50" cy="50" r="48" fill="url(#bgGrad)" />
        
        <path
          d="M 35 30 L 35 60 L 40 60 L 40 42 L 50 55 L 60 42 L 60 60 L 65 60 L 65 30 L 60 30 L 50 45 L 40 30 Z"
          fill="white"
        />
        
        <path d="M 47 60 L 50 68 L 53 60 Z" fill="white"/>
      </svg>
    );
  }

  return (
    <svg
      width={size * 3.5}
      height={size}
      viewBox="0 0 350 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="pinGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#2563eb" />
        </linearGradient>
      </defs>
      
      <g>
        <path
          d="M 25 25 L 25 55 L 30 55 L 30 37 L 40 50 L 50 37 L 50 55 L 55 55 L 55 25 L 50 25 L 40 40 L 30 25 Z"
          fill="url(#pinGrad)"
        />
        <path d="M 37 55 L 40 63 L 43 55 Z" fill="url(#pinGrad)"/>
      </g>

      <g transform="translate(75, 0)">
        <path
          d="M 5 30 L 5 70 L 13 70 L 13 45 L 25 63 L 28 63 L 40 45 L 40 70 L 48 70 L 48 30 L 40 30 L 26.5 55 L 13 30 Z"
          fill="#0f172a"
        />
        
        <path
          d="M 60 45 C 53 45 48 50 48 57 C 48 64 53 69 60 69 C 64 69 67 67 69 64 L 69 68 L 76 68 L 76 45 L 69 45 L 69 49 C 67 47 64 45 60 45 Z M 61 51 C 66 51 69 54 69 57 C 69 60 66 63 61 63 C 56 63 53 60 53 57 C 53 54 56 51 61 51 Z"
          fill="#0f172a"
        />
        
        <path
          d="M 90 45 C 86 45 83 47 81 50 L 81 45 L 74 45 L 74 82 L 81 82 L 81 64 C 83 67 86 69 90 69 C 97 69 102 64 102 57 C 102 50 97 45 90 45 Z M 89 51 C 94 51 97 54 97 57 C 97 60 94 63 89 63 C 84 63 81 60 81 57 C 81 54 84 51 89 51 Z"
          fill="#0f172a"
        />
        
        <path
          d="M 115 30 L 115 70 L 133 70 C 145 70 154 61 154 50 C 154 39 145 30 133 30 Z M 123 37 L 132 37 C 140 37 146 43 146 50 C 146 57 140 63 132 63 L 123 63 Z"
          fill="url(#pinGrad)"
        />
      </g>
    </svg>
  );
};

export default MapDLogo;
