import React, { useRef, useEffect } from 'react';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// We only need to import the data
import { pointsData } from '../data/points';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map: React.FC = () => {
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
      // Loop through each point in our data file
      pointsData.features.forEach((feature) => {
        // Create a new marker for each feature
        new mapboxgl.Marker()
          // Set the marker's position from the feature's coordinates
          .setLngLat(feature.geometry.coordinates as [number, number])
          // Add the marker to the map
          .addTo(map.current!);
      });
    });

    // --- END OF MARKER LOGIC ---
    
    const mapInstance = map.current;
    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;