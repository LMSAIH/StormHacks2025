import axios from 'axios';

// API base URL
const API_BASE_URL = 'https://throbbing-rain-c8ee.email4leit.workers.dev/api';

// API request parameters interface
export interface LocationParams {
  lon: number;
  lat: number;
  distance: number;
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

// Example usage:
// const permits = await getDevelopmentPermits({ lon: -123.15525, lat: 49.249783, distance: 0.5 });
// const amenities = await getAmenities({ lon: -123.15525, lat: 49.249783, distance: 1 });
