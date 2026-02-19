import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";
import { useState, useEffect, useRef } from "react";

export interface FilterOption {
  value: string;
  label: string;
}

interface SearchFilterBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filterValue?: string;
  onFilterChange?: (value: string) => void;
  filterOptions?: FilterOption[];
  filterPlaceholder?: string;
  actions?: React.ReactNode;
  className?: string;
  projectOptions?: FilterOption[];
  projectValue?: string;
  onProjectChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  statusValue?: string;
  onStatusChange?: (value: string) => void;
  dateFrom?: string;
  dateTo?: string;
  onDateFromChange?: (v: string) => void;
  onDateToChange?: (v: string) => void;
  onReset?: () => void;
  activeCount?: number;
  activeSummary?: string[];
}

export const SearchFilterBar: React.FC<SearchFilterBarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search...",
  filterValue,
  onFilterChange,
  filterOptions = [],
  filterPlaceholder = "Filter",
  actions,
  className = ""
  ,
  projectOptions = [],
  projectValue = 'all',
  onProjectChange,
  statusOptions = [],
  statusValue = 'all',
  onStatusChange,
  dateFrom,
  dateTo,
  onDateFromChange,
  onDateToChange,
  onReset,
  activeCount: externalActiveCount,
  activeSummary: externalActiveSummary,
}) => {
  // Local input state to avoid losing focus when parent re-renders
  const [localInput, setLocalInput] = useState(searchTerm);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local input when parent searchTerm changes (only once on mount or external reset)
  useEffect(() => {
    setLocalInput(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (value: string) => {
    setLocalInput(value);
    
    // Clear previous timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    
    // Debounce: notify parent after 300ms
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300);
  };

  // Prefer externally provided active summary/count (useful when advanced filters live outside this component)
  const appliedFilters: string[] = externalActiveSummary ?? [];
  if (!externalActiveSummary) {
    if (searchTerm && searchTerm.trim().length > 0) appliedFilters.push(`Search: "${searchTerm.length > 20 ? searchTerm.slice(0, 20) + '…' : searchTerm}"`);
    if (projectOptions && projectOptions.length > 0 && projectValue && projectValue !== 'all') {
      const p = projectOptions.find(o => o.value === projectValue);
      appliedFilters.push(p ? `Project: ${p.label}` : 'Project');
    }
    if (statusOptions && statusOptions.length > 0 && statusValue && statusValue !== 'all') {
      const s = statusOptions.find(o => o.value === statusValue);
      appliedFilters.push(s ? `Status: ${s.label}` : 'Status');
    }
    if (dateFrom) appliedFilters.push(`From: ${dateFrom}`);
    if (dateTo) appliedFilters.push(`To: ${dateTo}`);
    if (filterOptions && filterOptions.length > 0 && filterValue && filterValue !== 'all') {
      const f = filterOptions.find(o => o.value === filterValue);
      appliedFilters.push(f ? `${f.label}` : 'Filter');
    }
  }

  const activeCount = typeof externalActiveCount !== 'undefined' ? externalActiveCount : appliedFilters.length;

  return (
    <Card className={`shadow-card ${className}`}>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={localInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
          
          {projectOptions && projectOptions.length > 0 && onProjectChange && (
            <Select value={projectValue} onValueChange={onProjectChange}>
              <SelectTrigger className="h-10 w-full sm:w-[180px] flex items-center px-3">
                <SelectValue placeholder="Project" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Projects</SelectItem>
                {projectOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {statusOptions && statusOptions.length > 0 && onStatusChange && (
            <Select value={statusValue} onValueChange={onStatusChange}>
              <SelectTrigger className="h-10 w-full sm:w-[140px] flex items-center px-3">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Date range filters */}
          {(onDateFromChange || onDateToChange) && (
            <div className="flex gap-2 items-center">
              <input type="date" value={dateFrom || ''} onChange={(e) => onDateFromChange && onDateFromChange(e.target.value)} className="h-10 rounded-md border px-3 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" />
              <input type="date" value={dateTo || ''} onChange={(e) => onDateToChange && onDateToChange(e.target.value)} className="h-10 rounded-md border px-3 bg-white text-gray-900 dark:bg-slate-800 dark:text-gray-100" />
            </div>
          )}

          {filterOptions && filterOptions.length > 0 && onFilterChange && (
            <Select value={filterValue} onValueChange={onFilterChange}>
              <SelectTrigger className="h-10 w-full sm:w-[180px] flex items-center px-3">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder={filterPlaceholder} />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {/* Badge removed: use Clear button count to avoid redundancy */}

          {onReset && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReset}
              className="h-10 w-32 whitespace-nowrap flex items-center justify-center"
              aria-label={activeCount > 0 ? `Clear filters (${activeCount})` : 'Clear filters'}
            >
              {`Clear${activeCount > 0 ? ` (${activeCount})` : ''}`}
            </Button>
          )}

          {actions}
        </div>
      </CardContent>
    </Card>
  );
};