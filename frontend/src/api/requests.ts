import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://throbbing-rain-c8ee.email4leit.workers.dev/api';

// API request parameters interface
export interface LocationParams {
  lon: number;
  lat: number;
  distance: number;
}

// Hypothetical development request interface
export interface HypotheticalDevelopmentRequest {
  longitude: number;
  latitude: number;
  project_description: string;
  project_value?: number;
  address?: string;
  property_use?: string[];
  specific_use_category?: string[];
  max_distance_km?: number;
}

/**
 * Fetch development permits based on location and distance
 * @param params - Object containing longitude, latitude, and distance
 * @returns Promise resolving to development permits data
 */
export const getDevelopmentPermits = async (params: LocationParams): Promise<any> => {
  const { lon, lat, distance } = params;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/development-permits`, {
      params: {
        lon,
        lat,
        distance
      }
    });

    console.log(response)
    return response.data;
  } catch (error) {
    console.error('Error fetching development permits:', error);
    throw error;
  }
};

/**
 * Fetch amenities based on location and distance
 * @param params - Object containing longitude, latitude, and distance
 * @returns Promise resolving to amenities data
 */
export const getAmenities = async (params: LocationParams): Promise<any> => {
  const { lon, lat, distance } = params;
  
  try {
    const response = await axios.get(`${API_BASE_URL}/amenities`, {
      params: {
        lon,
        lat,
        distance
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching amenities:', error);
    throw error;
  }
};

/**
 * Fetch impact report for a specific permit
 * @param permitId - The permit ID to fetch the impact report for
 * @returns Promise resolving to impact report data
 */
export const getImpactReport = async (permitId: string): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/impact_reports/${permitId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching impact report:', error);
    throw error;
  }
};

/**
 * Generate a hypothetical impact report for a proposed development
 * @param request - Object containing development details and coordinates
 * @returns Promise resolving to hypothetical impact analysis data
 */
export const generateHypotheticalImpactReport = async (request: HypotheticalDevelopmentRequest): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/hypothetical-impact-report`, request, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error generating hypothetical impact report:', error);
    throw error;
  }
};

// Example usage:
// const permits = await getDevelopmentPermits({ lon: -123.15525, lat: 49.249783, distance: 0.5 });
// const amenities = await getAmenities({ lon: -123.15525, lat: 49.249783, distance: 1 });
// const impactReport = await getImpactReport('68e1f303607bd68421537e47');
// const hypotheticalReport = await generateHypotheticalImpactReport({
//   longitude: -123.1207,
//   latitude: 49.2827,
//   project_description: "To construct a 6-storey building with 45 dwelling units",
//   project_value: 15000000,
//   address: "123 Main Street, Vancouver, BC",
//   property_use: ["Residential Uses"],
//   specific_use_category: ["Multiple Dwelling"],
//   max_distance_km: 1.0
// });
