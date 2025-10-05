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
    console.log('fetchAmenitiesAroundDevelopment called with:', coordinates);
    try {
      const response = await getAmenities({
        lon: coordinates[0],
        lat: coordinates[1],
        distance: AMENITIES_RADIUS
      });
      console.log('Amenities API response:', response);
      displayAmenityMarkers(response);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const displayAmenityMarkers = (amenitiesData: any) => {
    console.log('displayAmenityMarkers called with:', amenitiesData);
    if (!map.current || !amenitiesData.amenities) {
      console.log('Early return - map or amenities missing:', { 
        hasMap: !!map.current, 
        hasAmenities: !!amenitiesData.amenities 
      });
      return;
    }

    // Clear existing amenity markers
    clearAmenityMarkers();

    // Add markers for each amenity type
    Object.entries(amenitiesData.amenities).forEach(([type, amenityList]: [string, any]) => {
      console.log(`Processing amenity type: ${type}, count: ${Array.isArray(amenityList) ? amenityList.length : 0}`);
      if (Array.isArray(amenityList)) {
        amenityList.forEach((amenity) => {
          const coords = amenity.geom?.geometry?.coordinates;
          if (!validateCoordinates(coords)) {
            console.log('Invalid coordinates for amenity:', amenity);
            return;
          }

          const amenityEl = createAmenityMarkerElement(amenity, type, onAmenitySelect);

          const marker = new mapboxgl.Marker({ element: amenityEl })
            .setLngLat(coords)
            .addTo(map.current!);

          amenityMarkersRef.current.push(marker);
          console.log('Added marker for:', amenity.name, 'at', coords);
        });
      }
    });
    console.log(`Total amenity markers created: ${amenityMarkersRef.current.length}`);
  };

  return {
    clearAmenityMarkers,
    fetchAmenitiesAroundDevelopment,
    displayAmenityMarkers,
  };
};