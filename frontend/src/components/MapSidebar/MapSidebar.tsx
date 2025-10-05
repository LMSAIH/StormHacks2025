import React, { useState } from 'react';
import type { SidebarProps, TabType } from './MapSidebar.types';
import { PiCaretRightBold } from "react-icons/pi";
import SidebarHeader from './SidebarHeader';
import SidebarTabs from './SidebarTabs';
import OverviewTab from './OverviewTab';
import ProjectsTab from './ProjectsTab';

const MapSidebar: React.FC<SidebarProps> = ({
    isOpen,
    onToggle,
    permits = [],
    selectedPermit,
    onPermitSelect,
    showBoundaries = false,
    onToggleBoundaries
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
    };

    return (
        <>
            {/* Sidebar */}
            <div
                className={`fixed left-0 top-0 z-40 h-full w-96 transform bg-card shadow-2xl transition-transform duration-300 ease-in-out scrollbar-hide ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    } border-r border-border`}
            >

                <PiCaretRightBold onClick={onToggle}
                    className={`absolute top-1/2 -translate-y-1/2 z-50 h-12 w-6 bg-card border border-border border-l-0 transition-all duration-300 ease-in-out hover:bg-muted group ${isOpen ? 'right-0 translate-x-full rounded-r-md' : 'right-0 translate-x-full rounded-r-md'
                        }`} />

                <div className="flex h-full flex-col">
                    {/* Header */}
                    <SidebarHeader />

                    {/* Tabs */}
                    <SidebarTabs activeTab={activeTab} onTabChange={handleTabChange} />

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
                        {activeTab === 'overview' && (
                            <OverviewTab
                                permits={permits}
                                showBoundaries={showBoundaries}
                                onToggleBoundaries={onToggleBoundaries}
                            />
                        )}

                        {activeTab === 'projects' && (
                            <ProjectsTab
                                permits={permits}
                                selectedPermit={selectedPermit}
                                onPermitSelect={onPermitSelect}
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default MapSidebar;