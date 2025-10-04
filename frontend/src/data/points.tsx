// This file holds and exports our map data.
export const pointsData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-123.1221, 49.2616],
      },
      properties: { category: 'hospital', name: 'BC Cancer' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        // Corrected latitude from 9.25 to 49.24
        coordinates: [-123.1211, 49.2424],
      },
      properties: { category: 'park', name: 'Queen Elizabeth Park' },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-123.1302, 49.2593],
      },
      properties: { category: 'bus-stop', name: 'Random point' },
    },
  ],
};