// src/pages/Visualization.tsx

import React, { useState } from 'react';
import Map from '../components/Map';
import MapSidebar from '../components/MapSidebar';
import RightPanel from '../components/RightPanel';

const Visualization: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentDevelopment, setCurrentDevelopment] = useState(null);
    const [currentDevelopmentCoordinates, setCurrentDevelopmentCoordinates] = useState<[number, number] | null>(null);

    return (
        // Make this a full-height flex container
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            {/* Sidebar */}
            <MapSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Map Container */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <Map
                    setCurrentDevelopment={setCurrentDevelopment}
                    setCurrentDevelopmentCoordinates={setCurrentDevelopmentCoordinates}
                    currentDevelopmentCoordinates={currentDevelopmentCoordinates}
                />
            </div>
        <RightPanel details={currentDevelopment} />
        </div>
    );
};

export default Visualization;