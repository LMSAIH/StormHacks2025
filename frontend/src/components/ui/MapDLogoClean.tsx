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
    // Clean icon - simple map pin without weird middle part
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        <circle cx="50" cy="50" r="48" fill="#2563eb" />
        <path
          d="M50 25C41.7157 25 35 31.7157 35 40C35 51.25 50 65 50 65C50 65 65 51.25 65 40C65 31.7157 58.2843 25 50 25Z"
          fill="white"
        />
        <circle cx="50" cy="40" r="8" fill="#2563eb" />
      </svg>
    );
  }

  // Full logo with text
  return (
    <svg
      width={size * 3.5}
      height={size}
      viewBox="0 0 350 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g>
        <path
          d="M50 20C39.507 20 31 28.507 31 39C31 53.75 50 70 50 70C50 70 69 53.75 69 39C69 28.507 60.493 20 50 20Z"
          fill="#2563eb"
        />
        <circle cx="50" cy="39" r="8" fill="white" />
      </g>

      <g transform="translate(95, 0)">
        <path
          d="M10 30 L10 70 L18 70 L18 45 L30 63 L33 63 L45 45 L45 70 L53 70 L53 30 L45 30 L31.5 55 L18 30 Z"
          fill="#1e293b"
        />
        
        <path
          d="M65 43 C58 43 53 48 53 55 C53 62 58 67 65 67 C69 67 72 65 74 62 L74 66 L81 66 L81 43 L74 43 L74 47 C72 45 69 43 65 43 Z M66 49 C71 49 74 52 74 55 C74 58 71 61 66 61 C61 61 58 58 58 55 C58 52 61 49 66 49 Z"
          fill="#1e293b"
        />
        
        <path
          d="M95 43 C91 43 88 45 86 48 L86 43 L79 43 L79 80 L86 80 L86 62 C88 65 91 67 95 67 C102 67 107 62 107 55 C107 48 102 43 95 43 Z M94 49 C99 49 102 52 102 55 C102 58 99 61 94 61 C89 61 86 58 86 55 C86 52 89 49 94 49 Z"
          fill="#1e293b"
        />
        
        <path
          d="M120 30 L120 70 L138 70 C150 70 159 61 159 50 C159 39 150 30 138 30 Z M128 37 L137 37 C145 37 151 43 151 50 C151 57 145 63 137 63 L128 63 Z"
          fill="#2563eb"
        />
      </g>
    </svg>
  );
};

export default MapDLogo;
