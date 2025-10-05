import React from 'react';
import type { TabsProps } from './MapSidebar.types';

const SidebarTabs: React.FC<TabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="flex border-b border-border bg-background/50">
      <button
        onClick={() => onTabChange('overview')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${
          activeTab === 'overview'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Overview
      </button>
      <button
        onClick={() => onTabChange('projects')}
        className={`flex-1 px-4 py-3 text-sm font-medium transition-colors font-['Roboto_Mono',monospace] ${
          activeTab === 'projects'
            ? 'border-b-2 border-primary text-foreground'
            : 'text-muted-foreground hover:text-foreground'
        }`}
      >
        Projects
      </button>
    </div>
  );
};

export default SidebarTabs;