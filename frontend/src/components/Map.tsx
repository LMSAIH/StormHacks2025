import React, { useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import mapboxgl, { Map as MapboxMap } from 'mapbox-gl';
import { getAmenities, getDevelopmentPermits } from '@/api/requests';
import 'mapbox-gl/dist/mapbox-gl.css';
import * as turf from '@turf/turf';
import {
  FaTree,
  FaPalette,
  FaBuilding,
  FaBook,
  FaTheaterMasks,
  FaRestroom,
  FaTrain,
  FaSchool,
  FaFireExtinguisher
} from 'react-icons/fa';

import CustomMarker from './CustomMarker';
import AmenityModal from './AmenityModal';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

type MapProps = {
  onPermitsLoad?: (permits: any[]) => void;
  onPermitSelect?: (permit: any) => void;
  selectedPermitId?: string | null;
};

const Map: React.FC<MapProps> = ({
  onPermitsLoad,
  onPermitSelect,
  selectedPermitId: externalSelectedPermitId
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const [permits, setPermits] = React.useState<any[]>([]);
  const [internalSelectedPermitId, setInternalSelectedPermitId] = React.useState<string | null>(null);
  const selectedPermitId = externalSelectedPermitId !== undefined ? externalSelectedPermitId : internalSelectedPermitId;
  const [visibleInfoCardId, setVisibleInfoCardId] = React.useState<string | null>(null);
  
  // Derive coordinates from selected permit
  const selectedPermit = permits.find(p => p._id === selectedPermitId);
  const currentDevelopmentCoordinates = selectedPermit?.geom?.geometry?.coordinates || null;
  
  const [selectedAmenity, setSelectedAmenity] = React.useState<any>(null);
  const [showAmenityModal, setShowAmenityModal] = React.useState(false);
  const amenityMarkersRef = useRef<mapboxgl.Marker[]>([]);
  const map = useRef<MapboxMap | null>(null);

  const zoomToPermit = (coordinates: [number, number]) => {
    if (map.current) {
      map.current.flyTo({
        center: coordinates,
        zoom: 16,
        duration: 1500,
        essential: true
      });
    }
  };

  const fetchAmenitiesAroundDevelopment = async (coordinates: [number, number]) => {
    try {
      const response = await getAmenities({
        lon: coordinates[0],
        lat: coordinates[1],
        distance: 0.5 // 500m radius
      });
      displayAmenityMarkers(response);
    } catch (error) {
      console.error('Error fetching amenities:', error);
    }
  };

  const clearAmenityMarkers = () => {
    amenityMarkersRef.current.forEach(marker => marker.remove());
    amenityMarkersRef.current = [];
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
          if (!coords) return;

          // Create a container for the React icon
          const amenityEl = document.createElement('div');
          amenityEl.className = 'amenity-marker';

          // Render the React icon into the container
          const root = createRoot(amenityEl);
          const IconComponent = getAmenityIcon(type);

          root.render(
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-lg border-2 border-gray-200 hover:scale-110 transition-transform cursor-pointer hover:shadow-xl"
              title={getAmenityName(amenity, type)}
              style={{ color: getAmenityColor(type) }}
              onClick={() => {
                setSelectedAmenity({ ...amenity, type });
                setShowAmenityModal(true);
              }}
            >
              <IconComponent size={18} />
            </div>
          );

          const marker = new mapboxgl.Marker({ element: amenityEl })
            .setLngLat(coords as [number, number])
            .addTo(map.current!);

          amenityMarkersRef.current.push(marker);
        });
      }
    });
  };

  const getAmenityName = (amenity: any, type: string): string => {
    if (amenity.name) return amenity.name;
    if (amenity.title_of_work) return amenity.title_of_work; // for public art
    if (amenity.school_name) return amenity.school_name; // for schools
    if (amenity.park_name) return amenity.park_name; // for washrooms
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getAmenityIcon = (type: string) => {
    const icons: { [key: string]: any } = {
      parks: FaTree,
      public_art: FaPalette,
      community_centers: FaBuilding,
      libraries: FaBook,
      cultural_spaces: FaTheaterMasks,
      public_washrooms: FaRestroom,
      rapid_transit_stations: FaTrain,
      schools: FaSchool,
      fire_halls: FaFireExtinguisher
    };
    return icons[type] || FaBuilding;
  };

  const getAmenityColor = (type: string): string => {
    const colors: { [key: string]: string } = {
      parks: '#22c55e',
      public_art: '#8b5cf6',
      community_centers: '#f59e0b',
      libraries: '#3b82f6',
      cultural_spaces: '#ec4899',
      public_washrooms: '#6b7280',
      rapid_transit_stations: '#ef4444',
      schools: '#10b981',
      fire_halls: '#dc2626'
    };
    return colors[type] || '#6b7280';
  };

  const getPermits = async () => {
    const response = await getDevelopmentPermits({ lon: -123.15525, lat: 49.249783, distance: 18 });
    const permitsData = response.permits || [];
    setPermits(permitsData);
    onPermitsLoad?.(permitsData);
  };

  useEffect(() => {
    if (map.current || !mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // Using the default streets style guarantees the marker icon exists
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [-123.1393, 49.2458],
      zoom: 12.3,
    });

    // The 'load' event waits for the map style to be fully loaded
    map.current.on('load', () => {
      getPermits();
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
    });

    const mapInstance = map.current;
    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []);

  // Effect to render permit markers when permits data is loaded
  useEffect(() => {
    if (!map.current || permits.length === 0) return;

    // Clear existing markers
    const existingMarkers = document.querySelectorAll('.custom-marker-container');
    existingMarkers.forEach(marker => marker.remove());

    // Loop through each permit in our permits data
    permits.forEach((permit) => {
      // Extract coordinates from permit geom
      const coordinates = permit.geom?.geometry?.coordinates;
      if (!coordinates) return;

      // Create a container element for the React component
      const markerDiv = document.createElement('div');
      markerDiv.className = 'custom-marker-container';

      // Render the React component into the div
      const root = createRoot(markerDiv);
      root.render(
        <CustomMarker
          permit={permit}
          isSelected={visibleInfoCardId === permit._id}
          onSelect={(permitId) => {
            const isCurrentlyVisible = visibleInfoCardId === permitId;
            
            if (isCurrentlyVisible) {
              // Clicking to close info card - just hide the card, keep selection
              setVisibleInfoCardId(null);
            } else {
              // Clicking to show info card and select permit
              setVisibleInfoCardId(permitId);
              
              // Update selection if this is a new permit
              if (selectedPermitId !== permitId) {
                const selectedPermit = permits.find(p => p._id === permitId);
                if (selectedPermit) {
                  // Update selection state
                  if (externalSelectedPermitId === undefined) {
                    setInternalSelectedPermitId(permitId);
                  }
                  
                  // Notify parent
                  onPermitSelect?.(selectedPermit);
                  
                  // Clear previous amenities if switching
                  if (selectedPermitId) {
                    clearAmenityMarkers();
                  }
                  
                  // Zoom to permit and fetch new amenities
                  zoomToPermit(coordinates as [number, number]);
                  fetchAmenitiesAroundDevelopment(coordinates as [number, number]);
                }
              }
            }
          }}
        />
      );

      // Create a new marker with the custom element
      new mapboxgl.Marker({
        element: markerDiv,
        anchor: 'center',
      })
        // Set the marker's position from the permit's coordinates
        .setLngLat(coordinates as [number, number])
        // Add the marker to the map
        .addTo(map.current!);
    });
  }, [permits, selectedPermitId, visibleInfoCardId]);

  // Effect to handle external permit selection (from sidebar)
  useEffect(() => {
    if (externalSelectedPermitId && permits.length > 0) {
      const selectedPermit = permits.find(p => p._id === externalSelectedPermitId);
      if (selectedPermit) {
        const coordinates = selectedPermit.geom?.geometry?.coordinates;
        if (coordinates) {
          // Show info card for sidebar selection
          setVisibleInfoCardId(externalSelectedPermitId);
          zoomToPermit(coordinates as [number, number]);
          fetchAmenitiesAroundDevelopment(coordinates as [number, number]);
        }
      }
    } else if (externalSelectedPermitId === null) {
      // External deselection - clear everything including info card
      setVisibleInfoCardId(null);
      clearAmenityMarkers();
    }
  }, [externalSelectedPermitId, permits]);

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