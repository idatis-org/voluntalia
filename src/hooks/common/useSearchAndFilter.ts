import { useState, useMemo } from 'react';

interface UseSearchAndFilterOptions<T> {
  data: T[];
  searchFields: (keyof T)[];
  defaultFilter?: string;
  itemsPerPage?: number;
}

interface FilterConfig {
  key: string;
  value: string;
  matcher: (item: any, value: string) => boolean;
}

export const useSearchAndFilter = <T>({
  data,
  searchFields,
  defaultFilter = 'all',
  itemsPerPage = 10
}: UseSearchAndFilterOptions<T>) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    main: defaultFilter
  });
  const [currentPage, setCurrentPage] = useState(1);

  const setMainFilter = (value: string) => {
    setFilters(prev => ({ ...prev, main: value }));
    setCurrentPage(1);
  };

  const setCustomFilter = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    return data.filter(item => {
      // Search logic
      const matchesSearch = !searchTerm || searchFields.some(field => {
        const value = item[field];
        if (typeof value === 'string') {
          return value.toLowerCase().includes(searchTerm.toLowerCase());
        }
        if (Array.isArray(value)) {
          return value.some(v => 
            typeof v === 'string' && v.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        return false;
      });

      return matchesSearch;
    });
  }, [data, searchTerm, searchFields, filters]);

  // Pagination
  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const resetSearch = () => {
    setSearchTerm('');
    setFilters({ main: defaultFilter });
    setCurrentPage(1);
  };

  return {
    // State
    searchTerm,
    filters,
    currentPage,
    
    // Data
    filteredData,
    paginatedData,
    totalItems,
    totalPages,
    
    // Actions
    setSearchTerm,
    setMainFilter,
    setCustomFilter,
    setCurrentPage,
    resetSearch
  };
};