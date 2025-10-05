// Hook for managing amenity markers on the map

import { useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { getAmenities } from '@/api/requests';
import { createAmenityMarkerElement } from './AmenityMarker';
import { validateCoordinates } from './Map.utils';
import { AMENITIES_RADIUS } from './Map.constants';

export const useAmenityMarkers = (
  map: React.RefObject<mapboxgl.Map | null>,
  onAmenitySelect: (amenity: any) => void
) => {
  const amenityMarkersRef = useRef<mapboxgl.Marker[]>([]);

  const clearAmenityMarkers = () => {
    amenityMarkersRef.current.forEach(marker => marker.remove());
    amenityMarkersRef.current = [];
  };

  const fetchAmenitiesAroundDevelopment = async (coordinates: [number, number]) => {
    try {
      const response = await getAmenities({
        lon: coordinates[0],
        lat: coordinates[1],
        distance: AMENITIES_RADIUS
      });
      displayAmenityMarkers(response);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const displayAmenityMarkers = (amenitiesData: any) => {
    if (!map.current || !amenitiesData.amenities) return;

    // Clear existing amenity markers
    clearAmenityMarkers();

    // Add markers for each amenity type
    Object.entries(amenitiesData.amenities).forEach(([type, amenityList]: [string, any]) => {
      if (Array.isArray(amenityList)) {
        amenityList.forEach((amenity) => {
          const coords = amenity.geom?.geometry?.coordinates;
          if (!validateCoordinates(coords)) return;

          const amenityEl = createAmenityMarkerElement(amenity, type, onAmenitySelect);

          const marker = new mapboxgl.Marker({ element: amenityEl })
            .setLngLat(coords)
            .addTo(map.current!);

          amenityMarkersRef.current.push(marker);
        });
      }
    });
  };

  return {
    clearAmenityMarkers,
    fetchAmenitiesAroundDevelopment,
    displayAmenityMarkers,
  };
};