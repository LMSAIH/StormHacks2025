// Utility functions for MapSidebar components

import {
  FaHome,
  FaBuilding,
  FaUniversity,
  FaIndustry,
  FaCity,
  FaHammer,
} from 'react-icons/fa'

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-CA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getPropertyUseIcon = (use: string) => {
  switch (use.toLowerCase()) {
    case 'residential uses':
      return FaHome;
    case 'commercial uses':
      return FaBuilding;
    case 'institutional uses':
      return FaUniversity;
    case 'industrial uses':
      return FaIndustry;
    case 'mixed uses':
      return FaCity;
    default:
      return FaHammer;
  }
};

export const getPropertyUseColor = (use: string): string => {
  switch (use.toLowerCase()) {
    case 'residential uses':
      return 'bg-blue-500';
    case 'commercial uses':
      return 'bg-green-500';
    case 'institutional uses':
      return 'bg-purple-500';
    case 'industrial uses':
      return 'bg-orange-500';
    case 'mixed uses':
      return 'bg-yellow-500';
    default:
      return 'bg-gray-500';
  }
};

export const getProjectSize = (projectValue: number): string => {
  if (projectValue < 2000000) return 'Small';
  if (projectValue < 10000000) return 'Medium';
  return 'Large';
};

export const truncateDescription = (text: string, maxLength: number = 80): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sortPermitsByValue = (permits: any[]): any[] => {
  return permits
    .filter(permit => permit.projectvalue) // Only show permits with project values
    .sort((a, b) => (b.projectvalue || 0) - (a.projectvalue || 0));
};

export const paginateArray = <T>(array: T[], page: number, itemsPerPage: number): T[] => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return array.slice(startIndex, endIndex);
};