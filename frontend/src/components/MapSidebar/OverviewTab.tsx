import React from 'react';
import { H4, PSmall } from '../ui/typography';
import { Button } from '../ui/button';
import type { OverviewTabProps } from './MapSidebar.types';
import { VANCOUVER_STATS } from './MapSidebar.constants';

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  permits, 
  showBoundaries, 
  onToggleBoundaries 
}) => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="">
        <PSmall className="text-muted-foreground">Total Projects</PSmall>
        <H4 className="mt-1 text-primary">{permits.length}</H4>
      </div>

      {/* Area Info */}
      <div>
        <H4 className="mb-3 text-foreground">Area Information</H4>
        <div className="space-y-3 rounded-lg bg-muted/30 p-4 border border-border">
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Population</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.POPULATION}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Area</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.AREA}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Density</PSmall>
            <PSmall className="font-medium text-foreground">{VANCOUVER_STATS.DENSITY}</PSmall>
          </div>
          <div className="flex justify-between">
            <PSmall className="text-muted-foreground">Growth Rate</PSmall>
            <PSmall className="font-medium text-primary">{VANCOUVER_STATS.GROWTH_RATE}</PSmall>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <H4 className="mb-3 text-foreground">Quick Actions</H4>
        <div className="space-y-2">
          <Button
            variant="outline"
            className={`w-full justify-start ${showBoundaries ? 'bg-primary/10 border-primary' : ''}`}
            onClick={onToggleBoundaries}
          >
            {showBoundaries ? 'Hide' : 'Show'} Boundaries
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;