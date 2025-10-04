// src/pages/Visualization.tsx

import React from 'react';
import Map from '../components/Map';

const Visualization: React.FC = () => {
    return (
        // Make this a full-height flex container
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <h1>Map Visualization</h1>

            {/* This div will grow to fill the remaining space */}
            <div style={{ flexGrow: 1 }}>
                <Map />
            </div>
        </div>
    );
};

export default Visualization;