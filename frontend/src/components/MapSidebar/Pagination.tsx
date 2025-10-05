import React from 'react';
import { Button } from '../ui/button';
import { PSmall } from '../ui/typography';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import type { PaginationProps } from './MapSidebar.types';

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t border-border pt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-2"
      >
        <FaChevronLeft className="text-xs" />
        Previous
      </Button>

      <div className="flex items-center gap-2">
        <PSmall className="text-muted-foreground">
          Page {currentPage} of {totalPages}
        </PSmall>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-2"
      >
        Next
        <FaChevronRight className="text-xs" />
      </Button>
    </div>
  );
};

export default Pagination;