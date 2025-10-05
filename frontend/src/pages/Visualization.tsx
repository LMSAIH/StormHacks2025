// src/pages/Visualization.tsx

import React, { useState } from 'react';
import Map from '../components/Map';
import MapSidebar from '../components/MapSidebar';

const Visualization: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [currentDevelopment, setCurrentDevelopment] = useState(null);
    const [currentDevelopmentCoordinates, setCurrentDevelopmentCoordinates] = useState<[number, number] | null>(null);

    return (
        // Make this a full-height flex container
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            {/* Sidebar */}
            <MapSidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
            <a href="/">
                <button
                    className="fixed right-4 top-4 z-50 flex p-2 items-center justify-center rounded-lg bg-card shadow-lg transition-all hover:scale-105 hover:shadow-xl border border-border"
                >
                    <span className="text-xl">Home</span>
                </button>
            </a>

            {/* Map Container */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <Map
                    setCurrentDevelopment={setCurrentDevelopment}
                    setCurrentDevelopmentCoordinates={setCurrentDevelopmentCoordinates}
                    currentDevelopmentCoordinates={currentDevelopmentCoordinates}
                />
            </div>
        </div>
    );
};

export default Visualization;