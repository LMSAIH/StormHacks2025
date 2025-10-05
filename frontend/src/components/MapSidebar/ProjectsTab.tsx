import React, { useState } from 'react';
import { PSmall } from '../ui/typography';
import { Button } from '../ui/button';
import type { ProjectsTabProps } from './MapSidebar.types';
import { sortPermitsByValue, paginateArray } from './MapSidebar.utils';
import { ITEMS_PER_PAGE } from './MapSidebar.constants';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';
import { FiFilter } from 'react-icons/fi';

const ProjectsTab: React.FC<ProjectsTabProps> = ({ 
  permits, 
  selectedPermit, 
  onPermitSelect,
  maxDisplayCount,
  onMaxDisplayCountChange
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  const filterOptions = [10, 25, 50, 100, 250, 500, 1000, null]; // null means "All"

  // Sort permits by project value (highest first)
  const sortedPermits = sortPermitsByValue(permits);

  // Apply filter
  const filteredPermits = maxDisplayCount !== null && maxDisplayCount !== undefined && maxDisplayCount > 0
    ? sortedPermits.slice(0, maxDisplayCount)
    : sortedPermits;

  // Pagination logic
  const totalPages = Math.ceil(filteredPermits.length / ITEMS_PER_PAGE);
  const currentPermits = paginateArray(filteredPermits, currentPage, ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePermitSelect = (permit: any) => {
    // Allow deselection by clicking the same permit
    if (selectedPermit?._id === permit._id) {
      onPermitSelect?.(null);
    } else {
      onPermitSelect?.(permit);
    }
  };

  return (
    <div className="space-y-4">
      {/* Filter Section */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setShowFilterOptions(!showFilterOptions)}
        >
          <span className="flex items-center gap-2">
            <FiFilter className="h-4 w-4" />
            Filter Projects
          </span>
          <span className="text-xs text-muted-foreground">
            {maxDisplayCount === null ? 'All' : maxDisplayCount}
          </span>
        </Button>
        {showFilterOptions && (
          <div className="rounded-lg bg-muted/30 p-3 border border-border space-y-1.5">
            <PSmall className="text-muted-foreground mb-2">Show projects:</PSmall>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.map((count) => (
                <Button
                  key={count === null ? 'all' : count}
                  variant={maxDisplayCount === count ? 'default' : 'outline'}
                  size="sm"
                  className="text-xs h-8"
                  onClick={() => {
                    onMaxDisplayCountChange?.(count);
                    setShowFilterOptions(false);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                >
                  {count === null ? 'All' : count}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Total Count */}
      <div className="flex justify-between items-center">
        <PSmall className="text-muted-foreground">
          Showing {filteredPermits.length} of {permits.length} projects (sorted by cost)
        </PSmall>
      </div>

      {/* Project Cards */}
      {currentPermits.length > 0 ? (
        <div className="space-y-3 scrollbar-hide">
          {currentPermits.map((permit, index) => (
            <ProjectCard
              key={`${permit._id}-${index}`}
              permit={permit}
              isSelected={selectedPermit?._id === permit._id}
              onSelect={() => handlePermitSelect(permit)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <PSmall className="text-muted-foreground">No projects available</PSmall>
        </div>
      )}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default ProjectsTab;