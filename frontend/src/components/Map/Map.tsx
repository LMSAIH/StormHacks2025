// Main Map component using modular hooks and utilities

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getDevelopmentPermits } from '@/api/requests';
import 'mapbox-gl/dist/mapbox-gl.css';

import AmenityModal from '../AmenityModal';
import boundariesData from '@/data/boundaries2.geojson';

import type { MapProps } from './Map.types';
import { 
  VANCOUVER_CENTER, 
  DEFAULT_ZOOM, 
  PERMIT_ZOOM, 
  MAP_STYLE, 
  DEFAULT_PERMITS_QUERY 
} from './Map.constants';
import { validateCoordinates } from './Map.utils';
import { useMapState } from './useMapState';
import { useAmenityMarkers } from './useAmenityMarkers';
import { usePermitMarkers } from './usePermitMarkers';
import { useMapLayers } from './useMapLayers';

// Set Mapbox access token
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const Map: React.FC<MapProps> = ({
  onPermitsLoad,
  onPermitSelect,
  selectedPermitId: externalSelectedPermitId,
  showBoundaries = false,
  permits: externalPermits = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  // Use state management hook
  const {
    internalPermits,
    internalSelectedPermitId,
    visibleInfoCardId,
    selectedAmenity,
    showAmenityModal,
    setInternalPermits,
    setInternalSelectedPermitId,
    setVisibleInfoCardId,
    setSelectedAmenity,
    setShowAmenityModal,
  } = useMapState();

  // Determine which permits and selection to use
  const permits = externalPermits.length > 0 ? externalPermits : internalPermits;
  const selectedPermitId = externalSelectedPermitId !== undefined ? externalSelectedPermitId : internalSelectedPermitId;

  // Derive coordinates from selected permit
  const selectedPermit = permits.find(p => p._id === selectedPermitId);
  const currentDevelopmentCoordinates = selectedPermit?.geom?.geometry?.coordinates || null;

  // Initialize amenity markers hook
  const { clearAmenityMarkers, fetchAmenitiesAroundDevelopment } = useAmenityMarkers(
    map,
    (amenity) => {
      setSelectedAmenity(amenity);
      setShowAmenityModal(true);
    }
  );

  // Initialize map layers hook
  const { initializeLayers } = useMapLayers(
    map,
    showBoundaries,
    currentDevelopmentCoordinates,
    boundariesData
  );

  // Utility functions
  const zoomToPermit = (coordinates: [number, number]) => {
    if (map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: PERMIT_ZOOM,
        duration: 1500,
        essential: true
      });
    }
  };

  const handlePermitClick = (permit: any, coordinates: [number, number]) => {
    // Update visible info card
    setVisibleInfoCardId(permit._id);
    
    // Update selection if this is a new permit
    if (selectedPermitId !== permit._id) {
      // Update internal selection state
      if (externalSelectedPermitId === undefined) {
        setInternalSelectedPermitId(permit._id);
      }
      
      // Notify parent
      onPermitSelect?.(permit);
      
      // Clear previous amenities if switching
      if (selectedPermitId) {
        clearAmenityMarkers();
      }
      
      // Zoom to permit and fetch new amenities
      zoomToPermit(coordinates);
      fetchAmenitiesAroundDevelopment(coordinates);
    }
  };

  const handleInfoCardClose = () => {
    setVisibleInfoCardId(null);
  };

  // Initialize permit markers
  usePermitMarkers(
    map,
    permits,
    visibleInfoCardId,
    showBoundaries,
    handlePermitClick,
    handleInfoCardClose
  );

  // Fetch permits data
  const getPermits = async () => {
    try {
      const response = await getDevelopmentPermits(DEFAULT_PERMITS_QUERY);
      const permitsData = response.permits || [];
      setInternalPermits(permitsData);
      onPermitsLoad?.(permitsData);
    } catch (error) {
      console.error('Error fetching permits:', error);
    }
  };

  // Initialize map
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAP_STYLE,
      center: VANCOUVER_CENTER,
      zoom: DEFAULT_ZOOM,
    });

    // Initialize layers and fetch data when map loads
    map.current.on('load', () => {
      initializeLayers();
      getPermits();
    });

    // Cleanup function
    const mapInstance = map.current;
    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Handle external permit selection (from sidebar)
  useEffect(() => {
    if (externalSelectedPermitId && permits.length > 0) {
      const selectedPermit = permits.find(p => p._id === externalSelectedPermitId);
      if (selectedPermit) {
        const coordinates = selectedPermit.geom?.geometry?.coordinates;
        if (validateCoordinates(coordinates)) {
          // Show info card for sidebar selection
          setVisibleInfoCardId(externalSelectedPermitId);
          zoomToPermit(coordinates);
          fetchAmenitiesAroundDevelopment(coordinates);
        }
      }
    } else if (externalSelectedPermitId === null) {
      // External deselection - clear everything including info card
      setVisibleInfoCardId(null);
      clearAmenityMarkers();
    }
  }, [externalSelectedPermitId, permits]);

  return (
    <>
      <div ref={mapContainer} style={{ width: '100%', height: '100%' }} />
      <AmenityModal
        isOpen={showAmenityModal}
        onClose={() => setShowAmenityModal(false)}
        amenity={selectedAmenity}
      />
    </>
  );
};

export default Map;