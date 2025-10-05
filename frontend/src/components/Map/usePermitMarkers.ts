// Hook for managing permit markers on the map

import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl from 'mapbox-gl';
import CustomMarker from '../CustomMarker';
import { validateCoordinates } from './Map.utils';

export const usePermitMarkers = (
  map: React.RefObject<mapboxgl.Map | null>,
  permits: any[],
  visibleInfoCardId: string | null,
  showBoundaries: boolean,
  onPermitClick: (permit: any, coordinates: [number, number]) => void,
  onInfoCardClose: () => void
) => {
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.custom-marker-container');
    existingMarkers.forEach(marker => marker.remove());

    // Only render permits if boundaries are not shown and permits exist
    if (showBoundaries || permits.length === 0) return;

    // Loop through each permit in our permits data
    permits.forEach((permit) => {
      // Extract coordinates from permit geom
      const coordinates = permit.geom?.geometry?.coordinates;
      if (!validateCoordinates(coordinates)) return;

      // Create a container element for the React component
      const markerDiv = document.createElement('div');
      markerDiv.className = 'custom-marker-container';

      // Render the React component into the div
      const root = createRoot(markerDiv);
      
      const handleSelect = (permitId: string) => {
        const isCurrentlyVisible = visibleInfoCardId === permitId;
        
        if (isCurrentlyVisible) {
          // Clicking to close info card
          onInfoCardClose();
        } else {
          // Clicking to show info card and select permit
          const selectedPermit = permits.find(p => p._id === permitId);
          if (selectedPermit) {
            onPermitClick(selectedPermit, coordinates);
          }
        }
      };
      
      root.render(
        React.createElement(CustomMarker, {
          permit: permit,
          isSelected: visibleInfoCardId === permit._id,
          onSelect: handleSelect
        })
      );

      // Create a new marker with the custom element
      new mapboxgl.Marker({
        element: markerDiv,
        anchor: 'center',
      })
        .setLngLat(coordinates)
        .addTo(map.current!);
    });
  }, [permits, visibleInfoCardId, showBoundaries, onPermitClick]);
};