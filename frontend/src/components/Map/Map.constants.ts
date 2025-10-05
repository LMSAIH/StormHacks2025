// Constants for Map components

export const VANCOUVER_CENTER: [number, number] = [-123.1393, 49.2458];
export const DEFAULT_ZOOM = 12.3;
export const PERMIT_ZOOM = 16;
export const AMENITIES_RADIUS = 0.5; // 500m radius in kilometers
export const DEVELOPMENT_ZONE_RADIUS = 0.5; // 500m radius in kilometers

export const MAP_STYLE = 'mapbox://styles/mapbox/dark-v11';

export const LAYER_IDS = {
  DEVELOPMENT_ZONE_FILL: 'development-zone-fill',
  DEVELOPMENT_ZONE_OUTLINE: 'development-zone-outline',
  BOUNDARIES_OUTLINE: 'boundaries-outline',
} as const;

export const SOURCE_IDS = {
  DEVELOPMENT_ZONE: 'development-zone',
  BOUNDARIES: 'boundaries',
} as const;

export const AMENITY_COLORS = {
  parks: '#22c55e',
  public_art: '#8b5cf6',
  community_centers: '#f59e0b',
  libraries: '#3b82f6',
  cultural_spaces: '#ec4899',
  public_washrooms: '#6b7280',
  rapid_transit_stations: '#ef4444',
  schools: '#10b981',
  fire_halls: '#dc2626'
} as const;

export const DEFAULT_PERMITS_QUERY = {
  lon: -123.15525,
  lat: 49.249783,
  distance: 18
} as const;