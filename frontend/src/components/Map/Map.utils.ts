// Utility functions for Map components

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
import { AMENITY_COLORS } from './Map.constants';
import type { Amenity } from './Map.types';

export const getAmenityName = (amenity: Amenity, type: string): string => {
  if (amenity.name) return amenity.name;
  if (amenity.title_of_work) return amenity.title_of_work; // for public art
  if (amenity.school_name) return amenity.school_name; // for schools
  if (amenity.park_name) return amenity.park_name; // for washrooms
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};

export const getAmenityIcon = (type: string) => {
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

export const getAmenityColor = (type: string): string => {
  return AMENITY_COLORS[type as keyof typeof AMENITY_COLORS] || '#6b7280';
};

export const createEmptyGeoJSONFeatureCollection = () => ({
  type: 'FeatureCollection' as const,
  features: []
});

export const validateCoordinates = (coordinates: any): coordinates is [number, number] => {
  return Array.isArray(coordinates) && 
         coordinates.length === 2 && 
         typeof coordinates[0] === 'number' && 
         typeof coordinates[1] === 'number';
};