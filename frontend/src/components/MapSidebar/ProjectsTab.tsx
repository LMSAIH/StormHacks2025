import React, { useState } from 'react';
import { PSmall } from '../ui/typography';
import type { ProjectsTabProps } from './MapSidebar.types';
import { sortPermitsByValue, paginateArray } from './MapSidebar.utils';
import { ITEMS_PER_PAGE } from './MapSidebar.constants';
import ProjectCard from './ProjectCard';
import Pagination from './Pagination';

const ProjectsTab: React.FC<ProjectsTabProps> = ({ permits, selectedPermit, onPermitSelect }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Sort permits by project value (highest first)
  const sortedPermits = sortPermitsByValue(permits);

  // Pagination logic
  const totalPages = Math.ceil(sortedPermits.length / ITEMS_PER_PAGE);
  const currentPermits = paginateArray(sortedPermits, currentPage, ITEMS_PER_PAGE);

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
      {/* Project Cards */}
      {currentPermits.length > 0 ? (
        <div className="space-y-3">
          {currentPermits.map((permit) => (
            <ProjectCard
              key={permit._id}
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