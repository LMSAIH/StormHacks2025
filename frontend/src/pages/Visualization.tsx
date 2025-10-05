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
    const [isPinDropMode, setIsPinDropMode] = useState(false);
    const [pinnedLocation, setPinnedLocation] = useState<{lon: number, lat: number} | null>(null);
    const [maxDisplayCount, setMaxDisplayCount] = useState<number | null>(100); // Default to 100

    const handleMaxDisplayCountChange = (count: number | null) => {
        setMaxDisplayCount(count);
        // Clear selected permit and close right panel when filter changes
        setSelectedPermit(null);
        setSelectedPermitId(null);
        setIsRightPanelOpen(false);
    };

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

    const handlePinDropModeToggle = () => {
        console.log('Pin drop mode toggle called, current mode:', isPinDropMode); // Debug log
        setIsPinDropMode(!isPinDropMode);
        if (isPinDropMode) {
            // Exiting pin drop mode, clear any pinned location
            console.log('Exiting pin drop mode, clearing location'); // Debug log
            setPinnedLocation(null);
        }
    };

    const handleMapClick = (coordinates: {lon: number, lat: number}) => {
        console.log('Map click handler called with coordinates:', coordinates, 'isPinDropMode:', isPinDropMode); // Debug log
        if (isPinDropMode) {
            console.log('Setting pinned location:', coordinates); // Debug log
            setPinnedLocation(coordinates);
            setIsPinDropMode(false); // Auto exit pin drop mode after dropping
            
            // Clear any selected permit and close right panel when pin is set
            setSelectedPermit(null);
            setSelectedPermitId(null);
            setIsRightPanelOpen(false);
        }
    };

    const handleClearPin = () => {
        setPinnedLocation(null);
        // If there's a hypothetical permit selected, deselect it
        if (selectedPermit?.hypothetical) {
            setSelectedPermit(null);
            setSelectedPermitId(null);
            setIsRightPanelOpen(false);
        }
    };

    const handleHypotheticalReportGenerated = (reportResponse: any) => {
        console.log('Hypothetical report generated:', reportResponse);
        
        // Extract the impact analysis from the response
        const impactAnalysis = reportResponse.impact_analysis;
        const inputParams = reportResponse.input_parameters;
        
        // Create a hypothetical permit object that looks like a real permit
        const hypotheticalPermit = {
            _id: impactAnalysis.original_permit_id || `hypothetical_${Date.now()}`,
            address: inputParams.address || `${inputParams.coordinates[1].toFixed(4)}, ${inputParams.coordinates[0].toFixed(4)}`,
            projectdescription: inputParams.project_description,
            projectvalue: inputParams.project_value,
            propertyuse: inputParams.property_use || [],
            specificusecategory: inputParams.specific_use_category || [],
            geolocalarea: 'Hypothetical Location',
            geom: {
                geometry: {
                    coordinates: inputParams.coordinates
                }
            },
            issuedate: new Date().toISOString().split('T')[0],
            permitnumbercreateddate: new Date().toISOString().split('T')[0],
            permitelapseddays: 0,
            hypothetical: true,
            // Store the full impact analysis directly on the permit
            impact_report: impactAnalysis
        };
        
        // Set this as the selected permit and show the right panel
        handlePermitSelect(hypotheticalPermit);
        
        // DON'T clear the pin - keep it as the selected location
        // setPinnedLocation(null);
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
                isPinDropMode={isPinDropMode}
                onPinDropModeToggle={handlePinDropModeToggle}
                pinnedLocation={pinnedLocation}
                onClearPin={handleClearPin}
                onHypotheticalReportGenerated={handleHypotheticalReportGenerated}
                maxDisplayCount={maxDisplayCount}
                onMaxDisplayCountChange={handleMaxDisplayCountChange}
            />

            {/* Map Container */}
            <div style={{ flexGrow: 1, position: 'relative' }}>
                <Map
                    onPermitsLoad={setPermits}
                    onPermitSelect={handlePermitSelect}
                    selectedPermitId={selectedPermitId}
                    showBoundaries={showBoundaries}
                    permits={permits}
                    isPinDropMode={isPinDropMode}
                    onMapClick={handleMapClick}
                    pinnedLocation={pinnedLocation}
                    maxDisplayCount={maxDisplayCount}
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