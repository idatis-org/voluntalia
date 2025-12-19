import { useState, useMemo } from 'react';
import { useProjects } from '@/hooks/project/useProjects';

/**
 * Hook para gestionar búsqueda, filtros y paginación en Projects
 * Maneja TODO localmente para evitar que SearchFilterBar pierda el foco
 */
export const useProjectsPageToolbar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 12;

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Debounce search term locally
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    
    // Debounce: wait 300ms before updating server query
    const timer = setTimeout(() => {
      setDebouncedSearch(value);
      setPage(1);
    }, 300);
    
    return () => clearTimeout(timer);
  };

  // Call server with debounced search + pagination
  const { data, isLoading } = useProjects({
    q: debouncedSearch || undefined,
    page,
    per_page: perPage,
    include: 'counts,manager',
  });

  // Normalize response
  const raw = data as any;
  const projects = Array.isArray(raw) ? raw : (raw?.projects ?? []);

  // No filters: only search term is considered for active state
  const activeFilters: string[] = [];
  if (searchTerm && searchTerm.trim().length > 0) {
    activeFilters.push(`Search: "${searchTerm.length > 20 ? searchTerm.slice(0, 20) + '…' : searchTerm}"`);
  }

  const totalItems = raw?.meta?.total ?? projects.length;
  const totalPages = raw?.meta?.total_pages ?? Math.max(1, Math.ceil(totalItems / perPage));

  const resetSearch = () => {
    setSearchTerm('');
    setDebouncedSearch('');
    setPage(1);
  };

  return {
    // Search & Filter state
    searchTerm,
    setSearchTerm: handleSearchChange,
    debouncedSearch,
    filtersOpen,
    setFiltersOpen,
    activeFilters,
    resetSearch,

    // Create modal
    showCreateModal,
    setShowCreateModal,

    // Data
    projects,
    isLoading,
    totalItems,
    totalPages,
    page,
    setPage,
    perPage,
  };
};
