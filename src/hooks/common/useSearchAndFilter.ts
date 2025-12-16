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
    const searchLower = searchTerm.toLowerCase().trim();

    // Simple normalization
    const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '');

    // Levenshtein distance
    const levenshtein = (a: string, b: string) => {
      const m = a.length, n = b.length;
      const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
      for (let i = 0; i <= m; i++) dp[i][0] = i;
      for (let j = 0; j <= n; j++) dp[0][j] = j;
      for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
          const cost = a[i - 1] === b[j - 1] ? 0 : 1;
          dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
        }
      }
      return dp[m][n];
    };

    // Fuzzy match: exact includes OR subsequence OR small edit distance relative to length
    const fuzzyMatch = (text: string, pattern: string): boolean => {
      if (!pattern) return true;
      const t = normalize(text || '');
      const p = normalize(pattern || '');
      if (t.includes(p)) return true;

      // subsequence check (chars in order)
      let pi = 0;
      for (let i = 0; i < t.length && pi < p.length; i++) {
        if (t[i] === p[pi]) pi++;
      }
      if (pi === p.length) return true;

      // allow small edit distance for short patterns
      const dist = levenshtein(t, p);
      const threshold = Math.max(1, Math.floor(p.length * 0.34));
      return dist <= threshold;
    };
    
    // Map status values to their display names
    const statusMap: Record<string, string> = {
      'completed': 'completada',
      'active': 'en curso',
      'cancelled': 'cancelada',
      'planned': 'planificada'
    };

    // Month names for date search
    const monthNames = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const getDateSearchValue = (dateStr: string): string => {
      try {
        const date = new Date(dateStr);
        const month = monthNames[date.getMonth()];
        const year = date.getFullYear();
        const day = String(date.getDate()).padStart(2, '0');
        return `${day} ${month} ${year}`;
      } catch {
        return dateStr;
      }
    };
    
    return data.filter(item => {
      // Apply filters first
      if (filters.project && filters.project !== 'all') {
        const projId = (item as any).project?.id || (item as any).projectId || '';
        if (projId !== filters.project) return false;
      }

      if (filters.status && filters.status !== 'all') {
        const st = (item as any).status || 'planned';
        if (st !== filters.status) return false;
      }

      if (filters.dateFrom || filters.dateTo) {
        const itemDate = new Date((item as any).date || (item as any).createdAt || null);
        if (filters.dateFrom) {
          const from = new Date(filters.dateFrom);
          if (itemDate < from) return false;
        }
        if (filters.dateTo) {
          const to = new Date(filters.dateTo);
          to.setHours(23,59,59,999);
          if (itemDate > to) return false;
        }
      }

      if (!searchTerm) return true;

      // Search logic with fuzzy matching
      const matchesSearch = searchFields.some(field => {
        const value = (item as any)[field];

        if (typeof value === 'string') {
          // For date fields, search in formatted date with month names
          if (field === 'date' || field === 'createdAt' || field === 'updatedAt') {
            const ds = getDateSearchValue(value).toLowerCase();
            return fuzzyMatch(ds, searchLower) || fuzzyMatch(value.toLowerCase(), searchLower);
          }
          return fuzzyMatch(value, searchLower);
        }
        if (typeof value === 'number') {
          return String(value).includes(searchLower);
        }
        if (Array.isArray(value)) {
          return value.some(v => typeof v === 'string' && fuzzyMatch(v, searchLower));
        }
        return false;
      }) ||
      // Also search in nested fields like project.name, created_by.name
      (
        fuzzyMatch(((item as any).project?.name || ''), searchLower) ||
        fuzzyMatch(((item as any).createdBy?.name || ''), searchLower) ||
        fuzzyMatch(((item as any).created_by?.name || ''), searchLower) ||
        String((item as any).completed_hours || (item as any).completedHours || '').includes(searchLower) ||
        // Search by status display names (Completada, En curso, etc)
        (statusMap[(item as any).status] || '').includes(searchLower)
      );

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