import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationInfo } from '../types/pokemon';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { currentPage, totalPages, hasNextPage, hasPreviousPage } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
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

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-3 mt-12">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${hasPreviousPage
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
      >
        <ChevronLeft className="h-4 w-4 mr-2" />
        Anterior
      </button>

      <div className="flex items-center space-x-2">
        {pageNumbers.map((page, index) => (
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

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${hasNextPage
          ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
          : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/10'
          }`}
      >
        Próximo
        <ChevronRight className="h-4 w-4 ml-2" />
      </button>
    </div>
  );
} 