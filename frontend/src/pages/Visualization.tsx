// src/pages/Visualization.tsx

import React, { useState } from 'react';
import Map from '../components/Map';
import MapSidebar from '../components/MapSidebar';

const Visualization: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [permits, setPermits] = useState<any[]>([]);
    const [storedPermits, setStoredPermits] = useState<any[]>([]); // Store permits when hiding them
    const [selectedPermit, setSelectedPermit] = useState<any>(null);
    const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);
    const [showBoundaries, setShowBoundaries] = useState(false);
    const [hoveredBoundary, setHoveredBoundary] = useState<any>(null);

    const handlePermitSelect = (permit: any) => {
        setSelectedPermit(permit);
        setSelectedPermitId(permit?._id || null);
    };

    const toggleBoundaries = () => {
        if (!showBoundaries) {
            // About to show boundaries - hide permits temporarily
            setStoredPermits(permits); // Store current permits
            setPermits([]); // Clear permits from display
            setSelectedPermit(null); // Clear selection
            setSelectedPermitId(null);
        } else {
            // About to hide boundaries - restore permits
            setPermits(storedPermits); // Restore stored permits
            setStoredPermits([]); // Clear stored permits
        }
        setShowBoundaries(!showBoundaries);
    };

    const handleBoundaryHover = (boundary: any) => {
        setHoveredBoundary(boundary);
    };

    const handleBoundaryLeave = () => {
        setHoveredBoundary(null);
    };

    return (
        // Make this a full-height flex container
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', position: 'relative' }}>
            {/* Sidebar */}
            <MapSidebar 
                isOpen={isSidebarOpen} 
                onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
                permits={permits}
                selectedPermit={selectedPermit}
                onPermitSelect={handlePermitSelect}
                showBoundaries={showBoundaries}
                onToggleBoundaries={toggleBoundaries}
                hoveredBoundary={hoveredBoundary}
            />
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
                    onPermitsLoad={setPermits}
                    onPermitSelect={handlePermitSelect}
                    selectedPermitId={selectedPermitId}
                    showBoundaries={showBoundaries}
                    onBoundaryHover={handleBoundaryHover}
                    onBoundaryLeave={handleBoundaryLeave}
                />
            </div>
        </div>
    );
};

export default Visualization;