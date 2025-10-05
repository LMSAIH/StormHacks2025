// Main Map component using modular hooks and utilities

import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import { getDevelopmentPermits } from '@/api/requests';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { createRoot } from 'react-dom/client';

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
  isPinDropMode = false,
  onMapClick,
  pinnedLocation,
  maxDisplayCount = null
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const pinMarkerRef = useRef<mapboxgl.Marker | null>(null);

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
  const allPermits = externalPermits.length > 0 ? externalPermits : internalPermits;
  
  // Sort permits by project value (cost) in descending order, then apply filtering
  const sortedPermits = [...allPermits].sort((a, b) => {
    const valueA = a.projectvalue || 0;
    const valueB = b.projectvalue || 0;
    return valueB - valueA; // Descending order (highest cost first)
  });
  
  const permits = maxDisplayCount !== null && maxDisplayCount > 0
    ? sortedPermits.slice(0, maxDisplayCount)
    : sortedPermits;
  
  const selectedPermitId = externalSelectedPermitId !== undefined ? externalSelectedPermitId : internalSelectedPermitId;

  // Derive coordinates from selected permit OR pinned location
  const selectedPermit = permits.find(p => p._id === selectedPermitId);
  const currentDevelopmentCoordinates = selectedPermit?.geom?.geometry?.coordinates || 
    (pinnedLocation ? [pinnedLocation.lon, pinnedLocation.lat] : null);

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
      
      // Deduplicate permits by _id to avoid React key conflicts
      const uniquePermits = permitsData.filter((permit: any, index: number, self: any[]) => 
        index === self.findIndex((p: any) => p._id === permit._id)
      );
      
      setInternalPermits(uniquePermits);
      onPermitsLoad?.(uniquePermits);
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

  // Handle click events for pin dropping - separate effect with dependencies
  useEffect(() => {
    if (!map.current) return;

    const handleMapClick = (e: mapboxgl.MapMouseEvent) => {
      if (isPinDropMode && onMapClick) {
        console.log('Pin drop click detected:', isPinDropMode, onMapClick); // Debug log
        const coordinates = {
          lon: e.lngLat.lng,
          lat: e.lngLat.lat
        };
        onMapClick(coordinates);
      }
    };

    // Add the click handler
    map.current.on('click', handleMapClick);

    // Cleanup - remove the click handler
    return () => {
      if (map.current) {
        map.current.off('click', handleMapClick);
      }
    };
  }, [isPinDropMode, onMapClick]);

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

  // Handle hypothetical permit with pinned location - fetch amenities
  useEffect(() => {
    console.log('Hypothetical permit effect triggered:', {
      pinnedLocation,
      isHypothetical: selectedPermit?.hypothetical,
      selectedPermitId: selectedPermit?._id
    });
    
    if (pinnedLocation && selectedPermit?.hypothetical) {
      // This is a hypothetical permit, fetch amenities around the pinned location
      const coordinates: [number, number] = [pinnedLocation.lon, pinnedLocation.lat];
      console.log('Fetching amenities for hypothetical permit at:', coordinates);
      zoomToPermit(coordinates);
      fetchAmenitiesAroundDevelopment(coordinates);
    }
  }, [pinnedLocation, selectedPermit?.hypothetical, selectedPermit?._id]);

  // Handle pin drop mode cursor change
  useEffect(() => {
    if (map.current) {
      const canvas = map.current.getCanvas();
      if (isPinDropMode) {
        canvas.style.cursor = 'crosshair';
      } else {
        canvas.style.cursor = '';
      }
    }
  }, [isPinDropMode]);

  // Handle pinned location marker
  useEffect(() => {
    if (map.current) {
      // Remove existing marker if any
      if (pinMarkerRef.current) {
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }
      
      if (pinnedLocation) {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'hypothetical-pin-marker';
        el.style.width = '48px';
        el.style.height = '48px';
        el.style.cursor = 'pointer';
        
        // Create the marker HTML similar to CustomMarker but with a pin icon
        const markerRoot = createRoot(el);
        markerRoot.render(
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full bg-blue-500 shadow-lg transition-all duration-300 hover:scale-125 hover:shadow-xl">
              <FaMapMarkerAlt className="text-lg text-white" />
            </div>
          </div>
        );
        
        // Create and add the marker
        pinMarkerRef.current = new mapboxgl.Marker({
          element: el,
          anchor: 'bottom'
        })
          .setLngLat([pinnedLocation.lon, pinnedLocation.lat])
          .addTo(map.current);
      }
    }
    
    // Cleanup function
    return () => {
      if (pinMarkerRef.current) {
        pinMarkerRef.current.remove();
        pinMarkerRef.current = null;
      }
    };
  }, [pinnedLocation]);

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