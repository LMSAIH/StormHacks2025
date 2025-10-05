import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';

// We only need to import the data
import { pointsData } from '../data/points';
import CustomMarker from './CustomMarker';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type MapProps = {
  setCurrentDevelopment: (dev: any) => void;
  setCurrentDevelopmentCoordinates: (coords: [number, number] | null) => void;
  currentDevelopmentCoordinates?: [number, number] | null;
};

const Map: React.FC<MapProps> = ({ setCurrentDevelopment, setCurrentDevelopmentCoordinates, currentDevelopmentCoordinates }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // Using the default streets style guarantees the marker icon exists
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-123.1393, 49.2458],
      zoom: 12.3,
    });

    // --- LOGIC TO ADD MULTIPLE MARKERS ---

    // The 'load' event waits for the map style to be fully loaded
    map.current.on('load', () => {
      // Add source for development zone circle
      if (map.current) {
        map.current.addSource('development-zone', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: []
          }
        });

        // Add fill layer for the development zone
        map.current.addLayer({
          id: 'development-zone-fill',
          type: 'fill',
          source: 'development-zone',
          paint: {
            'fill-color': '#3b82f6',
            'fill-opacity': 0.2
          }
        });

        // Add outline layer for the development zone
        map.current.addLayer({
          id: 'development-zone-outline',
          type: 'line',
          source: 'development-zone',
          paint: {
            'line-color': '#3b82f6',
            'line-width': 2,
            'line-opacity': 0.8
          }
        });
      }

      // Loop through each point in our data file
      pointsData.features.forEach((feature) => {
        // Create a container element for the React component
        const markerDiv = document.createElement('div');
        markerDiv.className = 'custom-marker-container';

        // Render the React component into the div
        const root = createRoot(markerDiv);
        root.render(
          <CustomMarker
            name={feature.properties?.name || 'Unknown'}
            markerType='development'
            setCurrentDevelopment={setCurrentDevelopment}
            setCurrentDevelopmentCoordinates={setCurrentDevelopmentCoordinates}
            category={feature.properties?.category || 'default'}
            coordinates={feature.geometry.coordinates as [number, number]}
          />
        );

        // Create a new marker with the custom element
        new mapboxgl.Marker({
          element: markerDiv,
          anchor: 'center',
        })
          // Set the marker's position from the feature's coordinates
          .setLngLat(feature.geometry.coordinates as [number, number])
          // Add the marker to the map
          .addTo(map.current!);
      });
    });

    const mapInstance = map.current;
    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Effect to update development zone when coordinates change
  useEffect(() => {
    if (!map.current) return;

    const source = map.current.getSource('development-zone') as mapboxgl.GeoJSONSource;
    if (!source) return;

    if (currentDevelopmentCoordinates) {
      // Create a 500m radius circle around the development coordinates
      const center = currentDevelopmentCoordinates;
      const radius = 0.5; // 500 meters in kilometers
      const options = { steps: 64, units: 'kilometers' as const };
      const circle = turf.circle(center, radius, options);

      // Update the source with the circle
      source.setData({
        type: 'FeatureCollection',
        features: [circle]
      });
    } else {
      // Clear the circle when no coordinates are set
      source.setData({
        type: 'FeatureCollection',
        features: []
      });
    }
  }, [currentDevelopmentCoordinates]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;