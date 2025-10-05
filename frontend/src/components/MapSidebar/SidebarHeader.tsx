import React from 'react';
import { H3 } from '../ui/typography';

const SidebarHeader: React.FC = () => {
  return (
    <div className="border-b border-border bg-muted/30 px-6 py-4">
      <H3 className="text-foreground">Vancouver, BC</H3>
    </div>
  );
};

export default SidebarHeader;