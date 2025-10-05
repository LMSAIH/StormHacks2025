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
    // ICON VERSION - M made of map pins
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
      >
        {/* Background with subtle gradient feel */}
        <circle cx="50" cy="50" r="48" fill="#2563eb" />
        
        {/* M shape made from map markers - LEFT PILLAR */}
        <path
          d="M25 35 L25 65 L30 65 L30 35 Z"
          fill="white"
        />
        
        {/* M shape - LEFT PIN */}
        <path
          d="M27.5 28 C27.5 28 25 35 25 35 L30 35 C30 35 27.5 28 27.5 28 Z"
          fill="white"
        />
        <circle cx="27.5" cy="30" r="2.5" fill="#2563eb" />
        
        {/* M shape - MIDDLE PEAK (map pin pointing down) */}
        <path
          d="M50 50 C50 50 47 43 47 40 C47 37.5 48.3 35 50 35 C51.7 35 53 37.5 53 40 C53 43 50 50 50 50 Z"
          fill="white"
        />
        <circle cx="50" cy="39" r="2.5" fill="#2563eb" />
        
        {/* M shape - DIAGONAL LEFT */}
        <path
          d="M30 35 L47 40 L47 35 L32 32 Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* M shape - DIAGONAL RIGHT */}
        <path
          d="M53 35 L70 35 L68 32 L53 40 Z"
          fill="white"
          opacity="0.95"
        />
        
        {/* M shape - RIGHT PILLAR */}
        <path
          d="M70 35 L70 65 L75 65 L75 35 Z"
          fill="white"
        />
        
        {/* M shape - RIGHT PIN */}
        <path
          d="M72.5 28 C72.5 28 70 35 70 35 L75 35 C75 35 72.5 28 72.5 28 Z"
          fill="white"
        />
        <circle cx="72.5" cy="30" r="2.5" fill="#2563eb" />
      </svg>
    );
  }

  // FULL LOGO VERSION - Sick M integration
  return (
    <svg
      width={size * 4}
      height={size}
      viewBox="0 0 400 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* THE M - with map pin tops */}
      <g>
        {/* Left pillar with pin top */}
        <path
          d="M15 35 C15 35 12 42 12 42 L18 42 C18 42 15 35 15 35 Z"
          fill="#2563eb"
        />
        <circle cx="15" cy="37" r="3" fill="white" />
        <rect x="12" y="42" width="6" height="28" fill="#2563eb" />
        
        {/* Left diagonal - like a map route */}
        <path
          d="M18 45 L35 60 L35 52 L20 42 Z"
          fill="#2563eb"
          opacity="0.9"
        />
        
        {/* Middle peak - pin pointing down into the map */}
        <path
          d="M40 68 C40 68 37 60 37 56 C37 52 38.5 48 40 48 C41.5 48 43 52 43 56 C43 60 40 68 40 68 Z"
          fill="#2563eb"
        />
        <circle cx="40" cy="54" r="3.5" fill="white" />
        
        {/* Right diagonal - like a map route */}
        <path
          d="M43 52 L60 42 L62 45 L45 60 Z"
          fill="#2563eb"
          opacity="0.9"
        />
        
        {/* Right pillar with pin top */}
        <path
          d="M65 35 C65 35 62 42 62 42 L68 42 C68 42 65 35 65 35 Z"
          fill="#2563eb"
        />
        <circle cx="65" cy="37" r="3" fill="white" />
        <rect x="62" y="42" width="6" height="28" fill="#2563eb" />
        
        {/* Subtle map grid lines in background */}
        <line x1="10" y1="55" x2="70" y2="55" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
        <line x1="10" y1="65" x2="70" y2="65" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
        <line x1="25" y1="40" x2="25" y2="70" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
        <line x1="40" y1="40" x2="40" y2="70" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
        <line x1="55" y1="40" x2="55" y2="70" stroke="#93c5fd" strokeWidth="0.5" opacity="0.3" />
      </g>

      {/* apD Text - clean and bold */}
      <g transform="translate(90, 0)">
        {/* a */}
        <path
          d="M10 43 C3 43 -2 48 -2 55 C-2 62 3 67 10 67 C14 67 17 65 19 62 L19 66 L26 66 L26 43 L19 43 L19 47 C17 45 14 43 10 43 Z M11 49 C16 49 19 52 19 55 C19 58 16 61 11 61 C6 61 3 58 3 55 C3 52 6 49 11 49 Z"
          fill="#1e293b"
        />
        
        {/* p */}
        <path
          d="M40 43 C36 43 33 45 31 48 L31 43 L24 43 L24 80 L31 80 L31 62 C33 65 36 67 40 67 C47 67 52 62 52 55 C52 48 47 43 40 43 Z M39 49 C44 49 47 52 47 55 C47 58 44 61 39 61 C34 61 31 58 31 55 C31 52 34 49 39 49 Z"
          fill="#1e293b"
        />
        
        {/* D - BOLD with pin integrated on top */}
        <g>
          <path
            d="M65 30 L65 70 L83 70 C95 70 104 61 104 50 C104 39 95 30 83 30 Z M73 37 L82 37 C90 37 96 43 96 50 C96 57 90 63 82 63 L73 63 Z"
            fill="#2563eb"
          />
          {/* Pin on top of the D */}
          <path
            d="M78 24 C78 24 76 28 76 28 L80 28 C80 28 78 24 78 24 Z"
            fill="#2563eb"
          />
          <circle cx="78" cy="25.5" r="2" fill="#1e293b" />
        </g>
      </g>
    </svg>
  );
};

export default MapDLogo;
