import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationInfo } from '../types/pokemon';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const getPageNumbers = (isMobile: boolean = false) => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (isMobile) {
        if (currentPage <= 2) {
          pages.push(1, 2, 3, '...', totalPages);
        } else if (currentPage >= totalPages - 1) {
          pages.push(1, '...', totalPages - 2, totalPages - 1, totalPages);
        } else {
          pages.push(1, '...', currentPage, '...', totalPages);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        } else if (currentPage >= totalPages - 2) {
          pages.push(1);
          pages.push('...');
          for (let i = totalPages - 3; i <= totalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push('...');
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push('...');
          pages.push(totalPages);
        }
      }
    }

    return pages;
  };

  const desktopPageNumbers = getPageNumbers(false);
  const mobilePageNumbers = getPageNumbers(true);

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-3 py-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-sm sm:text-base ${hasPreviousPage
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
      >
        <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
        <span className="hidden sm:inline">Anterior</span>
      </button>

      <div className="hidden sm:flex items-center space-x-2">
        {desktopPageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-4 py-3 rounded-xl transition-all font-medium ${page === currentPage
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <div className="flex sm:hidden items-center space-x-1">
        {mobilePageNumbers.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-2 py-2 rounded-lg transition-all font-medium text-sm min-w-[32px] ${page === currentPage
              ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
              : page === '...'
                ? 'text-gray-400 cursor-default'
                : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`flex items-center px-2 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl transition-all font-medium text-sm sm:text-base ${hasNextPage
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
      >
        <span className="hidden sm:inline">Próximo</span>
        <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
      </button>
    </div>
  );
} 