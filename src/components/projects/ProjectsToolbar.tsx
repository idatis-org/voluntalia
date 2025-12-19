import { DataTableToolbar, ToolbarAction } from '@/components/common/DataTableToolbar';
import { Plus, Check, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface ProjectsFilters {
  manager?: string[];
  status?: string[];
  dateFrom?: string;
  dateTo?: string;
}

interface ProjectsToolbarProps {
  /** Search term value */
  searchTerm: string;
  /** Callback when search term changes */
  onSearchChange: (value: string) => void;
  /** Array of active filter badges to display */
  activeFilters?: string[];
  /** Callback to reset all filters */
  onReset?: () => void;
  /** Filters state */
  filters?: ProjectsFilters;
  /** Callback when a filter changes */
  onFilterChange?: (filterName: keyof ProjectsFilters, value: string | string[]) => void;
  /** List of possible managers for select */
  managers?: Array<{ id: string; name: string }>;
  /** Items per page */
  itemsPerPage?: number;
  /** Callback when items per page changes */
  onItemsPerPageChange?: (value: number) => void;
  /** Callback to open create project modal */
  onCreate: () => void;
  /** Whether user can create projects */
  canCreate: boolean;
  /** CSS class name */
  className?: string;
}

/**
 * Toolbar for Projects page
 * 
 * Features:
 * - Search projects by name or description
 * - Create Project button
 * - Display active filters
 * 
 * Usage:
 * <ProjectsToolbar
 *   searchTerm={search}
 *   onSearchChange={setSearch}
 *   activeFilters={['Search: "test"']}
 *   onReset={handleReset}
 *   onCreate={handleCreate}
 *   canCreate={isCoordinator}
 * />
 */
export const ProjectsToolbar: React.FC<ProjectsToolbarProps> = ({
  searchTerm,
  onSearchChange,
  activeFilters = [],
  onReset,
  onCreate,
  canCreate,
  filters = {},
  onFilterChange,
  managers = [],
  itemsPerPage = 12,
  onItemsPerPageChange,
  className = '',
}) => {
  const leftActions: ToolbarAction[] = [];

  const rightActions: ToolbarAction[] = canCreate
    ? [
        {
          id: 'create-project',
          label: 'Nuevo Proyecto',
          icon: <Plus className="h-4 w-4" />,
          onClick: onCreate,
          variant: 'default',
          className: 'bg-gradient-primary hover:shadow-hover transition-smooth',
        },
      ]
    : [];

  return (
    <DataTableToolbar
      searchTerm={searchTerm}
      onSearchChange={onSearchChange}
      searchPlaceholder="Buscar por nombre o descripción..."
      activeFilters={activeFilters}
      onReset={onReset}
      leftActions={leftActions}
      rightActions={rightActions}
      className={className}
      mainRowContent={
        <div className="flex items-center gap-3">
          {/* Manager dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 border-dashed shrink-0 w-[160px] justify-between px-3">
                <span className="truncate">Responsable</span>
                <div className="flex items-center shrink-0 ml-auto">
                  <div className="mx-2 h-4 w-[1px] bg-border" />
                  <div className="flex items-center justify-center bg-primary/10 text-primary min-w-[20px] h-5 px-1 rounded text-[10px] font-bold">
                    {!filters.manager || filters.manager.length === managers.length ? 'All' : filters.manager.length}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2 space-y-1">
                <div 
                  className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                  onClick={() => {
                    const allIds = managers.map(m => m.id);
                    const isAllSelected = filters.manager?.length === managers.length;
                    // If all are selected, unselecting "All" should result in an empty array (show none)
                    // If not all are selected, selecting "All" should set all IDs
                    onFilterChange && onFilterChange('manager', isAllSelected ? [] : allIds);
                  }}
                >
                  <Checkbox 
                    checked={filters.manager?.length === managers.length && managers.length > 0}
                    onCheckedChange={() => {}}
                  />
                  <span className="text-sm font-medium">Todos</span>
                </div>
                <div className="h-[1px] bg-border my-1" />
                {managers.map((m) => (
                  <div 
                    key={m.id}
                    className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                    onClick={() => {
                      const current = Array.isArray(filters.manager) ? [...filters.manager] : [];
                      const next = current.includes(m.id) 
                        ? current.filter(id => id !== m.id)
                        : [...current, m.id];
                      onFilterChange && onFilterChange('manager', next);
                    }}
                  >
                    <Checkbox 
                      checked={filters.manager?.includes(m.id)}
                      onCheckedChange={() => {}}
                    />
                    <span className="text-sm">{m.name}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Status dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <Button size="sm" variant="outline" className="h-9 border-dashed shrink-0 w-[140px] justify-between px-3">
                <span className="truncate">Estado</span>
                <div className="flex items-center shrink-0 ml-auto">
                  <div className="mx-2 h-4 w-[1px] bg-border" />
                  <div className="flex items-center justify-center bg-primary/10 text-primary min-w-[20px] h-5 px-1 rounded text-[10px] font-bold">
                      {filters.status.length === 5 ? 'All' : (filters.status.length === 2 && filters.status.includes('planned') && filters.status.includes('active') ? 'Open' : filters.status.length)}
                  </div>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0" align="start">
              <div className="p-2 space-y-1">
                <div 
                  className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                  onClick={() => {
                    const isOpen = filters.status?.includes('planned') && filters.status?.includes('active') && filters.status?.length === 2;
                    onFilterChange && onFilterChange('status', isOpen ? [] : ['planned', 'active']);
                  }}
                >
                  <Checkbox 
                    checked={filters.status?.includes('planned') && filters.status?.includes('active') && filters.status?.length === 2}
                    onCheckedChange={() => {}}
                  />
                  <span className="text-sm font-medium">Abiertos</span>
                </div>
                <div className="h-[1px] bg-border my-1" />
                {[
                  { id: 'planned', label: 'Planificado' },
                  { id: 'delayed', label: 'Demorado' },
                  { id: 'active', label: 'En progreso' },
                  { id: 'completed', label: 'Completado' },
                  { id: 'cancelled', label: 'Cancelado' }
                ].map((s) => (
                  <div 
                    key={s.id}
                    className="flex items-center space-x-2 p-2 rounded-sm hover:bg-accent cursor-pointer"
                    onClick={() => {
                      const current = Array.isArray(filters.status) ? [...filters.status] : [];
                      const next = current.includes(s.id) 
                        ? current.filter(id => id !== s.id)
                        : [...current, s.id];
                      onFilterChange && onFilterChange('status', next);
                    }}
                  >
                    <Checkbox 
                      checked={filters.status?.includes(s.id)}
                      onCheckedChange={() => {}}
                    />
                    <span className="text-sm">{s.label}</span>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          {/* Date From Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Label className="text-xs font-medium text-muted-foreground">Desde:</Label>
            <Input 
              type="date" 
              className="h-9 w-[130px] text-xs" 
              value={filters.dateFrom || ''} 
              onChange={(e) => onFilterChange && onFilterChange('dateFrom', e.target.value)} 
            />
          </div>

          {/* Date To Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <Label className="text-xs font-medium text-muted-foreground">Hasta:</Label>
            <Input 
              type="date" 
              className="h-9 w-[130px] text-xs" 
              value={filters.dateTo || ''} 
              onChange={(e) => onFilterChange && onFilterChange('dateTo', e.target.value)} 
            />
          </div>

          {/* Items per page */}
          <div className="flex items-center gap-2 shrink-0 ml-auto lg:ml-0">
            <Label className="text-xs font-medium text-muted-foreground">Mostrar:</Label>
            <Select 
              value={itemsPerPage.toString()} 
              onValueChange={(v) => onItemsPerPageChange && onItemsPerPageChange(Number(v))}
            >
              <SelectTrigger className="h-9 w-[70px] text-xs">
                <SelectValue placeholder={itemsPerPage.toString()} />
              </SelectTrigger>
              <SelectContent>
                {[12, 24, 48, 96].map(num => (
                  <SelectItem key={num} value={num.toString()} className="text-xs">
                    {num}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
    />
  );
};

export default ProjectsToolbar;
