import React, { useRef, useEffect, useState } from 'react';
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
  showBoundaries?: boolean;
};

const fetchBoundaries = async () => {
  try {
    const response = await fetch('/src/data/boundaries2.geojson');
    return await response.json();
  } catch (error) {
    console.error('Error loading boundaries:', error);
    return null;
  }
};

const Map: React.FC<MapProps> = ({ 
  setCurrentDevelopment, 
  setCurrentDevelopmentCoordinates, 
  currentDevelopmentCoordinates,
  showBoundaries = false 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<MapboxMap | null>(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState(false);
  const [selectedFeatureId, setSelectedFeatureId] = useState<number | null>(null);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    const initializeMap = async () => {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-123.1393, 49.2458],
        zoom: 12.3,
      });

      map.current.on('load', async () => {
        console.log('Map loaded');
        setIsMapLoaded(true);

        try {
          const boundariesData = await fetchBoundaries();
          if (!boundariesData) {
            throw new Error('Failed to load boundaries data');
          }

          map.current.addSource('boundaries', {
            type: 'geojson',
            data: boundariesData,
            generateId: true
          });

          // Add base fill layer
          map.current.addLayer({
            id: 'boundaries-fill',
            type: 'fill',
            source: 'boundaries',
            paint: {
              'fill-color': [
                'case',
                ['==', ['id'], selectedFeatureId],
                '#FFFFFF',  // Selected polygon color
                '#FFFFFF'   // Default color
              ],
              'fill-opacity': [
                'case',
                ['==', ['id'], selectedFeatureId],
                0.6,        // Selected opacity
                0.2         // Default opacity
              ]
            }
          });

          // Add outline layer
          map.current.addLayer({
            id: 'boundaries-line',
            type: 'line',
            source: 'boundaries',
            paint: {
              'line-color': '#FFFFFF',
              'line-width': 2
            }
          });

          // Add click interaction
          map.current.on('click', 'boundaries-fill', (e) => {
            if (e.features && e.features[0]) {
              const featureId = e.features[0].id as number;
              setSelectedFeatureId(prevId => prevId === featureId ? null : featureId);
              console.log('Clicked feature:', e.features[0].properties);
            }
          });

          // Add hover effect
          map.current.on('mouseenter', 'boundaries-fill', () => {
            if (map.current) map.current.getCanvas().style.cursor = 'pointer';
          });

          map.current.on('mouseleave', 'boundaries-fill', () => {
            if (map.current) map.current.getCanvas().style.cursor = '';
          });

          setLayersAdded(true);
        } catch (error) {
          console.error('Error setting up boundaries:', error);
        }
      });
    };

    initializeMap();

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update visibility based on showBoundaries prop
  useEffect(() => {
    if (!map.current || !isMapLoaded || !layersAdded) return;

    const visibility = showBoundaries ? 'visible' : 'none';
    map.current.setLayoutProperty('boundaries-fill', 'visibility', visibility);
    map.current.setLayoutProperty('boundaries-line', 'visibility', visibility);
  }, [showBoundaries, isMapLoaded, layersAdded]);

  // Update selected feature styling
  useEffect(() => {
    if (!map.current || !isMapLoaded || !layersAdded) return;

    map.current.setPaintProperty('boundaries-fill', 'fill-color', [
      'case',
      ['==', ['id'], selectedFeatureId],
      '#FFFFFF',  // Selected polygon color
      '#FF5733'   // Default color
    ]);

    map.current.setPaintProperty('boundaries-fill', 'fill-opacity', [
      'case',
      ['==', ['id'], selectedFeatureId],
      0.1,        // Selected opacity
      0         // Default opacity
    ]);
  }, [selectedFeatureId, isMapLoaded, layersAdded]);

  return <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />;
};

export default Map;