import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Search } from 'lucide-react';

export interface ToolbarAction {
  id: string;
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary' | 'destructive' | 'ghost';
  className?: string;
}

interface DataTableToolbarProps {
  /** Search term value */
  searchTerm: string;
  /** Callback when search term changes (with debouncing) */
  onSearchChange: (value: string) => void;
  /** Placeholder for search input */
  searchPlaceholder?: string;
  /** Array of active filter badges to display */
  activeFilters?: string[];
  /** Callback to reset all filters */
  onReset?: () => void;
  /** Array of action buttons (left side of toolbar) */
  leftActions?: ToolbarAction[];
  /** Array of action buttons (right side of toolbar) */
  rightActions?: ToolbarAction[];
  /** Content to render in the main row between search and right actions */
  mainRowContent?: React.ReactNode;
  /** Additional content/children to render below the main row */
  children?: React.ReactNode;
  /** CSS class name */
  className?: string;
  /** Debounce delay in ms */
  debounceMs?: number;
}

/**
 * Generic, flexible toolbar component for data tables and lists
 * 
 * Features:
 * - Searchable input with debouncing
 * - Customizable action buttons (left and right)
 * - Display active filter badges
 * - Reset all filters button
 * - Additional content via children
 * 
 * Usage:
 * <DataTableToolbar
 *   searchTerm={search}
 *   onSearchChange={setSearch}
 *   activeFilters={['Project: ABC', 'Status: Active']}
 *   onReset={handleReset}
 *   rightActions={[
 *     { id: 'add', label: 'Add', icon: <Plus />, onClick: handleAdd }
 *   ]}
 * />
 */
export const DataTableToolbar: React.FC<DataTableToolbarProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = 'Search...',
  activeFilters = [],
  onReset,
  leftActions = [],
  rightActions = [],
  mainRowContent,
  children,
  className = '',
  debounceMs = 300,
}) => {
  const [localInput, setLocalInput] = useState(searchTerm);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync local input when parent searchTerm changes
  useEffect(() => {
    setLocalInput(searchTerm);
  }, [searchTerm]);

  const handleInputChange = (value: string) => {
    setLocalInput(value);

    // Clear previous timer
    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    // Debounce: notify parent after specified ms
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, debounceMs);
  };

  const hasActiveFilters = activeFilters.length > 0;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main toolbar row */}
      <div className="flex flex-col lg:flex-row gap-3 items-start lg:items-center justify-between">
        {/* Left section: Search + Left Actions + Main Row Content */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center flex-1 w-full min-w-0">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={searchPlaceholder}
              value={localInput}
              onChange={(e) => handleInputChange(e.target.value)}
              className="pl-9 w-full"
              aria-label="Search"
            />
          </div>

          {/* Left actions */}
          {leftActions.length > 0 && (
            <div className="flex gap-2 flex-wrap shrink-0">
              {leftActions.map((action) => (
                <Button
                  key={action.id}
                  variant={action.variant || 'outline'}
                  onClick={action.onClick}
                  className={action.className}
                  size="sm"
                >
                  {action.icon && <span className="mr-2">{action.icon}</span>}
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Main row content (Filters, etc.) */}
          {mainRowContent && (
            <div className="flex items-center gap-3 shrink-0">
              {mainRowContent}
            </div>
          )}
        </div>

        {/* Right section: Right Actions */}
        {rightActions.length > 0 && (
          <div className="flex gap-2 flex-wrap shrink-0">
            {rightActions.map((action) => (
              <Button
                key={action.id}
                variant={action.variant || 'default'}
                onClick={action.onClick}
                className={action.className}
                size="sm"
              >
                {action.icon && <span className="mr-2">{action.icon}</span>}
                {action.label}
              </Button>
            ))}
          </div>
        )}
      </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {activeFilters.map((filter, idx) => (
            <Badge key={idx} variant="secondary" className="flex items-center gap-1">
              <span className="text-xs">{filter}</span>
            </Badge>
          ))}
          {onReset && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-6 px-2 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
      )}

      {/* Additional content */}
      {children && <div className="border-t pt-4">{children}</div>}
    </div>
  );
};

export default DataTableToolbar;
