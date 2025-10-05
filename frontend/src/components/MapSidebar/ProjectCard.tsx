import React from 'react';
import { P, PSmall } from '../ui/typography';
import type { ProjectCardProps } from './MapSidebar.types';
import { 
  formatCurrency, 
  formatDate, 
  getProjectSize, 
  truncateDescription 
} from './MapSidebar.utils';

const ProjectCard: React.FC<ProjectCardProps> = ({ permit, isSelected, onSelect }) => {



  return (
    <div
      className={`rounded-lg border p-4 transition-all cursor-pointer hover:shadow-md ${
        isSelected
          ? 'border-primary bg-primary/5 shadow-md'
          : 'border-border bg-card hover:border-primary/50'
      }`}
      onClick={onSelect}
    >
      {/* Header */}
      <div className="flex items-start gap-3 mb-3">

        <div className="flex-1 min-w-0">
          <P className="font-semibold text-card-foreground leading-tight">
            {permit.address}
          </P>

        </div>
        <span className={`rounded-full px-2 py-1 text-xs font-medium ${
          getProjectSize(permit.projectvalue) === 'Large'
            ? 'bg-primary/20 text-primary'
            : getProjectSize(permit.projectvalue) === 'Medium'
              ? 'bg-accent/20 text-accent'
              : 'bg-muted text-muted-foreground'
        }`}>
          {getProjectSize(permit.projectvalue)}
        </span>
      </div>

      {/* Project Details */}
      <div className="space-y-2 border-t border-border pt-3">
        <div className="flex justify-between">
          <PSmall className="text-muted-foreground">Project Value:</PSmall>
          <PSmall className="font-semibold text-green-600">
            {formatCurrency(permit.projectvalue)}
          </PSmall>
        </div>
        <div className="flex justify-between">
          <PSmall className="text-muted-foreground">Issue Date:</PSmall>
          <PSmall className="font-medium text-card-foreground">
            {formatDate(permit.issuedate)}
          </PSmall>
        </div>
        {permit.projectdescription && (
          <div>
            <PSmall className="text-muted-foreground mb-1">Description:</PSmall>
            <PSmall className="text-card-foreground leading-relaxed">
              {truncateDescription(permit.projectdescription)}
            </PSmall>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;