import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

// Import the Mapbox GL CSS
// This is essential for the map to display correctly
import 'mapbox-gl/dist/mapbox-gl.css';

// Set the Mapbox access token from your .env file
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;
const Map: React.FC = () => {
  // Create a ref to hold the map container DOM element
  const mapContainer = useRef<HTMLDivElement>(null);

  // Create a ref to hold the map instance itself
  const map = useRef<mapboxgl.Map | null>(null);

  // Set the initial state for the map's center and zoom level
  const [lng] = useState(-123.1207);
  const [lat] = useState(49.2827);
  const [zoom] = useState(12);

  // The main effect for initializing the map
  useEffect(() => {
    // This prevents the map from being re-initialized on every render
    if (map.current || !mapContainer.current) return;

    // Create the new map instance
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [lng, lat],
      zoom: zoom,
    });

    // Add navigation controls (zoom in/out)
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // The cleanup function will run when the component is unmounted
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [lng, lat, zoom]); // Dependencies for initialization

  // Render the div that will contain the map
  // It's important to give it a specific height for it to be visible
  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;