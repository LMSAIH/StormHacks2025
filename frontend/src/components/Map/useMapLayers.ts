// Hook for managing map layers (boundaries, development zones)

import { useEffect } from 'react';
import * as turf from '@turf/turf';
import { 
  LAYER_IDS, 
  SOURCE_IDS, 
  DEVELOPMENT_ZONE_RADIUS 
} from './Map.constants';
import { createEmptyGeoJSONFeatureCollection } from './Map.utils';

export const useMapLayers = (
  map: React.RefObject<mapboxgl.Map | null>,
  showBoundaries: boolean,
  currentDevelopmentCoordinates: [number, number] | null,
  boundariesData: any
) => {
  // Initialize layers when map loads
  const initializeLayers = () => {
    if (!map.current) return;

    // Add development zone source
    map.current.addSource(SOURCE_IDS.DEVELOPMENT_ZONE, {
      type: 'geojson',
      data: createEmptyGeoJSONFeatureCollection()
    });

    // Add development zone fill layer
    map.current.addLayer({
      id: LAYER_IDS.DEVELOPMENT_ZONE_FILL,
      type: 'fill',
      source: SOURCE_IDS.DEVELOPMENT_ZONE,
      paint: {
        'fill-color': '#3b82f6',
        'fill-opacity': 0.2
      }
    });

    // Add development zone outline layer
    map.current.addLayer({
      id: LAYER_IDS.DEVELOPMENT_ZONE_OUTLINE,
      type: 'line',
      source: SOURCE_IDS.DEVELOPMENT_ZONE,
      paint: {
        'line-color': '#3b82f6',
        'line-width': 2,
        'line-opacity': 0.8
      }
    });

    // Add boundaries source
    map.current.addSource(SOURCE_IDS.BOUNDARIES, {
      type: 'geojson',
      data: boundariesData
    });

    // Add boundaries outline layer
    map.current.addLayer({
      id: LAYER_IDS.BOUNDARIES_OUTLINE,
      type: 'line',
      source: SOURCE_IDS.BOUNDARIES,
      paint: {
        'line-color': '#ffffff',
        'line-width': 2,
        'line-opacity': 0.8
      },
      layout: {
        'visibility': showBoundaries ? 'visible' : 'none'
      }
    });
  };

  // Update development zone when coordinates change
  useEffect(() => {
    if (!map.current) return;

    const source = map.current.getSource(SOURCE_IDS.DEVELOPMENT_ZONE) as mapboxgl.GeoJSONSource;
    if (!source) return;

    if (currentDevelopmentCoordinates) {
      // Create a circle around the development coordinates
      const center = currentDevelopmentCoordinates;
      const radius = DEVELOPMENT_ZONE_RADIUS;
      const options = { steps: 64, units: 'kilometers' as const };
      const circle = turf.circle(center, radius, options);

      // Update the source with the circle
      source.setData({
        type: 'FeatureCollection',
        features: [circle]
      });
    } else {
      // Clear the circle when no coordinates are set
      source.setData(createEmptyGeoJSONFeatureCollection());
    }
  }, [currentDevelopmentCoordinates]);

  // Update boundary visibility
  useEffect(() => {
    if (!map.current) return;

    const visibility = showBoundaries ? 'visible' : 'none';
    
    if (map.current.getLayer(LAYER_IDS.BOUNDARIES_OUTLINE)) {
      map.current.setLayoutProperty(LAYER_IDS.BOUNDARIES_OUTLINE, 'visibility', visibility);
    }
  }, [showBoundaries]);

  return {
    initializeLayers,
  };
};