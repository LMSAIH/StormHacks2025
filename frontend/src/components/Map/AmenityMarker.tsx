// Amenity marker component

import React from 'react';
import { createRoot } from 'react-dom/client';
import type { AmenityMarkerProps } from './Map.types';
import { getAmenityIcon, getAmenityName, getAmenityColor } from './Map.utils';

const AmenityMarker: React.FC<AmenityMarkerProps> = ({ amenity, type, onSelect }) => {
  const IconComponent = getAmenityIcon(type);
  
  return (
    <div
      className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:scale-110 transition-transform cursor-pointer hover:shadow-xl"
      title={getAmenityName(amenity, type)}
      style={{ color: getAmenityColor(type) }}
      onClick={() => onSelect({ ...amenity, type })}
    >
      <IconComponent size={18} />
    </div>
  );
};

export const createAmenityMarkerElement = (
  amenity: any,
  type: string,
  onSelect: (amenity: any) => void
): HTMLDivElement => {
  const amenityEl = document.createElement('div');
  amenityEl.className = 'amenity-marker';

  const root = createRoot(amenityEl);
  root.render(
    <AmenityMarker 
      amenity={amenity} 
      type={type} 
      onSelect={onSelect} 
    />
  );

  return amenityEl;
};

export default AmenityMarker;