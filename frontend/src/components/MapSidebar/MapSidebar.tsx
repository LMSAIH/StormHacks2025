import React, { useState } from 'react';
import type { SidebarProps, TabType } from './MapSidebar.types';
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
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed left-4 top-4 z-50 flex h-10 w-10 items-center justify-center rounded-lg bg-card shadow-lg transition-all hover:scale-105 hover:shadow-xl border border-border"
      >
        <span className="text-xl">{isOpen ? '←' : '→'}</span>
      </button>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 z-40 h-full w-96 transform bg-card shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } border-r border-border`}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <SidebarHeader />

          {/* Tabs */}
          <SidebarTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
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