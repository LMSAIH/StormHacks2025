// src/pages/Visualization.tsx

import React, { useState } from 'react';
import Map from '../components/Map';
import MapSidebar from '../components/MapSidebar';
import RightPanel from '../components/RightPanel';

const Visualization: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
    const [permits, setPermits] = useState<any[]>([]);
    const [selectedPermit, setSelectedPermit] = useState<any>(null);
    const [selectedPermitId, setSelectedPermitId] = useState<string | null>(null);
    const [showBoundaries, setShowBoundaries] = useState(false);

    const handlePermitSelect = (permit: any) => {
        setSelectedPermit(permit);
        setSelectedPermitId(permit?._id || null);
        
        // Show right panel when permit is selected
        if (permit) {
            setIsRightPanelOpen(true);
        }
    };

    const toggleBoundaries = () => {
        setShowBoundaries(!showBoundaries);
    };

    const handleRightPanelToggle = () => {
        setIsRightPanelOpen(!isRightPanelOpen);
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
            />

            {/* Map Container */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <Map
                    onPermitsLoad={setPermits}
                    onPermitSelect={handlePermitSelect}
                    selectedPermitId={selectedPermitId}
                    showBoundaries={showBoundaries}
                    permits={permits}
                />
            </div>

            {/* Right Panel for Impact Analysis */}
            <RightPanel
                selectedPermit={selectedPermit}
                isVisible={isRightPanelOpen}
                onToggle={handleRightPanelToggle}
            />
        </div>
    );
};

export default Visualization;