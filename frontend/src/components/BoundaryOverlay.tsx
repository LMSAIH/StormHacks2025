import mapboxgl from 'mapbox-gl';
// @ts-ignore
import boundaries from '../data/boundaries2.geojson';

interface BoundaryOverlayProps {
    map: mapboxgl.Map | null;
    isVisible: boolean;
}

class BoundaryManager {
    private map: mapboxgl.Map;
    private isInitialized: boolean = false;

    constructor(map: mapboxgl.Map) {
        this.map = map;
    }

    initialize() {
        if (this.isInitialized) return;

        this.map.addSource('boundaries', {
            type: 'geojson',
            data: boundaries
        });

        this.map.addLayer({
            id: 'boundaries-fill',
            type: 'fill',
            source: 'boundaries',
            paint: {
                'fill-color': '#3b82f6',
                'fill-opacity': 0.1
            }
        });

        this.map.addLayer({
            id: 'boundaries-line',
            type: 'line',
            source: 'boundaries',
            paint: {
                'line-color': '#3b82f6',
                'line-width': 1,
                'line-opacity': 0.6
            }
        });

        this.map.on('mouseenter', 'boundaries-fill', () => {
            this.map.getCanvas().style.cursor = 'pointer';
        });

        this.map.on('mouseleave', 'boundaries-fill', () => {
            this.map.getCanvas().style.cursor = '';
        });

        this.isInitialized = true;
    }

    setVisibility(visible: boolean) {
        if (!this.isInitialized) {
            this.initialize();
        }
        
        this.map.setLayoutProperty('boundaries-fill', 'visibility', visible ? 'visible' : 'none');
        this.map.setLayoutProperty('boundaries-line', 'visibility', visible ? 'visible' : 'none');
    }

    cleanup() {
        if (!this.isInitialized) return;

        if (this.map.getLayer('boundaries-line')) this.map.removeLayer('boundaries-line');
        if (this.map.getLayer('boundaries-fill')) this.map.removeLayer('boundaries-fill');
        if (this.map.getSource('boundaries')) this.map.removeSource('boundaries');
        
        this.isInitialized = false;
    }
}

const BoundaryOverlay: React.FC<BoundaryOverlayProps> = ({ map, isVisible }) => {
    if (!map) return null;

    const boundaryManager = new BoundaryManager(map);
    boundaryManager.setVisibility(isVisible);

    return null;
};

export default BoundaryOverlay;